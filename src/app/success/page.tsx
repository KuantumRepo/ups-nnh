"use client";

import Image from "next/image";

export default function SuccessPage() {
    return (
        <>
            {/* ============ HEADER ============ */}
            <header>
                {/* --- Utility Bar --- */}
                <div className="utility-bar">
                    <div className="utility-bar__left">
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                            </svg>
                            Find Closest UPS Location
                            <svg className="utility-bar__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </a>
                    </div>
                    <div className="utility-bar__right">
                        <a href="#" className="utility-bar__link">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                            </svg>
                            Alerts
                            <span className="utility-bar__alert-badge">1</span>
                        </a>
                        <a href="#" className="utility-bar__link utility-bar__link--language">
                            Canada - English
                            <svg className="utility-bar__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z" />
                            </svg>
                        </a>
                        <a href="#" className="utility-bar__link utility-bar__link--about">
                            About UPS
                            <svg className="utility-bar__external-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* --- Main Navigation --- */}
                <nav className="main-header">
                    <div className="main-header__left">
                        <a href="https://www.ups.com" className="main-header__logo">
                            <Image src="/ups-logo.svg" alt="UPS Logo" width={45} height={55} priority />
                        </a>
                        <div className="main-header__nav-links">
                            <a href="#" className="main-header__nav-item">Shipping <svg className="main-header__nav-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg></a>
                            <a href="#" className="main-header__nav-item">Tracking</a>
                            <a href="#" className="main-header__nav-item">Support <svg className="main-header__nav-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg></a>
                        </div>
                    </div>
                    <div className="main-header__right">
                        <button className="main-header__search-btn" aria-label="Search">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </button>

                        {/* Mobile profile icon */}
                        <button className="main-header__profile-btn" aria-label="Profile">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </button>

                        <span className="main-header__account-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            My Account
                        </span>

                        {/* Mobile hamburger */}
                        <button className="main-header__hamburger" aria-label="Menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* ============ MAIN CONTENT ============ */}
            <main>
                {/* --- Hero Section --- */}
                <section className="hero-section">
                    <div className="hero-section__inner">
                        <h1 className="hero-section__title">You&apos;re All Set!</h1>
                    </div>
                </section>

                {/* --- Success Card --- */}
                <section className="cards-section">
                    <div className="cards-section__inner">
                        <div className="card success-card">
                            {/* Green Checkmark */}
                            <div className="success-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>

                            <h2 className="card__title success-title">Your details have been updated</h2>
                            <p className="card__description">
                                Our delivery support team will be in touch if there are any questions about your package. You can expect a call or text to the number you provided.
                            </p>

                            <div className="success-info-box">
                                <div className="success-info-box__row">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                                    </svg>
                                    <span>A confirmation has been sent to your email</span>
                                </div>
                                <div className="success-info-box__row">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                    </svg>
                                    <span>Delivery support may contact you at the number provided</span>
                                </div>
                            </div>

                            <a href="https://www.ups.com" className="btn-primary">
                                Return to UPS Home
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* ============ FOOTER ============ */}
            <footer className="site-footer">
                <div className="site-footer__inner">
                    <div className="site-footer__links">
                        <a href="#" className="site-footer__link">Contact UPS</a>
                        <span className="site-footer__separator">|</span>
                        <a href="#" className="site-footer__link">Privacy Notice</a>
                        <span className="site-footer__separator">|</span>
                        <a href="#" className="site-footer__link">Terms of Use</a>
                        <span className="site-footer__separator">|</span>
                        <a href="#" className="site-footer__link">Website Feedback</a>
                        <span className="site-footer__separator">|</span>
                        <a href="#" className="site-footer__link">Accessibility</a>
                    </div>
                    <p className="site-footer__copyright">
                        Copyright ©1994-2025 United Parcel Service of America, Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
