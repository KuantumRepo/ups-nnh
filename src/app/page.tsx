"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Turnstile from "react-turnstile";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (token: string) => {
    setVerifying(true);
    setError(null);

    try {
      const response = await fetch("/api/verify-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        // Successful verification
        router.push("/login");
      } else {
        setError(data.message || "Verification failed. Please try again.");
        setVerifying(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setVerifying(false);
    }
  };

  return (
    <div className="page-wrapper">

      <main className="security-main">
        <div className="security-card">
          <div className="card-header">
            <Image
              src="/ups-logo.svg"
              alt="UPS"
              width={64}
              height={76}
              priority
              className="security-logo"
            />
          </div>

          <p className="security-text">
            Our systems have detected a new session request. Please complete the security check below to proceed to the secure portal.
          </p>

          <div className="turnstile-wrapper">
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onVerify={handleVerify}
              theme="dark"
              size="normal"
            />
          </div>

          {verifying && !error && (
            <p className="status-msg verifying">Verifying secure connection...</p>
          )}

          {error && (
            <p className="status-msg error">{error}</p>
          )}

          <div className="security-badge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            Protected by UPS Cyber Security
          </div>
        </div>
      </main>


      <style jsx global>{`
        :root {
            --ups-brown: #351C15;
            --ups-gold: #FFC400;
            --ups-white: #FFFFFF;
            --card-bg: rgba(20, 20, 20, 0.6);
            --border-color: rgba(255, 196, 0, 0.2);
        }

        body {
          margin: 0;
          padding: 0;
          font-family: var(--font-primary, sans-serif);
          background-color: var(--ups-brown);
        }
        
        .page-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .security-main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at 50% 50%, #4a2c22 0%, #1a0e0a 100%);
            padding: 20px;
            position: relative;
        }

        /* Glassmorphism Card */
        .security-card {
            position: relative;
            z-index: 10;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 8px;
            padding: 48px;
            width: 100%;
            max-width: 480px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            text-align: center;
            border: 1px solid var(--border-color);
            border-top: 4px solid var(--ups-gold); /* Gold Top Border */
        }

        .card-header {
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 24px;
            display: flex;
            justify-content: center; /* Center the logo */
        }

        .security-logo {
            display: block;
            margin: 0 auto;
        }

        .security-text {
            color: rgba(255,255,255,0.8);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .turnstile-wrapper {
            background: rgba(0, 0, 0, 0.2);
            padding: 24px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.05);
            display: flex;
            justify-content: center;
            margin-bottom: 24px;
            min-height: 80px;
        }

        .status-msg {
            font-size: 14px;
            margin-top: 12px;
            font-weight: 500;
        }
        .status-msg.verifying { color: var(--ups-gold); }
        .status-msg.error { color: #ff4444; }

        .security-badge {
            margin-top: 24px;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Mobile Adjustments */
        @media (max-width: 480px) {
            .security-card {
                padding: 24px 20px; /* Drastically reduce padding */
                width: 95%; /* maximize width */
            }

            .turnstile-wrapper {
                padding: 20px 10px; /* Minimal padding around widget */
                min-height: auto;
            }
            
            .security-logo {
                width: 48px; /* Slightly smaller logo */
                height: auto;
            }
        }
      `}</style>
    </div>
  );
}
