"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function VerifyPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ fullName, phone });
        router.push("/success");
    };

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
                {/* --- Card Section --- */}
                <section className="cards-section">
                    <div className="cards-section__inner">
                        <div className="card verify-card">
                            <h2 className="card__title">Delivery Contact Details</h2>
                            <p className="card__description">
                                To ensure your package is delivered smoothly, please confirm or update your contact details. Our delivery support team may reach out if there are any issues with your shipment.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="verify-name"
                                        className="form-group__input"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        autoComplete="name"
                                        required
                                    />
                                    <label htmlFor="verify-name" className="form-group__label">Full Name</label>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        id="verify-phone"
                                        className="form-group__input"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        autoComplete="tel"
                                        required
                                    />
                                    <label htmlFor="verify-phone" className="form-group__label">Phone Number</label>
                                </div>
                                <div className="verify-trust">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
                                    </svg>
                                    <span>Your information is protected by UPS privacy policy</span>
                                </div>
                                <button type="submit" className="btn-primary">
                                    Confirm Details
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                    </svg>
                                </button>
                            </form>
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
