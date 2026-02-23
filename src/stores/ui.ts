import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ModalName, Toast } from "@/types";

export const useUiStore = defineStore("ui", () => {
  // ---- State ----
  const sidebarOpen = ref(false);
  const activeModal = ref<ModalName>(null);
  const modalPayload = ref<Record<string, unknown> | null>(null);
  const toasts = ref<Toast[]>([]);

  // ---- Getters ----
  const hasActiveModal = computed(() => activeModal.value !== null);

  // ---- Sidebar ----
  function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function closeSidebar(): void {
    sidebarOpen.value = false;
  }

  function openSidebar(): void {
    sidebarOpen.value = true;
  }

  // ---- Modals ----
  function openModal(name: ModalName, payload?: Record<string, unknown>): void {
    activeModal.value = name;
    modalPayload.value = payload ?? null;
  }

  function closeModal(): void {
    activeModal.value = null;
    modalPayload.value = null;
  }

  // ---- Toasts ----
  function addToast(toast: Omit<Toast, "id">): void {
    const id = crypto.randomUUID();
    toasts.value.push({ ...toast, id });

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }

  function removeToast(id: string): void {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function success(title: string, message?: string): void {
    addToast({ type: "success", title, message });
  }

  function errorToast(title: string, message?: string): void {
    addToast({ type: "error", title, message });
  }

  function info(title: string, message?: string): void {
    addToast({ type: "info", title, message });
  }

  function warning(title: string, message?: string): void {
    addToast({ type: "warning", title, message });
  }

  return {
    sidebarOpen,
    activeModal,
    modalPayload,
    toasts,
    hasActiveModal,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    openModal,
    closeModal,
    addToast,
    removeToast,
    success,
    errorToast,
    info,
    warning,
  };
});
