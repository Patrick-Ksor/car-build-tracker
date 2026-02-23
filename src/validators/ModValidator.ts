import { BaseValidator } from "./BaseValidator";
import { ModCategory } from "@/types";
import type { IMod } from "@/types";

export class ModValidator extends BaseValidator<IMod> {
  protected rules: Partial<
    Record<keyof IMod, (val: unknown) => string | null>
  > = {
    name: (val) => {
      if (!val || String(val).trim().length === 0)
        return "Modification name is required";
      if (String(val).trim().length > 100)
        return "Name must be 100 characters or fewer";
      return null;
    },
    category: (val) => {
      const validCategories = Object.values(ModCategory) as string[];
      if (!val || !validCategories.includes(String(val)))
        return "Please select a valid category";
      return null;
    },
    cost: (val) => {
      const cost = Number(val);
      if (val === undefined || val === null || val === "")
        return "Cost is required";
      if (isNaN(cost)) return "Cost must be a number";
      if (cost < 0) return "Cost cannot be negative";
      if (cost > 1_000_000) return "Cost seems unrealistic (max $1,000,000)";
      return null;
    },
    hpGain: (val) => {
      const hp = Number(val);
      if (val === undefined || val === null || val === "")
        return "HP gain is required (use 0 if none)";
      if (isNaN(hp)) return "HP gain must be a number";
      if (hp < -500 || hp > 2000)
        return "HP gain must be between -500 and 2000";
      return null;
    },
    installDate: (val) => {
      if (!val || String(val).trim().length === 0)
        return "Install date is required";
      const date = new Date(String(val));
      if (isNaN(date.getTime())) return "Install date must be a valid date";
      if (date > new Date()) return "Install date cannot be in the future";
      return null;
    },
    notes: (val) => {
      if (val && String(val).length > 500)
        return "Notes must be 500 characters or fewer";
      return null;
    },
  };
}

export const modValidator = new ModValidator();

export type ModFormData = Pick<
  IMod,
  "name" | "category" | "cost" | "hpGain" | "installDate" | "notes"
>;
