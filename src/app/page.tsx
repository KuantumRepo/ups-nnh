import Image from "next/image";
import Link from "next/link";

export default function ForgotPassword() {
  return (
    <>
      {/* ============ HEADER ============ */}
      <header>
        {/* --- Utility Bar --- */}
        <div className="utility-bar">
          <div className="utility-bar__left">
            <a href="#">
              {/* Location pin icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
              Find Closest UPS Location
              {/* Chevron down */}
              <svg className="utility-bar__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </a>
          </div>
          <div className="utility-bar__right">
            <a href="#" className="utility-bar__link">
              {/* Bell / Alert icon */}
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
              {/* External link icon */}
              <svg className="utility-bar__external-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
            </a>
          </div>
        </div>

        {/* --- Main Navigation --- */}
        <nav className="main-header">
          <div className="main-header__left">
            <a href="#" className="main-header__logo" aria-label="UPS Home">
              <Image
                src="/ups-logo.svg"
                alt="UPS"
                width={54}
                height={64}
                priority
              />
            </a>
            <div className="main-header__nav">
              <a href="#" className="main-header__nav-link">Shipping</a>
              <a href="#" className="main-header__nav-link">Tracking</a>
              <a href="#" className="main-header__nav-link">Business Solutions</a>
              <a href="#" className="main-header__nav-link">Support</a>
            </div>
          </div>
          <div className="main-header__right">
            <button className="main-header__search-btn" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>

            {/* Mobile profile icon */}
            <button className="main-header__profile-btn" aria-label="Profile">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {/* Desktop Login Button */}
            <Link href="/login" className="main-header__login-btn">
              Log In
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <button className="main-header__hamburger" aria-label="Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>


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
