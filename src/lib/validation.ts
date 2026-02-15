import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

// --- Login Schema ---
export const loginSchema = z.object({
    accountType: z.enum(["personal", "business"]),
    username: z
        .string()
        .min(1, "Username/Email is required")
        .email({ message: "Please enter a valid email address" })
        .or(z.string().min(3, "Username must be at least 3 characters")), // Allow email OR username
    password: z.string().min(1, "Password is required"),
    companyName: z.string().optional(),
}).refine((data) => {
    if (data.accountType === "business" && !data.companyName) {
        return false;
    }
    return true;
}, {
    message: "Company Name is required for Business accounts",
    path: ["companyName"],
});

export type LoginFormData = z.infer<typeof loginSchema>;

// --- Verify Schema ---
export const verifySchema = z.object({
    fullName: z
        .string()
        .min(1, "Full Name is required")
        .refine((val) => val.trim().split(" ").length >= 2, {
            message: "Please enter your full name (First and Last name)",
        }),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .refine((val) => isValidPhoneNumber(val, "US"), { // Default to US, but library handles intl format if provided with + country code
            message: "Please enter a valid phone number",
        }),
});

export type VerifyFormData = z.infer<typeof verifySchema>;
