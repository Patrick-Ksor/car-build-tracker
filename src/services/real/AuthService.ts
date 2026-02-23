import { BaseApiService } from "./BaseApiService";
import { User } from "@/models";
import type { IAuthService } from "@/services/interfaces/IAuthService";
import type { IUser, LoginPayload, RegisterPayload } from "@/types";

export class AuthService extends BaseApiService implements IAuthService {
  async login(payload: LoginPayload): Promise<User> {
    const data = await this.post<IUser>("/auth/login", payload);
    return User.from(data);
  }

  async register(payload: RegisterPayload): Promise<User> {
    const data = await this.post<IUser>("/auth/register", payload);
    return User.from(data);
  }

  async logout(): Promise<void> {
    await this.post<void>("/auth/logout");
  }

  async getMe(): Promise<User> {
    const data = await this.get<IUser>("/auth/me");
    return User.from(data);
  }

  async refreshToken(): Promise<void> {
    await this.post<void>("/auth/refresh");
  }
}

export const authService = new AuthService();
