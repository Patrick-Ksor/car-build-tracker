import type { Mod } from "@/models";
import type { IMod } from "@/types";

export interface IModsService {
  fetchByCarId(carId: string): Promise<Mod[]>;
  create(carId: string, data: Partial<IMod>): Promise<Mod>;
  update(id: string, data: Partial<IMod>): Promise<Mod>;
  remove(id: string): Promise<void>;
}
