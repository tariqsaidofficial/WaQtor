/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../components/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Message } from 'primereact/message';
import Link from 'next/link';
import { login, isAuthenticated } from '@/lib/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/');
        }
    }, [router]);

    const handleLogin = async () => {
        console.log('🔐 Login attempt:', { email, password: '***' });
        setError('');
        setLoading(true);

        try {
            console.log('📤 Calling login API...');
            const result = await login({ email, password });
            console.log('📥 Login result:', result);

            if (result.success) {
                console.log('✅ Login successful, redirecting...');
                // Redirect to dashboard
                router.push('/');
            } else {
                console.error('❌ Login failed:', result.error);
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('❌ Login exception:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && email && password && !loading) {
            handleLogin();
        }
    };

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    return (
        <div className={containerClassName}>
            <div className='flex flex-column align-items-center justify-content-center'>
                <img
                    src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`}
                    alt='Sakai logo'
                    className='mb-5 w-6rem flex-shrink-0'
                />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                        <div className='text-center mb-5'>
                            <i className="pi pi-whatsapp text-6xl mb-3" style={{ color: 'var(--primary-color)' }}></i>
                            <div className='text-900 text-3xl font-medium mb-3'>Welcome to WaQtor!</div>
                            <span className='text-600 font-medium'>Sign in to your dashboard</span>
                        </div>

                        <div>
                            {error && (
                                <Message 
                                    severity="error" 
                                    text={error} 
                                    className="w-full mb-4"
                                />
                            )}

                            <label htmlFor='email1' className='block text-900 text-xl font-medium mb-2'>
                                Email
                            </label>
                            <InputText
                                id='email1'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Email address'
                                className='w-full md:w-30rem mb-5'
                                style={{ padding: '1rem' }}
                                disabled={loading}
                            />

                            <label htmlFor='password1' className='block text-900 font-medium text-xl mb-2'>
                                Password
                            </label>
                            <Password
                                inputId='password1'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Password'
                                toggleMask
                                feedback={false}
                                className='w-full mb-5'
                                inputClassName='w-full p-3 md:w-30rem'
                                disabled={loading}
                            ></Password>

                            <div className='flex align-items-center justify-content-between mb-5 gap-5'>
                                <div className='flex align-items-center'>
                                    <Checkbox
                                        inputId='rememberme1'
                                        checked={checked}
                                        onChange={(e) => setChecked(e.checked ?? false)}
                                        className='mr-2'
                                        disabled={loading}
                                    ></Checkbox>
                                    <label htmlFor='rememberme1'>Remember me</label>
                                </div>
                                <Link
                                    href='/auth/forgot-password'
                                    className='font-medium no-underline ml-2 text-right cursor-pointer'
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Button
                                label={loading ? 'Signing In...' : 'Sign In'}
                                icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
                                className='w-full p-3 text-xl mb-3'
                                onClick={handleLogin}
                                disabled={loading || !email || !password}
                                loading={loading}
                            />

                            <div className='text-center'>
                                <span className='text-600'>Don't have an account? </span>
                                <Link 
                                    href='/auth/signup'
                                    className='font-medium no-underline cursor-pointer'
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
