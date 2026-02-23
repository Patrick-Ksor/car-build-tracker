import { createApp } from "vue";
import { createPinia } from "pinia";
import { Chart, registerables } from "chart.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import router from "@/router";
import App from "./App.vue";
import "./assets/main.css";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Register all Chart.js components with dark defaults
Chart.register(...registerables);
Chart.defaults.color = "#71717a";
Chart.defaults.borderColor = "rgba(255,255,255,0.05)";
Chart.defaults.font.family = "Inter, sans-serif";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Rehydrate auth session before first render (swallow error if unauthenticated)
(async () => {
  const { useAuthStore } = await import("@/stores/auth");
  const authStore = useAuthStore();
  await authStore.fetchMe().catch(() => {});
  app.mount("#app");
})();
