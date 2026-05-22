import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./views/Home.vue";
import Echo from "./views/Echo.vue";
import ContactDetail from "./views/ContactDetail.vue";
import Social from "./views/Social.vue";
import Report from "./views/Report.vue";
import Onboarding from "./views/Onboarding.vue";
import Notifications from "./views/Notifications.vue";
import Settings from "./views/Settings.vue";
import { store } from "./store.js";

const routes = [
  { path: "/", component: Home },
  { path: "/onboard", component: Onboarding },
  { path: "/echo", component: Echo },
  { path: "/echo/contact/:id", component: ContactDetail, props: true },
  { path: "/notifications", component: Notifications },
  { path: "/social", component: Social },
  { path: "/report", component: Report },
  { path: "/settings", component: Settings },
];

const router = createRouter({ history: createWebHashHistory(), routes });

// 首次使用自动跳转到引导页
router.beforeEach((to, _from, next) => {
  const onboarded = store.settings && store.settings.onboarded;
  if (!onboarded && to.path !== "/onboard") {
    return next("/onboard");
  }
  next();
});

export default router;
