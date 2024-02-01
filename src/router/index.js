// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layout/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/Home.vue'),
      },
      {
        path: '/:id',
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

export default router
