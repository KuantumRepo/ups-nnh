
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });
        }

        if (!SECRET_KEY) {
            console.error("TURNSTILE_SECRET_KEY is not defined");
            return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
        }

        // Verify the token with Cloudflare
        const formData = new FormData();
        formData.append("secret", SECRET_KEY);
        formData.append("response", token);
        formData.append("remoteip", request.headers.get("x-forwarded-for") || "");

        const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
        const result = await fetch(url, {
            body: formData,
            method: "POST",
        });

        const outcome = await result.json();

        if (outcome.success) {
            // Create response and set cookie
            const response = NextResponse.json({ success: true });

            // Set a secure, HTTP-only cookie to mark the user as verified
            // Expire in 1 hour or session based on your security needs
            response.cookies.set("cf_verified", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60, // 1 hour
            });

            return response;
        } else {
            console.error("Turnstile verification failed:", outcome);
            return NextResponse.json({ success: false, message: "Verification failed", errors: outcome["error-codes"] }, { status: 400 });
        }
    } catch (error) {
        console.error("Turnstile verification error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
