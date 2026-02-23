import { ModCategory } from "@/types";
import type { IMod } from "@/types";

export class Mod implements IMod {
  id: string;
  carId: string;
  name: string;
  category: ModCategory;
  cost: number;
  hpGain: number;
  installDate: string;
  notes?: string;
  createdAt: string;

  constructor(data: Partial<IMod> = {}) {
    this.id = data.id ?? "";
    this.carId = data.carId ?? "";
    this.name = data.name ?? "";
    this.category = data.category ?? ModCategory.Other;
    this.cost = data.cost ?? 0;
    this.hpGain = data.hpGain ?? 0;
    this.installDate =
      data.installDate ?? new Date().toISOString().split("T")[0]!;
    this.notes = data.notes;
    this.createdAt = data.createdAt ?? new Date().toISOString();
  }

  // ---- Computed getters (business logic) ----

  get categoryLabel(): string {
    const labels: Record<ModCategory, string> = {
      [ModCategory.Engine]: "Engine",
      [ModCategory.Suspension]: "Suspension",
      [ModCategory.Exhaust]: "Exhaust",
      [ModCategory.Intake]: "Intake",
      [ModCategory.Tuning]: "Tuning",
      [ModCategory.Exterior]: "Exterior",
      [ModCategory.Interior]: "Interior",
      [ModCategory.Other]: "Other",
    };
    return labels[this.category];
  }

  get categoryColor(): string {
    const colors: Record<ModCategory, string> = {
      [ModCategory.Engine]: "text-red-400 bg-red-400/10 ring-red-400/20",
      [ModCategory.Suspension]: "text-blue-400 bg-blue-400/10 ring-blue-400/20",
      [ModCategory.Exhaust]:
        "text-orange-400 bg-orange-400/10 ring-orange-400/20",
      [ModCategory.Intake]: "text-cyan-400 bg-cyan-400/10 ring-cyan-400/20",
      [ModCategory.Tuning]: "text-brand-blue bg-blue-500/10 ring-blue-500/20",
      [ModCategory.Exterior]:
        "text-purple-400 bg-purple-400/10 ring-purple-400/20",
      [ModCategory.Interior]:
        "text-emerald-400 bg-emerald-400/10 ring-emerald-400/20",
      [ModCategory.Other]: "text-zinc-400 bg-zinc-400/10 ring-zinc-400/20",
    };
    return colors[this.category];
  }

  get formattedCost(): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.cost);
  }

  get formattedDate(): string {
    return new Date(this.installDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /** Composite score: higher hp gain + higher cost = higher impact */
  get impact(): number {
    return this.hpGain * 10 + this.cost / 100;
  }

  // ---- Static factories ----

  static from(data: IMod): Mod {
    return new Mod(data);
  }

  static empty(carId = ""): Mod {
    return new Mod({ carId });
  }
}
