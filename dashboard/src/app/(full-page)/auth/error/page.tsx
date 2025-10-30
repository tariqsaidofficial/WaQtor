/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from 'primereact/button';

const ErrorPage = () => {
    const router = useRouter();

    return (
        <div className='surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'>
            <div className='flex flex-column align-items-center justify-content-center'>
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.4) 10%, rgba(245, 158, 11, 0) 30%)',
                    }}
                >
                    <div
                        className='w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center'
                        style={{ borderRadius: '53px' }}
                    >
                        <div
                            className='flex justify-content-center align-items-center border-circle mb-4'
                            style={{ height: '5rem', width: '5rem', backgroundColor: '#f59e0b' }}
                        >
                            <i className='pi pi-exclamation-triangle text-5xl text-white'></i>
                        </div>
                        <h1 className='text-900 font-bold text-5xl mb-2'>Oops! Error Occurred</h1>
                        <div className='text-600 mb-5 text-center'>Something went wrong. Please try again later.</div>
                        <div className='mb-5 text-center'>
                            <i className='pi pi-times-circle text-9xl' style={{ color: '#f59e0b', opacity: 0.2 }}></i>
                        </div>
                        <div className='flex gap-3'>
                            <Button icon='pi pi-refresh' label='Try Again' onClick={() => window.location.reload()} />
                            <Button icon='pi pi-home' label='Go to Dashboard' outlined onClick={() => router.push('/')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
