/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useRef, KeyboardEvent } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../components/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import Link from 'next/link';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const router = useRouter();
    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const handleSendCode = () => {
        // Send OTP to email
        setStep('otp');
    };

    const handleVerifyOtp = () => {
        // Verify OTP
        setStep('reset');
    };

    const handleResetPassword = () => {
        // Reset password
        setStep('success');
        setTimeout(() => {
            router.push('/auth/login');
        }, 3000);
    };

    const handleResendCode = () => {
        // Resend OTP
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.charAt(0);
        }
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
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
                    <div className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px', minWidth: '500px' }}>
                        {/* Step 1: Enter Email */}
                        {step === 'email' && (
                            <>
                                <div className='text-center mb-5'>
                                    <i className="pi pi-key text-6xl mb-3" style={{ color: 'var(--primary-color)' }}></i>
                                    <div className='text-900 text-3xl font-medium mb-3'>Forgot Password?</div>
                                    <span className='text-600 font-medium'>Enter your email to reset your password</span>
                                </div>

                                <div>
                                    <label htmlFor='email' className='block text-900 text-xl font-medium mb-2'>
                                        Email Address
                                    </label>
                                    <InputText
                                        id='email'
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='Enter your email'
                                        className='w-full mb-5'
                                        style={{ padding: '1rem' }}
                                    />

                                    <Button
                                        label='Send Verification Code'
                                        className='w-full p-3 text-xl mb-3'
                                        onClick={handleSendCode}
                                        disabled={!email}
                                    />

                                    <div className='text-center'>
                                        <Link 
                                            href='/auth/login'
                                            className='font-medium no-underline cursor-pointer'
                                            style={{ color: 'var(--primary-color)' }}
                                        >
                                            Back to Login
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 2: Verify OTP */}
                        {step === 'otp' && (
                            <div className='flex flex-column align-items-center'>
                                <i className="pi pi-shield text-6xl mb-3" style={{ color: 'var(--primary-color)' }}></i>
                                <p className='font-bold text-3xl mb-2 text-900'>Authenticate Your Account</p>
                                <p className='text-color-secondary block mb-5 text-center'>
                                    Please enter the 6-digit code sent to <strong>{email}</strong>
                                </p>
                                <div className='flex gap-2 mb-5'>
                                    {otp.map((digit, index) => (
                                        <React.Fragment key={index}>
                                            <input
                                                ref={(el) => (otpRefs.current[index] = el)}
                                                type='text'
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className='custom-otp-input'
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    fontSize: '24px',
                                                    textAlign: 'center',
                                                    border: '1px solid var(--surface-400)',
                                                    borderRadius: index === 0 || index === 3 ? '12px 0 0 12px' : index === 2 || index === 5 ? '0 12px 12px 0' : '0',
                                                    borderRight: index === 2 || index === 5 ? '1px solid var(--surface-400)' : '0',
                                                    outline: 'none',
                                                    transition: 'all 0.2s'
                                                }}
                                                onFocus={(e) => e.target.style.outline = '2px solid var(--primary-color)'}
                                                onBlur={(e) => e.target.style.outline = 'none'}
                                            />
                                            {index === 2 && (
                                                <div className='px-3 flex align-items-center'>
                                                    <i className='pi pi-minus' />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className='flex justify-content-between mt-3 w-full'>
                                    <Button 
                                        label='Resend Code' 
                                        link 
                                        className='p-0'
                                        onClick={handleResendCode}
                                    />
                                    <Button 
                                        label='Verify Code'
                                        onClick={handleVerifyOtp}
                                        disabled={otp.some(digit => !digit)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Reset Password */}
                        {step === 'reset' && (
                            <>
                                <div className='text-center mb-5'>
                                    <i className="pi pi-lock text-6xl mb-3" style={{ color: 'var(--primary-color)' }}></i>
                                    <div className='text-900 text-3xl font-medium mb-3'>Reset Password</div>
                                    <span className='text-600 font-medium'>Enter your new password</span>
                                </div>

                                <div>
                                    <label htmlFor='newPassword' className='block text-900 font-medium text-xl mb-2'>
                                        New Password
                                    </label>
                                    <Password
                                        inputId='newPassword'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder='New password'
                                        toggleMask
                                        className='w-full mb-4'
                                        inputClassName='w-full p-3'
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
                                        className='w-full mb-5'
                                        inputClassName='w-full p-3'
                                    />

                                    <Button
                                        label='Reset Password'
                                        className='w-full p-3 text-xl'
                                        onClick={handleResetPassword}
                                        disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                                    />
                                </div>
                            </>
                        )}

                        {/* Step 4: Success */}
                        {step === 'success' && (
                            <div className='text-center'>
                                <i className="pi pi-check-circle text-6xl mb-3 text-green-500"></i>
                                <div className='text-900 text-3xl font-medium mb-3'>Password Reset Successfully!</div>
                                <p className='text-600 mb-5'>
                                    Your password has been reset successfully.
                                </p>
                                <p className='text-500 text-sm'>
                                    Redirecting to login page...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
