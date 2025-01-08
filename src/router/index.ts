import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { auth } from '@/firebase';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/lists'
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterPage.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/lists'
      },
      {
        path: 'lists',
        component: () => import('@/views/ListsPage.vue')
      },
      {
        path: 'shared',
        component: () => import('@/views/SharedListsPage.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/ProfilePage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Proteção de rotas simplificada
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;
  const rememberMe = localStorage.getItem('rememberMe') === 'true';

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (currentUser && rememberMe && (to.path === '/login' || to.path === '/register')) {
    next('/tabs/lists');
  } else {
    next();
  }
});

export default router;
