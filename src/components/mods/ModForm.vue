<script setup lang="ts">
import { watch } from "vue";
import { useModForm } from "@/composables/useModForm";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { ModCategory } from "@/types";
import type { IMod } from "@/types";

const CATEGORIES = Object.values(ModCategory).map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}));

const props = withDefaults(
  defineProps<{
    initial?: Partial<IMod>;
    loading?: boolean;
    submitLabel?: string;
  }>(),
  { submitLabel: "Save modification" }
);

const emit = defineEmits<{
  submit: [data: Partial<IMod>];
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
} = useModForm(props.initial);

watch(
  () => props.initial,
  (v) => reset(v),
  { deep: true }
);

function handleSubmit() {
  if (!validateAll()) return;
  emit("submit", { ...formData });
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
    <BaseInput
      v-model="formData.name"
      label="Modification name"
      placeholder="Cobb Accessport V3"
      :error="errors.name"
      required
      @blur="validateField('name')"
    />

    <!-- Category select -->
    <div class="space-y-1.5">
      <label class="label">
        Category <span class="text-brand-blue">*</span>
      </label>
      <select
        v-model="formData.category"
        :class="['input', errors.category ? 'input-error' : '']"
        @blur="validateField('category')"
      >
        <option v-for="cat in CATEGORIES" :key="cat.value" :value="cat.value">
          {{ cat.label }}
        </option>
      </select>
      <p v-if="errors.category" class="text-xs text-red-400">
        {{ errors.category }}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BaseInput
        v-model="formData.cost"
        label="Cost (USD)"
        type="number"
        placeholder="699"
        :error="errors.cost"
        required
        @blur="validateField('cost')"
      />
      <BaseInput
        v-model="formData.hpGain"
        label="HP Gain"
        type="number"
        placeholder="15"
        hint="Use 0 if no HP change"
        :error="errors.hpGain"
        required
        @blur="validateField('hpGain')"
      />
    </div>

    <BaseInput
      v-model="formData.installDate"
      label="Install date"
      type="date"
      :error="errors.installDate"
      required
      @blur="validateField('installDate')"
    />

    <!-- Notes textarea -->
    <div class="space-y-1.5">
      <label class="label">Notes</label>
      <textarea
        v-model="formData.notes"
        rows="3"
        placeholder="Any notes about this modification..."
        :class="['input resize-none', errors.notes ? 'input-error' : '']"
        @blur="validateField('notes')"
      />
      <p v-if="errors.notes" class="text-xs text-red-400">{{ errors.notes }}</p>
    </div>

    <Transition name="error-fade">
      <p
        v-if="submitError"
        class="text-sm text-red-400 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20"
      >
        {{ submitError }}
      </p>
    </Transition>

    <div class="flex items-center gap-3 pt-2">
      <BaseButton
        type="submit"
        variant="primary"
        :loading="loading || isSubmitting"
        class="flex-1"
      >
        {{ submitLabel }}
      </BaseButton>
      <BaseButton type="button" variant="secondary" @click="emit('cancel')"
        >Cancel</BaseButton
      >
    </div>
  </form>
</template>

<style scoped>
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
