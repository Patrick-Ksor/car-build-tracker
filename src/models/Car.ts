import type { ICar } from "@/types";

export class Car implements ICar {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  nickname?: string;
  imageUrl?: string;
  baseHp: number;
  currentHp: number;
  totalCost: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<ICar> = {}) {
    this.id = data.id ?? "";
    this.userId = data.userId ?? "";
    this.make = data.make ?? "";
    this.model = data.model ?? "";
    this.year = data.year ?? new Date().getFullYear();
    this.nickname = data.nickname;
    this.imageUrl = data.imageUrl;
    this.baseHp = data.baseHp ?? 0;
    this.currentHp = data.currentHp ?? data.baseHp ?? 0;
    this.totalCost = data.totalCost ?? 0;
    this.isPublic = data.isPublic ?? false;
    this.createdAt = data.createdAt ?? new Date().toISOString();
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
  }

  // ---- Computed getters (business logic) ----

  get displayName(): string {
    return this.nickname
      ? `${this.nickname} (${this.year} ${this.make} ${this.model})`
      : `${this.year} ${this.make} ${this.model}`;
  }

  get shortName(): string {
    return `${this.year} ${this.make} ${this.model}`;
  }

  get gainedHp(): number {
    return this.currentHp - this.baseHp;
  }

  get hpGainPercent(): number {
    if (this.baseHp === 0) return 0;
    return Math.round((this.gainedHp / this.baseHp) * 100);
  }

  get formattedCost(): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.totalCost);
  }

  get gradientClass(): string {
    const gradients = [
      "from-blue-700 to-blue-900",
      "from-indigo-600 to-violet-700",
      "from-emerald-600 to-teal-700",
      "from-purple-600 to-violet-700",
      "from-rose-600 to-pink-700",
      "from-amber-600 to-yellow-700",
    ];
    // deterministic based on id chars
    const idx = this.id.charCodeAt(0) % gradients.length;
    return gradients[idx] ?? "from-blue-700 to-blue-900";
  }

  // ---- Static factories ----

  static from(data: ICar): Car {
    return new Car(data);
  }

  static empty(): Car {
    return new Car();
  }
}
