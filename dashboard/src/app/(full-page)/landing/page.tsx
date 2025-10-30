'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef, useState } from 'react';
import Link from 'next/link';

import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { LayoutContext } from '../../../components/layout/context/layoutcontext';
import { NodeRef } from '@/types';
import { classNames } from 'primereact/utils';

const LandingPage = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    return (
        <div className='surface-0 flex justify-content-center'>
            <div id='home' className='landing-wrapper overflow-hidden'>
                <div className='py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static'>
                    <Link href='/' className='flex align-items-center'>
                        <img
                            src={`/layout/images/${
                                layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'
                            }.svg`}
                            alt='Sakai Logo'
                            height='50'
                            className='mr-0 lg:mr-2'
                        />
                        <span className='text-900 font-medium text-2xl line-height-3 mr-8'>WaQtor</span>
                    </Link>
                    <StyleClass
                        nodeRef={menuRef as NodeRef}
                        selector='@next'
                        enterClassName='hidden'
                        leaveToClassName='hidden'
                        hideOnOutsideClick
                    >
                        <i ref={menuRef} className='pi pi-bars text-4xl cursor-pointer block lg:hidden text-700'></i>
                    </StyleClass>
                    <div
                        className={classNames(
                            'align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2',
                            { hidden: isHidden }
                        )}
                        style={{ top: '100%' }}
                    >
                        <ul className='list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer'>
                            <li>
                                <a
                                    href='#home'
                                    onClick={toggleMenuItemClick}
                                    className='p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3'
                                >
                                    <span>Home</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#features'
                                    onClick={toggleMenuItemClick}
                                    className='p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3'
                                >
                                    <span>Features</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#highlights'
                                    onClick={toggleMenuItemClick}
                                    className='p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3'
                                >
                                    <span>Highlights</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#pricing'
                                    onClick={toggleMenuItemClick}
                                    className='p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3'
                                >
                                    <span>Pricing</span>
                                    <Ripple />
                                </a>
                            </li>
                        </ul>
                        <div className='flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0'>
                            <Link href='/auth/login'>
                                <Button
                                    label='Login'
                                    text
                                    rounded
                                    className='border-none font-light line-height-2'
                                    style={{ color: 'var(--primary-color)' }}
                                />
                            </Link>
                            <Link href='/auth/signup'>
                                <Button
                                    label='Get Started'
                                    rounded
                                    className='border-none ml-5 font-light line-height-2 text-white'
                                    style={{ backgroundColor: 'var(--primary-color)' }}
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div id='hero' className='grid grid-nogutter surface-0 text-800'>
                    <div className='col-12 md:col-6 p-6 text-center md:text-left flex align-items-center'>
                        <section>
                            <span className='block text-6xl font-bold mb-1'>WhatsApp Business</span>
                            <div className='text-6xl font-bold mb-3' style={{ color: 'var(--primary-color)' }}>
                                API Made Simple
                            </div>
                            <p className='mt-0 mb-4 text-700 line-height-3'>
                                Send messages, manage campaigns, and automate customer interactions with our powerful WhatsApp Business API platform.
                            </p>

                            <Link href='/auth/signup'>
                                <Button 
                                    label='Get Started Free' 
                                    type='button' 
                                    className='mr-3 p-button-raised'
                                    style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                                />
                            </Link>
                            <Link href='/'>
                                <Button label='Live Demo' type='button' className='p-button-outlined' />
                            </Link>
                        </section>
                    </div>
                    <div className='col-12 md:col-6 overflow-hidden flex align-items-center justify-content-center p-6'>
                        <i className='pi pi-whatsapp' style={{ fontSize: '20rem', color: 'var(--primary-color)', opacity: 0.1 }}></i>
                    </div>
                </div>

                {/* Features Section */}
                <div id='features' className='surface-0 text-center py-8 px-4 lg:px-8'>
                    <div className='mb-3 font-bold text-3xl'>
                        <span className='text-900'>One Product, </span>
                        <span style={{ color: 'var(--primary-color)' }}>Many Solutions</span>
                    </div>
                    <div className='text-700 mb-6'>Powerful WhatsApp Business API platform with everything you need to succeed.</div>
                    <div className='grid'>
                        <div className='col-12 md:col-4 mb-4 px-5'>
                            <span className='p-3 shadow-2 mb-3 inline-block' style={{ borderRadius: '10px' }}>
                                <i className='pi pi-code text-4xl' style={{ color: 'var(--primary-color)' }}></i>
                            </span>
                            <div className='text-900 text-xl mb-3 font-medium'>Built for Developers</div>
                            <span className='text-700 line-height-3'>
                                RESTful API, WebSocket support, and comprehensive documentation for seamless integration.
                            </span>
                        </div>
                        <div className='col-12 md:col-4 mb-4 px-5'>
                            <span className='p-3 shadow-2 mb-3 inline-block' style={{ borderRadius: '10px' }}>
                                <i className='pi pi-lock text-4xl' style={{ color: 'var(--primary-color)' }}></i>
                            </span>
                            <div className='text-900 text-xl mb-3 font-medium'>End-to-End Encryption</div>
                            <span className='text-700 line-height-3'>
                                Your messages are secured with WhatsApp's end-to-end encryption protocol.
                            </span>
                        </div>
                        <div className='col-12 md:col-4 mb-4 px-5'>
                            <span className='p-3 shadow-2 mb-3 inline-block' style={{ borderRadius: '10px' }}>
                                <i className='pi pi-check-circle text-4xl' style={{ color: 'var(--primary-color)' }}></i>
                            </span>
                            <div className='text-900 text-xl mb-3 font-medium'>Easy to Use</div>
                            <span className='text-700 line-height-3'>
                                Intuitive dashboard with drag-and-drop campaign builder and real-time analytics.
                            </span>
                        </div>
                        <div className='col-12 md:col-4 mb-4 px-5'>
                            <span className='p-3 shadow-2 mb-3 inline-block' style={{ borderRadius: '10px' }}>
                                <i className='pi pi-bolt text-4xl' style={{ color: 'var(--primary-color)' }}></i>
                            </span>
                            <div className='text-900 text-xl mb-3 font-medium'>Fast & Reliable</div>
                            <span className='text-700 line-height-3'>
                                High-performance infrastructure with 99.9% uptime and instant message delivery.
                            </span>
                        </div>
                        <div className='col-12 md:col-4 mb-4 px-5'>
                            <span className='p-3 shadow-2 mb-3 inline-block' style={{ borderRadius: '10px' }}>
                                <i className='pi pi-github text-4xl' style={{ color: 'var(--primary-color)' }}></i>
                            </span>
                            <div className='text-900 text-xl mb-3 font-medium'>Open Source</div>
                            <span className='text-700 line-height-3'>
                                Built on open-source technologies with active community support and contributions.
                            </span>
                        </div>
                        <div className='col-12 md:col-4 md:mb-4 mb-0 px-3'>
                            <span className='p-3 shadow-2 mb-3 inline-block' style={{ borderRadius: '10px' }}>
                                <i className='pi pi-shield text-4xl' style={{ color: 'var(--primary-color)' }}></i>
                            </span>
                            <div className='text-900 text-xl mb-3 font-medium'>Trusted Security</div>
                            <span className='text-700 line-height-3'>
                                Enterprise-grade security with OAuth 2.0, API keys, and role-based access control.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Old Features Grid - Keep for reference */}
                <div className='py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8' style={{ display: 'none' }}>
                    <div className='grid justify-content-center'>
                        <div className='col-12 text-center mt-8 mb-4'>
                            <h2 className='text-900 font-normal mb-2'>Marvelous Features</h2>
                            <span className='text-600 text-2xl'>Placerat in egestas erat...</span>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-yellow-200 mb-3'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-users text-2xl text-yellow-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Easy to Use</h5>
                                    <span className='text-600'>Posuere morbi leo urna molestie.</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(145,226,237,0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-cyan-200 mb-3'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-palette text-2xl text-cyan-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Fresh Design</h5>
                                    <span className='text-600'>Semper risus in hendrerit.</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-indigo-200'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-map text-2xl text-indigo-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Well Documented</h5>
                                    <span className='text-600'>Non arcu risus quis varius quam quisque.</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(187, 199, 205, 0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2),rgba(145, 210, 204, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-bluegray-200 mb-3'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-id-card text-2xl text-bluegray-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Responsive Layout</h5>
                                    <span className='text-600'>Nulla malesuada pellentesque elit.</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(187, 199, 205, 0.2),rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2),rgba(160, 210, 250, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-orange-200 mb-3'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-star text-2xl text-orange-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Clean Code</h5>
                                    <span className='text-600'>Condimentum lacinia quis vel eros.</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-pink-200 mb-3'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-moon text-2xl text-pink-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Dark Mode</h5>
                                    <span className='text-600'>Convallis tellus id interdum velit laoreet.</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-teal-200 mb-3'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-shopping-cart text-2xl text-teal-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Ready to Use</h5>
                                    <span className='text-600'>Mauris sit amet massa vitae.</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-blue-200 mb-3'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-globe text-2xl text-blue-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Modern Practices</h5>
                                    <span className='text-600'>Elementum nibh tellus molestie nunc non.</span>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 md:col-12 lg:col-4 p-0 lg-4 mt-4 lg:mt-0'>
                            <div
                                style={{
                                    height: '160px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background:
                                        'linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))',
                                }}
                            >
                                <div className='p-3 surface-card h-full' style={{ borderRadius: '8px' }}>
                                    <div
                                        className='flex align-items-center justify-content-center bg-purple-200 mb-3'
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <i className='pi pi-fw pi-eye text-2xl text-purple-700'></i>
                                    </div>
                                    <h5 className='mb-2 text-900'>Privacy</h5>
                                    <span className='text-600'>Neque egestas congue quisque.</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className='col-12 mt-8 mb-8 p-2 md:p-8'
                            style={{
                                borderRadius: '20px',
                                background:
                                    'linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EFE1AF 0%, #C3DCFA 100%)',
                            }}
                        >
                            <div className='flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0'>
                                <h3 className='text-gray-900 mb-2'>Joséphine Miller</h3>
                                <span className='text-gray-600 text-2xl'>Peak Interactive</span>
                                <p
                                    className='text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4'
                                    style={{ maxWidth: '800px' }}
                                >
                                    “Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                                    qui officia deserunt mollit anim id est laborum.”
                                </p>
                                <img src='/demo/images/landing/peak-logo.svg' className='mt-4' alt='Company logo' />
                            </div>
                        </div>
                    </div>
                </div>

                <div id='highlights' className='py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8'>
                    <div className='text-center'>
                        <h2 className='text-900 font-normal mb-2'>Powerful Everywhere</h2>
                        <span className='text-600 text-2xl'>Amet consectetur adipiscing elit...</span>
                    </div>

                    <div className='grid mt-8 pb-2 md:pb-8'>
                        <div
                            className='flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0'
                            style={{ borderRadius: '8px' }}
                        >
                            <img src='/demo/images/landing/mockup.svg' className='w-11' alt='mockup mobile' />
                        </div>

                        <div className='col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right'>
                            <div
                                className='flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end'
                                style={{
                                    width: '4.2rem',
                                    height: '4.2rem',
                                    borderRadius: '10px',
                                }}
                            >
                                <i className='pi pi-fw pi-mobile text-5xl text-purple-700'></i>
                            </div>
                            <h2 className='line-height-1 text-900 text-4xl font-normal'>Congue Quisque Egestas</h2>
                            <span
                                className='text-700 text-2xl line-height-3 ml-0 md:ml-2'
                                style={{ maxWidth: '650px' }}
                            >
                                Lectus arcu bibendum at varius vel pharetra vel turpis nunc. Eget aliquet nibh praesent
                                tristique magna sit amet purus gravida. Sit amet mattis vulputate enim nulla aliquet.
                            </span>
                        </div>
                    </div>

                    <div className='grid my-8 pt-2 md:pt-8'>
                        <div className='col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start'>
                            <div
                                className='flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start'
                                style={{
                                    width: '4.2rem',
                                    height: '4.2rem',
                                    borderRadius: '10px',
                                }}
                            >
                                <i className='pi pi-fw pi-desktop text-5xl text-yellow-700'></i>
                            </div>
                            <h2 className='line-height-1 text-900 text-4xl font-normal'>Celerisque Eu Ultrices</h2>
                            <span
                                className='text-700 text-2xl line-height-3 mr-0 md:mr-2'
                                style={{ maxWidth: '650px' }}
                            >
                                Adipiscing commodo elit at imperdiet dui. Viverra nibh cras pulvinar mattis nunc sed
                                blandit libero. Suspendisse in est ante in. Mauris pharetra et ultrices neque ornare
                                aenean euismod elementum nisi.
                            </span>
                        </div>

                        <div
                            className='flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0'
                            style={{ borderRadius: '8px' }}
                        >
                            <img src='/demo/images/landing/mockup-desktop.svg' className='w-11' alt='mockup' />
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div id='pricing' className='surface-0 py-8 px-4 lg:px-8'>
                    <div className='text-900 font-bold text-6xl mb-4 text-center'>Pricing Plans</div>
                    <div className='text-700 text-xl mb-6 text-center line-height-3'>
                        Choose the perfect plan for your business needs
                    </div>

                    <div className='grid'>
                        <div className='col-12 lg:col-4'>
                            <div className='p-3 h-full'>
                                <div className='shadow-2 p-3 h-full flex flex-column' style={{ borderRadius: '6px' }}>
                                    <div className='text-900 font-medium text-xl mb-2'>Basic</div>
                                    <div className='text-600'>Perfect for getting started</div>
                                    <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />
                                    <div className='flex align-items-center'>
                                        <span className='font-bold text-2xl text-900'>$9</span>
                                        <span className='ml-2 font-medium text-600'>per month</span>
                                    </div>
                                    <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />
                                    <ul className='list-none p-0 m-0 flex-grow-1'>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>1,000 messages/month</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Basic analytics</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Email support</span>
                                        </li>
                                    </ul>
                                    <hr className='mb-3 mx-0 border-top-1 border-bottom-none border-300 mt-auto' />
                                    <Button label='Buy Now' className='p-3 w-full mt-auto' />
                                </div>
                            </div>
                        </div>

                        <div className='col-12 lg:col-4'>
                            <div className='p-3 h-full'>
                                <div className='shadow-2 p-3 h-full flex flex-column' style={{ borderRadius: '6px' }}>
                                    <div className='text-900 font-medium text-xl mb-2'>Premium</div>
                                    <div className='text-600'>For growing businesses</div>
                                    <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />
                                    <div className='flex align-items-center'>
                                        <span className='font-bold text-2xl text-900'>$29</span>
                                        <span className='ml-2 font-medium text-600'>per month</span>
                                    </div>
                                    <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />
                                    <ul className='list-none p-0 m-0 flex-grow-1'>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>10,000 messages/month</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Advanced analytics</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Campaign management</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Priority support</span>
                                        </li>
                                    </ul>
                                    <hr className='mb-3 mx-0 border-top-1 border-bottom-none border-300' />
                                    <Button label='Buy Now' className='p-3 w-full' />
                                </div>
                            </div>
                        </div>

                        <div className='col-12 lg:col-4'>
                            <div className='p-3 h-full'>
                                <div className='shadow-2 p-3 flex flex-column' style={{ borderRadius: '6px' }}>
                                    <div className='text-900 font-medium text-xl mb-2'>Enterprise</div>
                                    <div className='text-600'>For large organizations</div>
                                    <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />
                                    <div className='flex align-items-center'>
                                        <span className='font-bold text-2xl text-900'>$49</span>
                                        <span className='ml-2 font-medium text-600'>per month</span>
                                    </div>
                                    <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />
                                    <ul className='list-none p-0 m-0 flex-grow-1'>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Unlimited messages</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Custom analytics</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Advanced automation</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Dedicated support</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>Custom integrations</span>
                                        </li>
                                        <li className='flex align-items-center mb-3'>
                                            <i className='pi pi-check-circle text-green-500 mr-2'></i>
                                            <span>SLA guarantee</span>
                                        </li>
                                    </ul>
                                    <hr className='mb-3 mx-0 border-top-1 border-bottom-none border-300' />
                                    <Button label='Buy Now' className='p-3 w-full p-button-outlined' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className='surface-0 text-700 text-center py-8 px-4'>
                    <div className='font-bold mb-3' style={{ color: 'var(--primary-color)' }}>
                        <i className='pi pi-whatsapp'></i>&nbsp;POWERED BY WHATSAPP
                    </div>
                    <div className='text-900 font-bold text-5xl mb-3'>Join Our Community</div>
                    <div className='text-700 text-2xl mb-5'>
                        Get started with WaQtor today and transform your WhatsApp Business communication
                    </div>
                    <Link href='/auth/signup'>
                        <Button 
                            label='Get Started Now' 
                            icon='pi pi-arrow-right' 
                            className='font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap'
                            style={{ backgroundColor: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
                        />
                    </Link>
                </div>

                <div className='py-4 px-4 mx-0 mt-8 lg:mx-8'>
                    <div className='grid justify-content-between'>
                        <div className='col-12 md:col-2' style={{ marginTop: '-1.5rem' }}>
                            <Link
                                href='/'
                                className='flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer'
                            >
                                <img
                                    src={`/layout/images/${
                                        layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'
                                    }.svg`}
                                    alt='footer sections'
                                    width='50'
                                    height='50'
                                    className='mr-2'
                                />
                                <span className='font-medium text-3xl text-900'>WaQtor</span>
                            </Link>
                        </div>

                        <div className='col-12 md:col-10 lg:col-7'>
                            <div className='grid text-center md:text-left'>
                                <div className='col-12 md:col-3'>
                                    <h4 className='font-medium text-2xl line-height-3 mb-3 text-900'>Company</h4>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>About Us</a>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>News</a>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>
                                        Investor Relations
                                    </a>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>Careers</a>
                                    <a className='line-height-3 text-xl block cursor-pointer text-700'>Media Kit</a>
                                </div>

                                <div className='col-12 md:col-3 mt-4 md:mt-0'>
                                    <h4 className='font-medium text-2xl line-height-3 mb-3 text-900'>Resources</h4>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>
                                        Get Started
                                    </a>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>Learn</a>
                                    <a className='line-height-3 text-xl block cursor-pointer text-700'>Case Studies</a>
                                </div>

                                <div className='col-12 md:col-3 mt-4 md:mt-0'>
                                    <h4 className='font-medium text-2xl line-height-3 mb-3 text-900'>Community</h4>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>Discord</a>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>
                                        Events
                                        <img src='/demo/images/landing/new-badge.svg' className='ml-2' alt='badge' />
                                    </a>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>FAQ</a>
                                    <a className='line-height-3 text-xl block cursor-pointer text-700'>Blog</a>
                                </div>

                                <div className='col-12 md:col-3 mt-4 md:mt-0'>
                                    <h4 className='font-medium text-2xl line-height-3 mb-3 text-900'>Legal</h4>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>
                                        Brand Policy
                                    </a>
                                    <a className='line-height-3 text-xl block cursor-pointer mb-2 text-700'>
                                        Privacy Policy
                                    </a>
                                    <a className='line-height-3 text-xl block cursor-pointer text-700'>
                                        Terms of Service
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
