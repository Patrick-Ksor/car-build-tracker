import { Mod } from "@/models";
import { ModCategory } from "@/types";
import type { IModsService } from "@/services/interfaces/IModsService";
import type { IMod } from "@/types";

const delay = (ms = 50) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const SEED_MODS: IMod[] = [
  // car-seed-1 (WRX STI)
  {
    id: "mod-seed-1",
    carId: "car-seed-1",
    name: "Cobb Accessport V3",
    category: ModCategory.Tuning,
    cost: 699,
    hpGain: 15,
    installDate: "2024-02-15",
    notes: "Stage 1 off-the-shelf map",
    createdAt: "2024-02-15T10:00:00.000Z",
  },
  {
    id: "mod-seed-2",
    carId: "car-seed-1",
    name: "Invidia N1 Cat-Back Exhaust",
    category: ModCategory.Exhaust,
    cost: 1200,
    hpGain: 8,
    installDate: "2024-03-10",
    notes: "Great tone, deep rumble",
    createdAt: "2024-03-10T12:00:00.000Z",
  },
  {
    id: "mod-seed-3",
    carId: "car-seed-1",
    name: "IAG Air Oil Separator",
    category: ModCategory.Engine,
    cost: 450,
    hpGain: 0,
    installDate: "2024-04-05",
    notes: "Preventive maintenance mod",
    createdAt: "2024-04-05T09:00:00.000Z",
  },
  {
    id: "mod-seed-4",
    carId: "car-seed-1",
    name: "Killer B Stage 2 Tune",
    category: ModCategory.Tuning,
    cost: 2500,
    hpGain: 55,
    installDate: "2024-07-20",
    notes: "Full custom tune on 93 octane",
    createdAt: "2024-07-20T14:00:00.000Z",
  },
  {
    id: "mod-seed-5",
    carId: "car-seed-1",
    name: "Perrin Short Shifter",
    category: ModCategory.Interior,
    cost: 350,
    hpGain: 0,
    installDate: "2024-08-12",
    notes: "15% shorter throw",
    createdAt: "2024-08-12T11:00:00.000Z",
  },
  {
    id: "mod-seed-6",
    carId: "car-seed-1",
    name: "Kartboy Pitch Stop Mount",
    category: ModCategory.Suspension,
    cost: 110,
    hpGain: 0,
    installDate: "2024-09-01",
    notes: "Reduces drivetrain clunk",
    createdAt: "2024-09-01T10:00:00.000Z",
  },
  {
    id: "mod-seed-7",
    carId: "car-seed-1",
    name: "Turbosmart BOV Plumb Back",
    category: ModCategory.Engine,
    cost: 220,
    hpGain: 0,
    installDate: "2024-10-03",
    notes: "Keeps boost recycled for smoother response",
    createdAt: "2024-10-03T13:00:00.000Z",
  },
  {
    id: "mod-seed-8",
    carId: "car-seed-1",
    name: "EJ257 Upgraded Injectors",
    category: ModCategory.Engine,
    cost: 800,
    hpGain: 22,
    installDate: "2024-11-15",
    notes: "1000cc injectors for E30 blend support",
    createdAt: "2024-11-15T10:00:00.000Z",
  },
  // car-seed-2 (Civic Type R)
  {
    id: "mod-seed-9",
    carId: "car-seed-2",
    name: "K&N Cold Air Intake",
    category: ModCategory.Intake,
    cost: 380,
    hpGain: 8,
    installDate: "2024-07-01",
    notes: "Noticeable mid-range gain",
    createdAt: "2024-07-01T09:00:00.000Z",
  },
  {
    id: "mod-seed-10",
    carId: "car-seed-2",
    name: "Hondata FlashPro",
    category: ModCategory.Tuning,
    cost: 695,
    hpGain: 22,
    installDate: "2024-08-20",
    notes: "Custom dyno tune by HPT",
    createdAt: "2024-08-20T11:00:00.000Z",
  },
  {
    id: "mod-seed-11",
    carId: "car-seed-2",
    name: "Mugen Carbon Lip",
    category: ModCategory.Exterior,
    cost: 1200,
    hpGain: 0,
    installDate: "2024-11-10",
    notes: "OEM+ look, genuine Mugen",
    createdAt: "2024-11-10T14:00:00.000Z",
  },
  // car-seed-3 (370Z)
  {
    id: "mod-seed-12",
    carId: "car-seed-3",
    name: "Z1 Motorsports Intake",
    category: ModCategory.Intake,
    cost: 480,
    hpGain: 15,
    installDate: "2024-09-20",
    notes: "Dual cone design",
    createdAt: "2024-09-20T10:00:00.000Z",
  },
  {
    id: "mod-seed-13",
    carId: "car-seed-3",
    name: "Stillen Axle-Back Exhaust",
    category: ModCategory.Exhaust,
    cost: 850,
    hpGain: 12,
    installDate: "2024-10-15",
    notes: "Sport mode sounds incredible",
    createdAt: "2024-10-15T13:00:00.000Z",
  },
  {
    id: "mod-seed-14",
    carId: "car-seed-3",
    name: "Tein Street Advance Z Coilovers",
    category: ModCategory.Suspension,
    cost: 1500,
    hpGain: 0,
    installDate: "2024-12-01",
    notes: "Dropped 35mm, rides well",
    createdAt: "2024-12-01T12:00:00.000Z",
  },
];

export class MockModsService implements IModsService {
  /** keyed by carId → array of mods */
  private store = new Map<string, IMod[]>();

  constructor() {
    // Seed the store, grouped by carId
    for (const mod of SEED_MODS) {
      const list = this.store.get(mod.carId) ?? [];
      list.push({ ...mod });
      this.store.set(mod.carId, list);
    }
  }

  async fetchByCarId(carId: string): Promise<Mod[]> {
    await delay();
    const mods = this.store.get(carId) ?? [];
    return mods.map(Mod.from);
  }

  async create(carId: string, data: Partial<IMod>): Promise<Mod> {
    await delay();
    const newMod: IMod = {
      id: `mod-${crypto.randomUUID()}`,
      carId,
      name: data.name ?? "",
      category: data.category ?? ModCategory.Other,
      cost: data.cost ?? 0,
      hpGain: data.hpGain ?? 0,
      installDate: data.installDate ?? new Date().toISOString().split("T")[0]!,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    const list = this.store.get(carId) ?? [];
    list.push(newMod);
    this.store.set(carId, list);
    return Mod.from(newMod);
  }

  async update(id: string, data: Partial<IMod>): Promise<Mod> {
    await delay();
    for (const [carId, mods] of this.store.entries()) {
      const idx = mods.findIndex((m) => m.id === id);
      if (idx !== -1) {
        const existing = mods[idx]!;
        const updated: IMod = { ...existing, ...data, id };
        mods[idx] = updated;
        this.store.set(carId, mods);
        return Mod.from(updated);
      }
    }
    throw new Error(`Mod not found: ${id}`);
  }

  async remove(id: string): Promise<void> {
    await delay();
    for (const [carId, mods] of this.store.entries()) {
      const idx = mods.findIndex((m) => m.id === id);
      if (idx !== -1) {
        mods.splice(idx, 1);
        this.store.set(carId, mods);
        return;
      }
    }
    throw new Error(`Mod not found: ${id}`);
  }
}
