<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string | number | undefined;
    label?: string;
    placeholder?: string;
    error?: string | null;
    hint?: string;
    type?: string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
  }>(),
  {
    type: "text",
    disabled: false,
    required: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [event: FocusEvent];
}>();

const inputId = computed(
  () => props.id ?? `input-${Math.random().toString(36).slice(2, 7)}`
);

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit(
    "update:modelValue",
    props.type === "number" ? Number(target.value) : target.value
  );
}
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
      <span v-if="required" class="text-brand-blue ml-0.5">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="['input', error ? 'input-error' : '']"
      @input="onInput"
      @blur="emit('blur', $event)"
    />

    <Transition name="error-slide">
      <p v-if="error" class="text-xs text-red-400 flex items-center gap-1">
        <span>⚠</span>
        {{ error }}
      </p>
    </Transition>

    <p v-if="hint && !error" class="text-xs text-zinc-500">{{ hint }}</p>
  </div>
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
