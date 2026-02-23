import { BaseApiService } from "./BaseApiService";
import { Car } from "@/models";
import type { ICarsService } from "@/services/interfaces/ICarsService";
import type { ICar } from "@/types";

export class CarsService extends BaseApiService implements ICarsService {
  async fetchAll(): Promise<Car[]> {
    const data = await this.get<ICar[]>("/cars");
    return data.map(Car.from);
  }

  async fetchOne(id: string): Promise<Car> {
    const data = await this.get<ICar>(`/cars/${id}`);
    return Car.from(data);
  }

  async create(payload: Partial<ICar>): Promise<Car> {
    const data = await this.post<ICar>("/cars", payload);
    return Car.from(data);
  }

  async update(id: string, payload: Partial<ICar>): Promise<Car> {
    const data = await this.put<ICar>(`/cars/${id}`, payload);
    return Car.from(data);
  }

  async remove(id: string): Promise<void> {
    await this.delete(`/cars/${id}`);
  }

  async fetchPublicBuild(id: string): Promise<Car> {
    const data = await this.get<ICar>(`/public/builds/${id}`);
    return Car.from(data);
  }
}

export const carsService = new CarsService();
