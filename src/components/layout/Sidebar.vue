<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import gsap from "gsap";

interface NavItem {
  to: string;
  icon: string;
  label: string;
  name: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", icon: "⚡", label: "Dashboard", name: "dashboard" },
  { to: "/cars", icon: "🚗", label: "My Cars", name: "cars" },
];

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();
const route = useRoute();
const sidebarRef = ref<HTMLElement | null>(null);

const isOpen = computed(() => uiStore.sidebarOpen);

function isActive(name: string): boolean {
  return route.name === name || String(route.name ?? "").startsWith(name);
}

async function handleLogout() {
  await authStore.logout();
  router.push({ name: "login" });
}

function closeMobileSidebar() {
  if (window.innerWidth < 1024) {
    uiStore.closeSidebar();
  }
}

onMounted(() => {
  if (sidebarRef.value) {
    gsap.from(sidebarRef.value, {
      x: -20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      clearProps: "all",
    });
  }
});
</script>

<template>
  <!-- Mobile overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-20 bg-black/60 lg:hidden backdrop-blur-sm"
      @click="uiStore.closeSidebar()"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    ref="sidebarRef"
    :class="[
      'fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-zinc-900 border-r border-zinc-800',
      'transition-transform duration-300 ease-in-out',
      'lg:relative lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-zinc-800">
      <div
        class="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center font-bold text-white text-sm"
      >
        C
      </div>
      <span class="font-bold text-zinc-100 tracking-tight">Build Tracker</span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      <RouterLink
        v-for="item in NAV_ITEMS"
        :key="item.name"
        :to="item.to"
        @click="closeMobileSidebar"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
          isActive(item.name)
            ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
        ]"
      >
        <span class="text-base leading-none">{{ item.icon }}</span>
        {{ item.label }}
        <span
          v-if="isActive(item.name)"
          class="ml-auto w-1.5 h-1.5 rounded-full bg-brand-blue"
        />
      </RouterLink>
    </nav>

    <!-- User section -->
    <div class="px-3 py-4 border-t border-zinc-800">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
        <!-- Avatar -->
        <div
          class="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-xs font-bold text-brand-blue flex-shrink-0"
        >
          {{ authStore.initials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-zinc-100 truncate">
            {{ authStore.displayName }}
          </p>
          <p class="text-xs text-zinc-500 truncate">
            {{ authStore.user?.email }}
          </p>
        </div>
      </div>
      <button
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-150"
        @click="handleLogout"
      >
        <span>↩</span>
        Sign out
      </button>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
