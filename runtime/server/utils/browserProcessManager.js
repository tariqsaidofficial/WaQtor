/**
 * Browser Process Manager
 * Handles cleanup of orphaned Chrome/Chromium processes and lock files
 * Prevents "browser already running" errors
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const execAsync = promisify(exec);

class BrowserProcessManager {
    constructor(sessionPath) {
        this.sessionPath = sessionPath;
        this.lockFiles = [
            'SingletonLock',
            'SingletonCookie',
            'SingletonSocket'
        ];
    }

    /**
     * Kill all Chrome/Chromium processes associated with this session
     */
    async killOrphanedBrowserProcesses() {
        try {
            const platform = process.platform;
            
            if (platform === 'darwin' || platform === 'linux') {
                // Find Chrome processes using this session path
                const { stdout } = await execAsync(
                    `ps aux | grep -i "chrome\\|chromium" | grep "${this.sessionPath}" | grep -v grep | awk '{print $2}'`
                ).catch(() => ({ stdout: '' }));

                const pids = stdout.trim().split('\n').filter(pid => pid);
                
                if (pids.length > 0) {
                    logger.info(`Found ${pids.length} orphaned browser process(es) for session path`);
                    
                    for (const pid of pids) {
                        try {
                            await execAsync(`kill -9 ${pid}`);
                            logger.info(`Killed orphaned browser process: ${pid}`);
                        } catch (error) {
                            logger.warn(`Failed to kill process ${pid}:`, error.message);
                        }
                    }
                    
                    // Wait a bit for processes to fully terminate
                    await this.sleep(1000);
                }
            } else if (platform === 'win32') {
                // Windows: Kill Chrome processes
                const { stdout } = await execAsync(
                    `wmic process where "commandline like '%${this.sessionPath.replace(/\\/g, '\\\\')}%' and name like '%chrome%'" get processid`
                ).catch(() => ({ stdout: '' }));

                const pids = stdout.split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !isNaN(line));

                if (pids.length > 0) {
                    logger.info(`Found ${pids.length} orphaned browser process(es) for session path`);
                    
                    for (const pid of pids) {
                        try {
                            await execAsync(`taskkill /F /PID ${pid}`);
                            logger.info(`Killed orphaned browser process: ${pid}`);
                        } catch (error) {
                            logger.warn(`Failed to kill process ${pid}:`, error.message);
                        }
                    }
                    
                    await this.sleep(1000);
                }
            }
        } catch (error) {
            logger.warn('Error killing orphaned browser processes:', error.message);
        }
    }

    /**
     * Remove Chrome lock files
     */
    async removeLockFiles() {
        try {
            let removedCount = 0;
            
            for (const lockFile of this.lockFiles) {
                const lockPath = path.join(this.sessionPath, lockFile);
                
                if (fs.existsSync(lockPath)) {
                    try {
                        // Try to remove file
                        fs.unlinkSync(lockPath);
                        logger.info(`Removed lock file: ${lockFile}`);
                        removedCount++;
                    } catch (error) {
                        // If file removal fails, it might be in use
                        logger.warn(`Failed to remove lock file ${lockFile}:`, error.message);
                    }
                }
            }
            
            if (removedCount > 0) {
                logger.info(`Removed ${removedCount} lock file(s)`);
            }
        } catch (error) {
            logger.warn('Error removing lock files:', error.message);
        }
    }

    /**
     * Check if browser is actually running for this session
     */
    async isBrowserRunning() {
        try {
            const platform = process.platform;
            
            if (platform === 'darwin' || platform === 'linux') {
                const { stdout } = await execAsync(
                    `ps aux | grep -i "chrome\\|chromium" | grep "${this.sessionPath}" | grep -v grep`
                ).catch(() => ({ stdout: '' }));

                return stdout.trim().length > 0;
            } else if (platform === 'win32') {
                const { stdout } = await execAsync(
                    `wmic process where "commandline like '%${this.sessionPath.replace(/\\/g, '\\\\')}%' and name like '%chrome%'" get processid`
                ).catch(() => ({ stdout: '' }));

                const pids = stdout.split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !isNaN(line));

                return pids.length > 0;
            }
            
            return false;
        } catch (error) {
            logger.warn('Error checking if browser is running:', error.message);
            return false;
        }
    }

    /**
     * Full cleanup: Kill processes and remove lock files
     */
    async fullCleanup() {
        logger.info('Starting full browser cleanup...');
        
        // Step 1: Check if browser is running
        const isRunning = await this.isBrowserRunning();
        
        if (isRunning) {
            logger.info('Browser processes detected, killing them...');
            await this.killOrphanedBrowserProcesses();
        }
        
        // Step 2: Remove lock files
        await this.removeLockFiles();
        
        // Step 3: Verify cleanup
        const stillRunning = await this.isBrowserRunning();
        
        if (stillRunning) {
            logger.warn('Some browser processes are still running after cleanup');
            return false;
        }
        
        logger.info('✅ Browser cleanup completed successfully');
        return true;
    }

    /**
     * Emergency cleanup with retries
     */
    async emergencyCleanup(maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            logger.info(`Emergency cleanup attempt ${i + 1}/${maxRetries}`);
            
            const success = await this.fullCleanup();
            
            if (success) {
                return true;
            }
            
            if (i < maxRetries - 1) {
                logger.info('Waiting before retry...');
                await this.sleep(2000);
            }
        }
        
        logger.error('Emergency cleanup failed after all retries');
        return false;
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Kill all Chrome/Chromium processes (nuclear option)
     */
    async killAllBrowserProcesses() {
        try {
            const platform = process.platform;
            
            logger.warn('⚠️ Killing ALL Chrome/Chromium processes (nuclear option)');
            
            if (platform === 'darwin' || platform === 'linux') {
                await execAsync('pkill -9 -f "chrome|chromium"').catch(() => {});
            } else if (platform === 'win32') {
                await execAsync('taskkill /F /IM chrome.exe /T').catch(() => {});
                await execAsync('taskkill /F /IM chromium.exe /T').catch(() => {});
            }
            
            await this.sleep(1000);
            logger.info('All browser processes killed');
        } catch (error) {
            logger.warn('Error killing all browser processes:', error.message);
        }
    }
}

module.exports = BrowserProcessManager;
