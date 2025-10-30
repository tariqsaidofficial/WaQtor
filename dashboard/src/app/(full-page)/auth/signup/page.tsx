/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../components/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Link from 'next/link';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const handleSignup = () => {
        // Here you would typically handle signup logic
        router.push('/auth/login');
    };

    return (
        <div className={containerClassName}>
            <div className='flex flex-column align-items-center justify-content-center'>
                <img
                    src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`}
                    alt='WaQtor logo'
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
                            <i className="pi pi-user-plus text-6xl mb-3" style={{ color: 'var(--primary-color)' }}></i>
                            <div className='text-900 text-3xl font-medium mb-3'>Create Account</div>
                            <span className='text-600 font-medium'>Sign up to get started with WaQtor</span>
                        </div>

                        <div>
                            <label htmlFor='name' className='block text-900 text-xl font-medium mb-2'>
                                Full Name
                            </label>
                            <InputText
                                id='name'
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Enter your full name'
                                className='w-full md:w-30rem mb-4'
                                style={{ padding: '1rem' }}
                            />

                            <label htmlFor='email' className='block text-900 text-xl font-medium mb-2'>
                                Email
                            </label>
                            <InputText
                                id='email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email address'
                                className='w-full md:w-30rem mb-4'
                                style={{ padding: '1rem' }}
                            />

                            <label htmlFor='password' className='block text-900 font-medium text-xl mb-2'>
                                Password
                            </label>
                            <Password
                                inputId='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                toggleMask
                                className='w-full mb-4'
                                inputClassName='w-full p-3 md:w-30rem'
                            />

                            <label htmlFor='confirmPassword' className='block text-900 font-medium text-xl mb-2'>
                                Confirm Password
                            </label>
                            <Password
                                inputId='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm password'
                                toggleMask
                                feedback={false}
                                className='w-full mb-4'
                                inputClassName='w-full p-3 md:w-30rem'
                            />

                            <div className='flex align-items-center mb-5'>
                                <Checkbox
                                    inputId='agree'
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.checked ?? false)}
                                    className='mr-2'
                                />
                                <label htmlFor='agree' className='text-900'>
                                    I agree to the{' '}
                                    <a
                                        className='font-medium no-underline cursor-pointer'
                                        style={{ color: 'var(--primary-color)' }}
                                    >
                                        Terms & Conditions
                                    </a>
                                </label>
                            </div>

                            <Button
                                label='Sign Up'
                                className='w-full p-3 text-xl mb-3'
                                onClick={handleSignup}
                                disabled={!name || !email || !password || !confirmPassword || !agreed || password !== confirmPassword}
                            />

                            <div className='text-center'>
                                <span className='text-600'>Already have an account? </span>
                                <Link 
                                    href='/auth/login'
                                    className='font-medium no-underline cursor-pointer'
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
