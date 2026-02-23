// ============================================================
// Raw API contract interfaces — no business logic here.
// Classes with behaviour live in src/models/
// ============================================================

export enum ModCategory {
  Engine = "engine",
  Suspension = "suspension",
  Exhaust = "exhaust",
  Intake = "intake",
  Tuning = "tuning",
  Exterior = "exterior",
  Interior = "interior",
  Other = "other",
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ICar {
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
}

export interface IMod {
  id: string;
  carId: string;
  name: string;
  category: ModCategory;
  cost: number;
  hpGain: number;
  installDate: string;
  notes?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// Chart data shapes used by Pinia getters → Chart.js
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface MonthlySpend {
  month: string; // e.g. "2025-06"
  label: string; // e.g. "Jun 2025"
  amount: number;
}

export interface CategorySpend {
  category: ModCategory;
  label: string;
  amount: number;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
}

export type ModalName =
  | "create-car"
  | "edit-car"
  | "delete-car"
  | "create-mod"
  | "edit-mod"
  | "delete-mod"
  | null;
