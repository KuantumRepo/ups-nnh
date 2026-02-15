
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define paths that ALWAYS allow access (Public)
    const isPublicPath =
        path === "/" ||
        path.startsWith("/api/verify-challenge") ||
        path.startsWith("/_next") ||
        path.startsWith("/static") ||
        path.endsWith(".svg") ||
        path.endsWith(".png") ||
        path.endsWith(".ico") ||
        path.endsWith(".jpg");

    if (isPublicPath) {
        return NextResponse.next();
    }

    // Check for verification cookie
    const isVerified = request.cookies.get("cf_verified");

    if (!isVerified) {
        // Handle API routes differently (return 401 JSON instead of redirect)
        if (path.startsWith("/api/")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Turnstile verification required" },
                { status: 401 }
            );
        }

        // Redirect to Landing Page (Challenge) for pages
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Matches everything explicitly to ensure it runs
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
