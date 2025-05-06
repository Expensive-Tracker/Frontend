import { number, object, ref, string } from "yup";

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
    .max(20, "Maximum 20 character is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

export const registerValidationSchema = object({
  username: string()
    .required("Username is required")
    .matches(/[A-Z]/, "Username must contain at least one uppercase letter")
    .matches(/[0-9]/, "Username must contain at least one numeric value"),
  email: string().required("email is required").email("enter correct email"),
  password: string()
    .required("password is required")
    .min(8, "Minimum 8 character is required")
    .max(20, "Maximum 20 character is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

export const emailValidationSchema = object({
  email: string().required("Email is required").email("enter correct email"),
});

export const otpValidationSchema = object({
  otp: number()
    .typeError("Otp must be a number")
    .required("Otp is required")
    .positive("Otp must be a positive number")
    .integer("Otp must be an integer")
    .min(1000, "Otp must be 4 digits")
    .max(9999, "Otp must be 4 digits"),
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
