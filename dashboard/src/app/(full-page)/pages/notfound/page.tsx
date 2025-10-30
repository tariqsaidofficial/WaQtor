import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
    return (
        <div className='surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'>
            <div className='flex flex-column align-items-center justify-content-center'>
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div
                        className='w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center'
                        style={{ borderRadius: '53px', minWidth: '400px' }}
                    >
                        <div className='mb-4'>
                            <span className='text-primary font-bold' style={{ fontSize: '8rem', lineHeight: '1' }}>404</span>
                        </div>
                        <h1 className='text-900 font-bold text-5xl mb-2'>Page Not Found</h1>
                        <div className='text-600 mb-5 text-center'>The page you are looking for does not exist or has been moved.</div>
                        
                        <div className='mb-5 text-center'>
                            <i className='pi pi-search text-9xl' style={{ color: 'var(--primary-color)', opacity: 0.2 }}></i>
                        </div>

                        <div className='w-full mb-4'>
                            <Link href='/' className='w-full flex align-items-center py-4 px-3 border-300 border-bottom-1 hover:surface-hover transition-colors transition-duration-150'>
                                <span
                                    className='flex justify-content-center align-items-center border-round'
                                    style={{ height: '3rem', width: '3rem', backgroundColor: 'var(--primary-color)' }}
                                >
                                    <i className='text-white pi pi-home text-xl'></i>
                                </span>
                                <span className='ml-3 flex flex-column'>
                                    <span className='text-900 font-medium mb-1'>Dashboard</span>
                                    <span className='text-600 text-sm'>Go back to main dashboard</span>
                                </span>
                            </Link>
                            <Link href='/about' className='w-full flex align-items-center py-4 px-3 border-300 border-bottom-1 hover:surface-hover transition-colors transition-duration-150'>
                                <span
                                    className='flex justify-content-center align-items-center border-round'
                                    style={{ height: '3rem', width: '3rem', backgroundColor: '#3b82f6' }}
                                >
                                    <i className='pi pi-info-circle text-white text-xl'></i>
                                </span>
                                <span className='ml-3 flex flex-column'>
                                    <span className='text-900 font-medium mb-1'>About & FAQ</span>
                                    <span className='text-600 text-sm'>Learn more about WaQtor</span>
                                </span>
                            </Link>
                            <Link href='/messages' className='w-full flex align-items-center py-4 px-3 hover:surface-hover transition-colors transition-duration-150'>
                                <span
                                    className='flex justify-content-center align-items-center border-round'
                                    style={{ height: '3rem', width: '3rem', backgroundColor: '#10b981' }}
                                >
                                    <i className='pi pi-send text-white text-xl'></i>
                                </span>
                                <span className='ml-3 flex flex-column'>
                                    <span className='text-900 font-medium mb-1'>Messages</span>
                                    <span className='text-600 text-sm'>Send WhatsApp messages</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
