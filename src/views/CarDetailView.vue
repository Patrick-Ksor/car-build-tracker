<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCarsStore } from "@/stores/cars";
import { useModsStore } from "@/stores/mods";
import { useUiStore } from "@/stores/ui";
import AppShell from "@/components/layout/AppShell.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ModList from "@/components/mods/ModList.vue";
import ModForm from "@/components/mods/ModForm.vue";
import type { Mod } from "@/models";
import type { IMod } from "@/types";

const route = useRoute();
const router = useRouter();
const carsStore = useCarsStore();
const modsStore = useModsStore();
const uiStore = useUiStore();

const carId = route.params.id as string;
const isLoading = ref(true);
const isModsLoading = ref(true);
const activeTab = ref<"mods" | "analytics">("mods");
const showModModal = ref(false);
const editingMod = ref<Mod | null>(null);
const formLoading = ref(false);

const car = computed(() => carsStore.currentCar);
const mods = computed(() => modsStore.modsByCarId.get(carId) ?? []);

onMounted(async () => {
  try {
    await carsStore.fetchCar(carId);
  } catch {
    router.push({ name: "cars" });
    return;
  } finally {
    isLoading.value = false;
  }
  try {
    await modsStore.fetchMods(carId);
  } finally {
    isModsLoading.value = false;
  }
});

function openCreate() {
  editingMod.value = null;
  showModModal.value = true;
}
function openEdit(mod: Mod) {
  editingMod.value = mod;
  showModModal.value = true;
}
function closeModal() {
  showModModal.value = false;
  editingMod.value = null;
}

async function handleModSubmit(data: Partial<IMod>) {
  if (!car.value) return;
  formLoading.value = true;
  try {
    if (editingMod.value) {
      await modsStore.updateMod(carId, editingMod.value.id, data);
      uiStore.success("Modification updated.");
    } else {
      await modsStore.createMod(carId, data);
      uiStore.success("Modification added.");
    }
    const updatedMods = modsStore.modsByCarId.get(carId) ?? [];
    const totalCost = updatedMods.reduce((s, m) => s + m.cost, 0);
    const currentHp = updatedMods.reduce(
      (s, m) => s + m.hpGain,
      car.value!.baseHp
    );
    await carsStore.updateCarTotals(carId, totalCost, currentHp);
    closeModal();
  } catch (e: unknown) {
    uiStore.errorToast(
      e instanceof Error ? e.message : "Failed to save modification."
    );
  } finally {
    formLoading.value = false;
  }
}

async function handleModDelete(mod: Mod) {
  if (!car.value) return;
  if (!confirm(`Delete "${mod.name}"? This cannot be undone.`)) return;
  try {
    await modsStore.deleteMod(carId, mod.id);
    const updatedMods = modsStore.modsByCarId.get(carId) ?? [];
    const totalCost = updatedMods.reduce((s, m) => s + m.cost, 0);
    const currentHp = updatedMods.reduce(
      (s, m) => s + m.hpGain,
      car.value!.baseHp
    );
    await carsStore.updateCarTotals(carId, totalCost, currentHp);
    uiStore.success("Modification deleted.");
  } catch (e: unknown) {
    uiStore.errorToast(
      e instanceof Error ? e.message : "Failed to delete modification."
    );
  }
}
</script>

<template>
  <AppShell>
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <LoadingSpinner size="lg" />
    </div>

    <!-- 404 -->
    <div
      v-else-if="!car"
      class="flex flex-col items-center justify-center h-64 gap-4"
    >
      <p class="text-dark-400">Car not found.</p>
      <BaseButton variant="secondary" @click="router.push({ name: 'cars' })"
        >Back to garage</BaseButton
      >
    </div>

    <template v-else>
      <!-- Hero -->
      <div
        :class="[
          'relative rounded-2xl overflow-hidden mb-8',
          car.gradientClass,
        ]"
      >
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent to-dark-950/80"
        />
        <div
          class="relative px-6 py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <p class="text-sm text-white/60 uppercase tracking-widest mb-1">
              {{ car.year }}
            </p>
            <h1 class="text-3xl font-bold text-white">{{ car.displayName }}</h1>
            <p v-if="car.nickname" class="text-white/70 mt-0.5">
              &ldquo;{{ car.nickname }}&rdquo;
            </p>
          </div>
          <div class="flex gap-6 text-center">
            <div>
              <p class="text-2xl font-bold text-white">{{ car.currentHp }}</p>
              <p class="text-xs text-white/60">Current HP</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-brand-blue">
                +{{ car.gainedHp }}
              </p>
              <p class="text-xs text-white/60">HP Gained</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">
                {{ car.formattedCost }}
              </p>
              <p class="text-xs text-white/60">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs + actions -->
      <div class="flex items-center justify-between mb-6">
        <nav class="flex gap-1 bg-dark-900 rounded-xl p-1">
          <button
            v-for="tab in ['mods', 'analytics'] as const"
            :key="tab"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab
                ? 'bg-dark-700 text-white'
                : 'text-dark-400 hover:text-white',
            ]"
            @click="activeTab = tab"
          >
            {{ tab === "mods" ? "Modifications" : "Analytics" }}
          </button>
        </nav>

        <div class="flex gap-3">
          <RouterLink
            v-if="car.isPublic"
            :to="{ name: 'public-build', params: { id: carId } }"
            class="btn btn-secondary text-sm px-4 py-2"
          >
            View public page
          </RouterLink>
          <BaseButton
            v-if="activeTab === 'mods'"
            variant="primary"
            size="sm"
            @click="openCreate"
          >
            + Add mod
          </BaseButton>
        </div>
      </div>

      <!-- Tab content -->
      <div class="card">
        <!-- Mods tab -->
        <ModList
          v-if="activeTab === 'mods'"
          :mods="mods"
          :is-loading="isModsLoading"
          @edit="openEdit"
          @delete="handleModDelete"
        />

        <!-- Analytics tab -->
        <div v-else class="py-8">
          <RouterLink
            :to="{ name: 'analytics', params: { id: carId } }"
            class="btn btn-primary mx-auto block w-fit"
          >
            Open full analytics
          </RouterLink>
        </div>
      </div>
    </template>

    <!-- Mod create/edit modal -->
    <BaseModal
      v-model="showModModal"
      :title="editingMod ? 'Edit modification' : 'Add modification'"
      @close="closeModal"
    >
      <ModForm
        :initial="editingMod ?? undefined"
        :loading="formLoading"
        :submit-label="editingMod ? 'Update modification' : 'Add modification'"
        @submit="handleModSubmit"
        @cancel="closeModal"
      />
    </BaseModal>
  </AppShell>
</template>
