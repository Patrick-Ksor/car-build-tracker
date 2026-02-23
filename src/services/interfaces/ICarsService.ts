import type { Car } from "@/models";
import type { ICar } from "@/types";

export interface ICarsService {
  fetchAll(): Promise<Car[]>;
  fetchOne(id: string): Promise<Car>;
  create(data: Partial<ICar>): Promise<Car>;
  update(id: string, data: Partial<ICar>): Promise<Car>;
  remove(id: string): Promise<void>;
  fetchPublicBuild(id: string): Promise<Car>;
}
