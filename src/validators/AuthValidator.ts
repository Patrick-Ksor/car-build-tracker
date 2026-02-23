import { BaseValidator } from "./BaseValidator";
import type { LoginPayload, RegisterPayload } from "@/types";

export class LoginValidator extends BaseValidator<LoginPayload> {
  protected rules: Partial<
    Record<keyof LoginPayload, (val: unknown) => string | null>
  > = {
    email: (val) => {
      if (!val || String(val).trim().length === 0) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)))
        return "Please enter a valid email address";
      return null;
    },
    password: (val) => {
      if (!val || String(val).length === 0) return "Password is required";
      return null;
    },
  };
}

export class RegisterValidator extends BaseValidator<RegisterPayload> {
  protected rules: Partial<
    Record<keyof RegisterPayload, (val: unknown) => string | null>
  > = {
    email: (val) => {
      if (!val || String(val).trim().length === 0) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)))
        return "Please enter a valid email address";
      return null;
    },
    username: (val) => {
      if (!val || String(val).trim().length === 0)
        return "Username is required";
      if (String(val).trim().length < 3)
        return "Username must be at least 3 characters";
      if (String(val).trim().length > 30)
        return "Username must be 30 characters or fewer";
      if (!/^[a-zA-Z0-9_-]+$/.test(String(val)))
        return "Username can only contain letters, numbers, underscores and hyphens";
      return null;
    },
    password: (val) => {
      if (!val || String(val).length === 0) return "Password is required";
      if (String(val).length < 8)
        return "Password must be at least 8 characters";
      return null;
    },
    confirmPassword: (_val) => {
      // Cross-field check handled at the component level via validatePasswords()
      return null;
    },
  };

  /** Cross-field validation for password confirmation */
  validatePasswords(password: string, confirmPassword: string): string | null {
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  }
}

export const loginValidator = new LoginValidator();
export const registerValidator = new RegisterValidator();
