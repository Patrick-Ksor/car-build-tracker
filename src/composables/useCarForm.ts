import { reactive, ref, computed } from "vue";
import { carValidator } from "@/validators/CarValidator";
import type { CarFormData } from "@/validators/CarValidator";
import type { ICar } from "@/types";

/**
 * Encapsulates Car form state, validation, and submission handling.
 * Used by CarForm.vue for both create and edit modes.
 */
export function useCarForm(initial?: Partial<ICar>) {
  const formData = reactive<CarFormData>({
    make: initial?.make ?? "",
    model: initial?.model ?? "",
    year: initial?.year ?? new Date().getFullYear(),
    nickname: initial?.nickname ?? "",
    imageUrl: initial?.imageUrl ?? "",
    baseHp: initial?.baseHp ?? 0,
    isPublic: initial?.isPublic ?? false,
  });

  const errors = reactive<Partial<Record<keyof CarFormData, string | null>>>(
    {},
  );
  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);

  const isValid = computed(() =>
    carValidator.isValid(formData as Partial<ICar>),
  );

  function validateField(field: keyof CarFormData) {
    const result = carValidator.validateField(
      field as keyof ICar,
      formData[field],
    );
    errors[field] = result;
  }

  function validateAll(): boolean {
    const result = carValidator.validate(formData as Partial<ICar>);
    Object.assign(errors, result);
    return Object.values(result).every((e) => e === null);
  }

  function reset(data?: Partial<ICar>) {
    formData.make = data?.make ?? "";
    formData.model = data?.model ?? "";
    formData.year = data?.year ?? new Date().getFullYear();
    formData.nickname = data?.nickname ?? "";
    formData.imageUrl = data?.imageUrl ?? "";
    formData.baseHp = data?.baseHp ?? 0;
    formData.isPublic = data?.isPublic ?? false;
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
