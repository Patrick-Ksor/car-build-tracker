import type { User } from "@/models";
import type { LoginPayload, RegisterPayload } from "@/types";

export interface IAuthService {
  login(payload: LoginPayload): Promise<User>;
  register(payload: RegisterPayload): Promise<User>;
  logout(): Promise<void>;
  getMe(): Promise<User>;
  refreshToken(): Promise<void>;
}
