import { Car } from "@/models";
import type { ICarsService } from "@/services/interfaces/ICarsService";
import type { ICar } from "@/types";

const delay = (ms = 50) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const SEED_CARS: ICar[] = [
  {
    id: "car-seed-1",
    userId: "user-demo-1",
    make: "Subaru",
    model: "WRX STI",
    year: 2019,
    nickname: "Project Rex",
    imageUrl: undefined,
    baseHp: 310,
    currentHp: 410,
    totalCost: 14850,
    isPublic: true,
    createdAt: "2024-02-01T08:00:00.000Z",
    updatedAt: "2024-11-20T14:00:00.000Z",
  },
  {
    id: "car-seed-2",
    userId: "user-demo-1",
    make: "Honda",
    model: "Civic Type R",
    year: 2021,
    nickname: "FK8 Daily",
    imageUrl: undefined,
    baseHp: 306,
    currentHp: 340,
    totalCost: 5200,
    isPublic: false,
    createdAt: "2024-06-15T09:30:00.000Z",
    updatedAt: "2024-12-01T11:00:00.000Z",
  },
  {
    id: "car-seed-3",
    userId: "user-demo-1",
    make: "Nissan",
    model: "370Z",
    year: 2017,
    nickname: "Weekend Warrior",
    imageUrl: undefined,
    baseHp: 332,
    currentHp: 372,
    totalCost: 3100,
    isPublic: true,
    createdAt: "2024-09-10T12:00:00.000Z",
    updatedAt: "2024-12-15T16:00:00.000Z",
  },
];

export class MockCarsService implements ICarsService {
  private store = new Map<string, ICar>(SEED_CARS.map((c) => [c.id, { ...c }]));

  async fetchAll(): Promise<Car[]> {
    await delay();
    return Array.from(this.store.values()).map(Car.from);
  }

  async fetchOne(id: string): Promise<Car> {
    await delay();
    const car = this.store.get(id);
    if (!car) throw new Error(`Car not found: ${id}`);
    return Car.from(car);
  }

  async create(data: Partial<ICar>): Promise<Car> {
    await delay();
    const newCar: ICar = {
      id: `car-${crypto.randomUUID()}`,
      userId: "user-demo-1",
      make: data.make ?? "",
      model: data.model ?? "",
      year: data.year ?? new Date().getFullYear(),
      nickname: data.nickname,
      imageUrl: data.imageUrl,
      baseHp: data.baseHp ?? 0,
      currentHp: data.baseHp ?? 0,
      totalCost: 0,
      isPublic: data.isPublic ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.set(newCar.id, newCar);
    return Car.from(newCar);
  }

  async update(id: string, data: Partial<ICar>): Promise<Car> {
    await delay();
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Car not found: ${id}`);
    const updated: ICar = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, updated);
    return Car.from(updated);
  }

  async remove(id: string): Promise<void> {
    await delay();
    if (!this.store.has(id)) throw new Error(`Car not found: ${id}`);
    this.store.delete(id);
  }

  async fetchPublicBuild(id: string): Promise<Car> {
    await delay();
    const car = this.store.get(id);
    if (!car || !car.isPublic) throw new Error(`Public build not found: ${id}`);
    return Car.from(car);
  }
}
