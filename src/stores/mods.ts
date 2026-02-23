import { defineStore } from "pinia";
import { ref, computed, markRaw } from "vue";
import { services } from "@/services/factory/serviceFactory";
import { ModCategory } from "@/types";
import type { Mod } from "@/models";
import type {
  IMod,
  ChartDataPoint,
  MonthlySpend,
  CategorySpend,
} from "@/types";

export const useModsStore = defineStore("mods", () => {
  // ---- State ----
  // keyed by carId — avoids refetching mods for every car on every navigation
  const modsByCarId = ref<Map<string, Mod[]>>(new Map());
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ---- Helpers ----
  function getModsForCar(carId: string): Mod[] {
    return modsByCarId.value.get(carId) ?? [];
  }

  // ---- Getters (computed factories) ----

  const totalModCount = computed(() => {
    let count = 0;
    for (const mods of modsByCarId.value.values()) {
      count += mods.length;
    }
    return count;
  });

  function hpProgression(carId: string, baseHp: number): ChartDataPoint[] {
    const mods = getModsForCar(carId)
      .filter((m) => m.hpGain > 0)
      .sort(
        (a, b) =>
          new Date(a.installDate).getTime() - new Date(b.installDate).getTime(),
      );

    let hp = baseHp;
    const points: ChartDataPoint[] = [{ label: "Stock", value: hp }];

    for (const mod of mods) {
      hp += mod.hpGain;
      points.push({ label: mod.name, value: hp });
    }

    return points;
  }

  function spendingByCategory(carId: string): CategorySpend[] {
    const mods = getModsForCar(carId);
    const totals = new Map<ModCategory, number>();

    for (const mod of mods) {
      totals.set(mod.category, (totals.get(mod.category) ?? 0) + mod.cost);
    }

    return Array.from(totals.entries())
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  function spendingByMonth(carId: string): MonthlySpend[] {
    const mods = getModsForCar(carId);
    const totals = new Map<string, number>();

    for (const mod of mods) {
      const d = new Date(mod.installDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      totals.set(key, (totals.get(key) ?? 0) + mod.cost);
    }

    return Array.from(totals.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => {
        const [year, monthNum] = month.split("-");
        const d = new Date(Number(year), Number(monthNum) - 1);
        return {
          month,
          label: d.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          amount,
        };
      });
  }

  function totalCostForCar(carId: string): number {
    return getModsForCar(carId).reduce((sum, m) => sum + m.cost, 0);
  }

  function totalHpGainForCar(carId: string): number {
    return getModsForCar(carId).reduce((sum, m) => sum + m.hpGain, 0);
  }

  // ---- Actions ----
  async function fetchMods(carId: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.mods.fetchByCarId(carId);
      const map = new Map(modsByCarId.value);
      map.set(carId, result.map(markRaw));
      modsByCarId.value = map;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Failed to load modifications";
    } finally {
      isLoading.value = false;
    }
  }

  async function createMod(carId: string, data: Partial<IMod>): Promise<Mod> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.mods.create(carId, data);
      const marked = markRaw(result);
      const map = new Map(modsByCarId.value);
      const existing = map.get(carId) ?? [];
      map.set(carId, [...existing, marked]);
      modsByCarId.value = map;
      return marked;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Failed to create modification";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateMod(
    id: string,
    carId: string,
    data: Partial<IMod>,
  ): Promise<Mod> {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await services.mods.update(id, data);
      const marked = markRaw(result);
      const map = new Map(modsByCarId.value);
      const existing = map.get(carId) ?? [];
      map.set(
        carId,
        existing.map((m) => (m.id === id ? marked : m)),
      );
      modsByCarId.value = map;
      return marked;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Failed to update modification";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteMod(id: string, carId: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      await services.mods.remove(id);
      const map = new Map(modsByCarId.value);
      const existing = map.get(carId) ?? [];
      map.set(
        carId,
        existing.filter((m) => m.id !== id),
      );
      modsByCarId.value = map;
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Failed to delete modification";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function clearError(): void {
    error.value = null;
  }

  return {
    modsByCarId,
    isLoading,
    error,
    totalModCount,
    getModsForCar,
    hpProgression,
    spendingByCategory,
    spendingByMonth,
    totalCostForCar,
    totalHpGainForCar,
    fetchMods,
    createMod,
    updateMod,
    deleteMod,
    clearError,
  };
});
