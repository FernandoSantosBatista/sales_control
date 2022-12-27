import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import { useUserStore } from "../stores/user";
import ManagementView from "../views/ManagementView.vue";

const requireAuth = async (to, from, next) => {
  const userStore = useUserStore();
  userStore.loadingSession = true;
  const user = await userStore.currentUser();
  if (user) {
      next();
  } else {
      next("/login");
  }
  userStore.loadingSession = false;
};

const routes = [
  { path: "/", component: HomeView, beforeEnter: requireAuth },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/about", component: AboutView },
  { path: "/about", component: AboutView },
  { path: "/gerenciamento/", component: ManagementView },

];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;