import { User } from "@/models";
import type { IAuthService } from "@/services/interfaces/IAuthService";
import type { IUser, LoginPayload, RegisterPayload } from "@/types";

const DEMO_USER: IUser = {
  id: "user-demo-1",
  email: "demo@carbuildtracker.com",
  username: "BuilderZero",
  avatarUrl: undefined,
  createdAt: "2024-01-15T10:00:00.000Z",
};

/** Simulates network latency for realistic UX testing */
const delay = (ms = 50) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export class MockAuthService implements IAuthService {
  private currentUser: IUser | null = null;

  async login(_payload: LoginPayload): Promise<User> {
    await delay();
    // In mock mode any credentials are accepted — just sign in as demo user
    this.currentUser = { ...DEMO_USER };
    return User.from(this.currentUser);
  }

  async register(payload: RegisterPayload): Promise<User> {
    await delay();
    this.currentUser = {
      ...DEMO_USER,
      email: payload.email,
      username: payload.username,
      id: `user-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    return User.from(this.currentUser);
  }

  async logout(): Promise<void> {
    await delay(20);
    this.currentUser = null;
  }

  async getMe(): Promise<User> {
    await delay(30);
    if (!this.currentUser) {
      // Auto-seed a session so the app loads with data in dev
      this.currentUser = { ...DEMO_USER };
    }
    return User.from(this.currentUser);
  }

  async refreshToken(): Promise<void> {
    await delay(20);
    // No-op in mock mode — session never expires
  }
}
