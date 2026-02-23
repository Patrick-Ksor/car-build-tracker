<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import AppShell from "@/components/layout/AppShell.vue";
import CarCard from "@/components/cars/CarCard.vue";
import CarForm from "@/components/cars/CarForm.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useCarsStore } from "@/stores/cars";
import { useUiStore } from "@/stores/ui";
import { useStaggerList } from "@/composables/useStaggerList";
import type { Car } from "@/models";
import type { ICar } from "@/types";

const carsStore = useCarsStore();
const uiStore = useUiStore();

const gridRef = ref<HTMLElement | null>(null);
const carsList = computed(() => carsStore.cars);
useStaggerList(gridRef, carsList);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedCar = ref<Car | null>(null);

onMounted(() => carsStore.fetchCars());

async function handleCreate(data: Partial<ICar>) {
  await carsStore.createCar(data);
  showCreateModal.value = false;
  uiStore.success("Car added", "Your new build has been created.");
}

async function handleEdit(data: Partial<ICar>) {
  if (!selectedCar.value) return;
  await carsStore.updateCar(selectedCar.value.id, data);
  showEditModal.value = false;
  uiStore.success("Car updated");
}

async function handleDelete() {
  if (!selectedCar.value) return;
  await carsStore.deleteCar(selectedCar.value.id);
  showDeleteModal.value = false;
  uiStore.success("Car deleted");
}

function openEdit(car: Car) {
  selectedCar.value = car;
  showEditModal.value = true;
}

function openDelete(car: Car) {
  selectedCar.value = car;
  showDeleteModal.value = true;
}
</script>

<template>
  <AppShell>
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-zinc-100">My Cars</h1>
          <p class="text-zinc-500 text-sm mt-0.5">
            {{ carsStore.cars.length }} build{{
              carsStore.cars.length === 1 ? "" : "s"
            }}
            tracked
          </p>
        </div>
        <BaseButton variant="primary" @click="showCreateModal = true">
          + Add car
        </BaseButton>
      </div>

      <!-- Loading -->
      <div
        v-if="carsStore.isLoading"
        class="flex items-center justify-center py-20"
      >
        <LoadingSpinner size="lg" />
      </div>

      <!-- Empty -->
      <div
        v-else-if="carsStore.cars.length === 0"
        class="card p-12 text-center"
      >
        <p class="text-5xl mb-4">🚗</p>
        <h2 class="text-lg font-semibold text-zinc-200">No builds yet</h2>
        <p class="text-zinc-500 text-sm mt-1 mb-5">
          Add your first car to start tracking modifications and costs.
        </p>
        <BaseButton variant="primary" @click="showCreateModal = true"
          >Add your first car</BaseButton
        >
      </div>

      <!-- Grid -->
      <div
        v-else
        ref="gridRef"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CarCard
          v-for="car in carsStore.cars"
          :key="car.id"
          :car="car"
          @edit="openEdit"
          @delete="openDelete"
        />
      </div>
    </div>

    <!-- Create modal -->
    <BaseModal v-model="showCreateModal" title="Add a new car" size="lg">
      <CarForm
        :loading="carsStore.isLoading"
        @submit="handleCreate"
        @cancel="showCreateModal = false"
      />
    </BaseModal>

    <!-- Edit modal -->
    <BaseModal v-model="showEditModal" title="Edit car" size="lg">
      <CarForm
        v-if="selectedCar"
        :initial="selectedCar"
        :loading="carsStore.isLoading"
        submit-label="Save changes"
        @submit="handleEdit"
        @cancel="showEditModal = false"
      />
    </BaseModal>

    <!-- Delete confirmation -->
    <BaseModal v-model="showDeleteModal" title="Delete car" size="sm">
      <div class="space-y-4">
        <p class="text-zinc-400 text-sm">
          Are you sure you want to delete
          <strong class="text-zinc-100">{{ selectedCar?.displayName }}</strong
          >? This will also remove all associated modifications. This action
          cannot be undone.
        </p>
        <div class="flex gap-3">
          <BaseButton
            variant="danger"
            :loading="carsStore.isLoading"
            class="flex-1"
            @click="handleDelete"
          >
            Delete
          </BaseButton>
          <BaseButton variant="secondary" @click="showDeleteModal = false"
            >Cancel</BaseButton
          >
        </div>
      </div>
    </BaseModal>
  </AppShell>
</template>
