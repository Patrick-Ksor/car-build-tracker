import { BaseApiService } from "./BaseApiService";
import { Mod } from "@/models";
import type { IModsService } from "@/services/interfaces/IModsService";
import type { IMod } from "@/types";

export class ModsService extends BaseApiService implements IModsService {
  async fetchByCarId(carId: string): Promise<Mod[]> {
    const data = await this.get<IMod[]>(`/cars/${carId}/mods`);
    return data.map(Mod.from);
  }

  async create(carId: string, payload: Partial<IMod>): Promise<Mod> {
    const data = await this.post<IMod>(`/cars/${carId}/mods`, payload);
    return Mod.from(data);
  }

  async update(id: string, payload: Partial<IMod>): Promise<Mod> {
    const data = await this.put<IMod>(`/mods/${id}`, payload);
    return Mod.from(data);
  }

  async remove(id: string): Promise<void> {
    await this.delete(`/mods/${id}`);
  }
}

export const modsService = new ModsService();
