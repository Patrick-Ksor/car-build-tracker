import { BaseValidator } from "./BaseValidator";
import { ModCategory } from "@/types";
import type { ICar } from "@/types";

const CURRENT_YEAR = new Date().getFullYear();

export class CarValidator extends BaseValidator<ICar> {
  protected rules: Partial<
    Record<keyof ICar, (val: unknown) => string | null>
  > = {
    make: (val) => {
      if (!val || String(val).trim().length === 0) return "Make is required";
      if (String(val).trim().length > 50)
        return "Make must be 50 characters or fewer";
      return null;
    },
    model: (val) => {
      if (!val || String(val).trim().length === 0) return "Model is required";
      if (String(val).trim().length > 50)
        return "Model must be 50 characters or fewer";
      return null;
    },
    year: (val) => {
      const year = Number(val);
      if (!val && val !== 0) return "Year is required";
      if (isNaN(year)) return "Year must be a number";
      if (year < 1900 || year > CURRENT_YEAR + 1)
        return `Year must be between 1900 and ${CURRENT_YEAR + 1}`;
      return null;
    },
    baseHp: (val) => {
      const hp = Number(val);
      if (val === undefined || val === null || val === "")
        return "Base HP is required";
      if (isNaN(hp)) return "Base HP must be a number";
      if (hp < 0) return "Base HP cannot be negative";
      if (hp > 5000) return "Base HP seems unrealistic (max 5000)";
      return null;
    },
    nickname: (val) => {
      if (val && String(val).trim().length > 60)
        return "Nickname must be 60 characters or fewer";
      return null;
    },
    imageUrl: (val) => {
      if (!val) return null;
      try {
        new URL(String(val));
        return null;
      } catch {
        return "Image URL must be a valid URL";
      }
    },
  };
}

export const carValidator = new CarValidator();

export type CarFormData = Pick<
  ICar,
  "make" | "model" | "year" | "nickname" | "imageUrl" | "baseHp" | "isPublic"
>;

export const MOD_CATEGORIES = Object.values(ModCategory).map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));
