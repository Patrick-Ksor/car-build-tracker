<script setup lang="ts">
import { watch } from "vue";
import { useCarForm } from "@/composables/useCarForm";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import type { ICar } from "@/types";

const props = withDefaults(
  defineProps<{
    initial?: Partial<ICar>;
    loading?: boolean;
    submitLabel?: string;
  }>(),
  {
    submitLabel: "Save car",
  }
);

const emit = defineEmits<{
  submit: [data: Partial<ICar>];
  cancel: [];
}>();

const {
  formData,
  errors,
  isSubmitting,
  submitError,
  validateField,
  validateAll,
  reset,
} = useCarForm(props.initial);

watch(
  () => props.initial,
  (newVal) => reset(newVal),
  { deep: true }
);

function handleSubmit() {
  if (!validateAll()) return;
  emit("submit", { ...formData });
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BaseInput
        v-model="formData.make"
        label="Make"
        placeholder="Subaru"
        :error="errors.make"
        required
        @blur="validateField('make')"
      />
      <BaseInput
        v-model="formData.model"
        label="Model"
        placeholder="WRX STI"
        :error="errors.model"
        required
        @blur="validateField('model')"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BaseInput
        v-model="formData.year"
        label="Year"
        type="number"
        placeholder="2019"
        :error="errors.year"
        required
        @blur="validateField('year')"
      />
      <BaseInput
        v-model="formData.baseHp"
        label="Base Horsepower"
        type="number"
        placeholder="310"
        :error="errors.baseHp"
        hint="Stock HP before modifications"
        required
        @blur="validateField('baseHp')"
      />
    </div>

    <BaseInput
      v-model="formData.nickname"
      label="Nickname"
      placeholder="Project Rex (optional)"
      :error="errors.nickname"
      @blur="validateField('nickname')"
    />

    <BaseInput
      v-model="formData.imageUrl"
      label="Image URL"
      type="url"
      placeholder="https://... (optional)"
      :error="errors.imageUrl"
      @blur="validateField('imageUrl')"
    />

    <!-- Public toggle -->
    <label class="flex items-center gap-3 cursor-pointer select-none">
      <div class="relative">
        <input v-model="formData.isPublic" type="checkbox" class="sr-only" />
        <div
          :class="[
            'w-10 h-6 rounded-full transition-colors duration-200',
            formData.isPublic ? 'bg-brand-blue' : 'bg-zinc-700',
          ]"
        />
        <div
          :class="[
            'absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
            formData.isPublic ? 'translate-x-4' : 'translate-x-0',
          ]"
        />
      </div>
      <div>
        <span class="text-sm font-medium text-zinc-200">Make build public</span>
        <p class="text-xs text-zinc-500">
          Others can view this build via a shareable link
        </p>
      </div>
    </label>

    <Transition name="error-slide">
      <p
        v-if="submitError"
        class="text-sm text-red-400 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20"
      >
        {{ submitError }}
      </p>
    </Transition>

    <!-- Actions -->
    <div class="flex items-center gap-3 pt-2">
      <BaseButton
        type="submit"
        variant="primary"
        :loading="loading || isSubmitting"
        class="flex-1"
      >
        {{ submitLabel }}
      </BaseButton>
      <BaseButton type="button" variant="secondary" @click="emit('cancel')">
        Cancel
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.2s ease;
}
.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
