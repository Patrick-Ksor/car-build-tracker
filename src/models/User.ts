import type { IUser } from "@/types";

export class User implements IUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;

  constructor(data: Partial<IUser> = {}) {
    this.id = data.id ?? "";
    this.email = data.email ?? "";
    this.username = data.username ?? "";
    this.avatarUrl = data.avatarUrl;
    this.createdAt = data.createdAt ?? new Date().toISOString();
  }

  // ---- Computed getters (business logic) ----

  get displayName(): string {
    if (this.username) return this.username;
    return this.email.split("@")[0] ?? this.email;
  }

  get initials(): string {
    const name = this.displayName;
    const parts = name.split(/[\s._-]/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return (parts[0]?.slice(0, 2) ?? "?").toUpperCase();
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }

  get memberSince(): string {
    return new Date(this.createdAt).getFullYear().toString();
  }

  // ---- Static factories ----

  static from(data: IUser): User {
    return new User(data);
  }

  static empty(): User {
    return new User();
  }
}
