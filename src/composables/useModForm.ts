import { reactive, ref, computed } from "vue";
import { modValidator } from "@/validators/ModValidator";
import { ModCategory } from "@/types";
import type { ModFormData } from "@/validators/ModValidator";
import type { IMod } from "@/types";

/**
 * Encapsulates Mod form state, validation, and submission handling.
 * Used by ModForm.vue for both create and edit modes.
 */
export function useModForm(initial?: Partial<IMod>) {
  const today = new Date().toISOString().split("T")[0]!;

  const formData = reactive<ModFormData>({
    name: initial?.name ?? "",
    category: initial?.category ?? ModCategory.Other,
    cost: initial?.cost ?? 0,
    hpGain: initial?.hpGain ?? 0,
    installDate: initial?.installDate ?? today,
    notes: initial?.notes ?? "",
  });

  const errors = reactive<Partial<Record<keyof ModFormData, string | null>>>(
    {},
  );
  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);

  const isValid = computed(() =>
    modValidator.isValid(formData as Partial<IMod>),
  );

  function validateField(field: keyof ModFormData) {
    const result = modValidator.validateField(
      field as keyof IMod,
      formData[field],
    );
    errors[field] = result;
  }

  function validateAll(): boolean {
    const result = modValidator.validate(formData as Partial<IMod>);
    Object.assign(errors, result);
    return Object.values(result).every((e) => e === null);
  }

  function reset(data?: Partial<IMod>) {
    formData.name = data?.name ?? "";
    formData.category = data?.category ?? ModCategory.Other;
    formData.cost = data?.cost ?? 0;
    formData.hpGain = data?.hpGain ?? 0;
    formData.installDate = data?.installDate ?? today;
    formData.notes = data?.notes ?? "";
    Object.keys(errors).forEach(
      (k) => delete (errors as Record<string, unknown>)[k],
    );
    submitError.value = null;
  }

  return {
    formData,
    errors,
    isValid,
    isSubmitting,
    submitError,
    validateField,
    validateAll,
    reset,
  };
}
