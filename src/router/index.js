// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/board',
    component: () => import('@/layout/Default.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/Home.vue'),
      },
      {
        path: '/board/:id',
        name: 'Board',
        component: () => import('@/views/board/Board.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layout/Auth.vue'),
    children: [
      {
        path: '',
        name: 'Auth',
        component: () => import('@/views/auth/Auth.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth) {
    const { token } = useAuthStore();

    if(!token) next({ name: 'Auth'})
    else next()
  }
  else next()
})

export default router
