import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from '@/components/LoginComponent.vue'; // Ajuste o caminho se necessário
import VacationPlans from '@/components/VacationPlans.vue'; // Ajuste o caminho se necessário

const routes = [
  { path: '/', name: 'LoginComponent', component: LoginComponent },
  { path: '/vacation-plans', name: 'VacationPlans', component: VacationPlans, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/');
  } else {
    next();
  }
});

export default router;