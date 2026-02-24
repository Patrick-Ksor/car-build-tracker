import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // ---- Root redirect ----
    {
      path: "/",
      redirect: "/dashboard",
    },

    // ---- Auth (public) ----
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/auth/LoginView.vue"),
      meta: { requiresGuest: true, title: "Sign In" },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/auth/RegisterView.vue"),
      meta: { requiresGuest: true, title: "Create Account" },
    },

    // ---- Protected ----
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("@/views/DashboardView.vue"),
      meta: { requiresAuth: true, title: "Dashboard" },
    },
    {
      path: "/cars",
      name: "cars",
      component: () => import("@/views/CarsView.vue"),
      meta: { requiresAuth: true, title: "My Cars" },
    },
    {
      path: "/cars/:id",
      name: "car-detail",
      component: () => import("@/views/CarDetailView.vue"),
      meta: { requiresAuth: true, title: "Build Detail" },
      props: true,
    },
    {
      path: "/cars/:id/analytics",
      name: "analytics",
      component: () => import("@/views/AnalyticsView.vue"),
      meta: { requiresAuth: true, title: "Analytics" },
      props: true,
    },

    // ---- Public build page (no auth required) ----
    {
      path: "/build/:id",
      name: "public-build",
      component: () => import("@/views/PublicBuildView.vue"),
      meta: { requiresAuth: false, title: "Public Build" },
      props: true,
    },

    // ---- 404 ----
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],

  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  },
});

// ---- Navigation Guard ----
router.beforeEach((to, _from) => {
  const authStore = useAuthStore();

  // Update document title
  if (to.meta.title) {
    document.title = `${String(to.meta.title)} | Car Build Tracker`;
  }

  // Redirect unauthenticated users away from protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  // Redirect authenticated users away from auth pages
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: "dashboard" };
  }
});

export default router;
