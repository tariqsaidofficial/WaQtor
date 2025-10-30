/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from 'primereact/button';

const AccessDeniedPage = () => {
    const router = useRouter();

    return (
        <div className='surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'>
            <div className='flex flex-column align-items-center justify-content-center'>
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.4) 10%, rgba(239, 68, 68, 0) 30%)',
                    }}
                >
                    <div
                        className='w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center'
                        style={{ borderRadius: '53px' }}
                    >
                        <div
                            className='flex justify-content-center align-items-center border-circle mb-4'
                            style={{ height: '5rem', width: '5rem', backgroundColor: '#ef4444' }}
                        >
                            <i className='pi pi-lock text-5xl text-white'></i>
                        </div>
                        <h1 className='text-900 font-bold text-5xl mb-2'>Access Denied</h1>
                        <div className='text-600 mb-5 text-center'>You do not have the necessary permissions to access this resource.</div>
                        <div className='mb-5 text-center'>
                            <i className='pi pi-shield text-9xl' style={{ color: '#ef4444', opacity: 0.2 }}></i>
                        </div>
                        <div className='flex gap-3'>
                            <Button icon='pi pi-arrow-left' label='Go to Dashboard' onClick={() => router.push('/')} />
                            <Button icon='pi pi-sign-in' label='Login' outlined onClick={() => router.push('/auth/login')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;
