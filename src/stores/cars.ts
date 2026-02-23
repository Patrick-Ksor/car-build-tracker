import { defineStore } from "pinia";
import { ref, computed, shallowRef, markRaw } from "vue";
import { services } from "@/services/factory/serviceFactory";
import type { Car } from "@/models";
import type { ICar } from "@/types";

export const useCarsStore = defineStore("cars", () => {
  // ---- State ----
  const cars = shallowRef<Car[]>([]);
  const currentCar = shallowRef<Car | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ---- Getters ----
  const totalSpend = computed(() =>
    cars.value.reduce((sum, c) => sum + c.totalCost, 0),
  );

  const totalMods = computed(
    () =>
      // Approximated from cars; precise count comes from mods store
      cars.value.length,
  );

  const highestHp = computed(() =>
    cars.value.reduce((max, c) => Math.max(max, c.currentHp), 0),
  );

  const formattedTotalSpend = computed(() =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalSpend.value),
  );

  // ---- Actions ----
  async function fetchCars(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.cars.fetchAll();
      // markRaw each Car instance — preserve prototype, skip deep proxy
      cars.value = result.map(markRaw);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load cars";
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCar(id: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.cars.fetchOne(id);
      currentCar.value = markRaw(result);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load car";
    } finally {
      isLoading.value = false;
    }
  }

  async function createCar(data: Partial<ICar>): Promise<Car> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.cars.create(data);
      const marked = markRaw(result);
      cars.value = [...cars.value, marked];
      return marked;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to create car";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCar(id: string, data: Partial<ICar>): Promise<Car> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.cars.update(id, data);
      const marked = markRaw(result);
      cars.value = cars.value.map((c) => (c.id === id ? marked : c));
      if (currentCar.value?.id === id) currentCar.value = marked;
      return marked;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to update car";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCar(id: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      await services.cars.remove(id);
      cars.value = cars.value.filter((c) => c.id !== id);
      if (currentCar.value?.id === id) currentCar.value = null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to delete car";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPublicBuild(id: string): Promise<Car> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.cars.fetchPublicBuild(id);
      currentCar.value = markRaw(result);
      return result;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Build not found";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  /** Recalculate a car's totals in local state after mods change */
  function updateCarTotals(
    carId: string,
    totalCost: number,
    currentHp: number,
  ): void {
    cars.value = cars.value.map((c) => {
      if (c.id !== carId) return c;
      const updated = markRaw(
        Object.assign(Object.create(Object.getPrototypeOf(c) as object), c, {
          totalCost,
          currentHp,
        }),
      );
      return updated as Car;
    });
  }

  function clearError(): void {
    error.value = null;
  }

  return {
    cars,
    currentCar,
    isLoading,
    error,
    totalSpend,
    totalMods,
    highestHp,
    formattedTotalSpend,
    fetchCars,
    fetchCar,
    createCar,
    updateCar,
    deleteCar,
    fetchPublicBuild,
    updateCarTotals,
    clearError,
  };
});
