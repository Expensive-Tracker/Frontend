/* eslint-disable @typescript-eslint/no-explicit-any */
import { mixed, object, ref, string } from "yup";

export const loginValidationSchema = object({
  userNameOrEmail: string()
    .required("Username or Email is required")
    .test(
      "is-email-or-username",
      "Enter a valid email or username",
      (value) =>
        !!value &&
        (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
          /^[a-zA-Z0-9_]{3,}$/.test(value))
    ),
  password: string()
    .required("password is required")
    .min(8, "Minimum 8 character is required")
    .max(20, "Maximum 20 character is required"),
});

export const registerValidationSchema = object({
  username: string().required("Username is required"),
  email: string().required("email is required").email("enter correct email"),
  password: string()
    .required("password is required")
    .min(8, "Minimum 8 character is required")
    .max(20, "Maximum 20 character is required"),
});

export const emailValidationSchema = object({
  email: string().required("Email is required").email("enter correct email"),
});

export const otpValidationSchema = object({
  otp: mixed<string | number>()
    .test("is-valid-otp", "Otp must be a 4-digit number", (value: any) => {
      const otpStr = String(value);
      return /^\d{4}$/.test(otpStr);
    })
    .required("Otp is required"),
});

export const passwordValidationSchema = object({
  password: string()
    .required("password is required")
    .min(8, "Minimum 8 character is required")
    .max(20, "Maximum 20 character is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
  confirmPassword: string()
    .required("confirm password is required")
    .oneOf([ref("password")], "passwords dose not match"),
});
