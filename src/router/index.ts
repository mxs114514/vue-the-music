import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      // 添加 meta 字段，标记此路由不需要基础布局
      meta: { layout: 'BasicAuthLayout' },
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('../views/AlbumView.vue'),
    },
    {
      path: '/my-music',
      name: 'my-music',
      component: () => import('../views/MyMusicView.vue'),
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import('../views/RankView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/edit-profile',
      name: 'edit-profile',
      component: () => import('../views/EditProfileView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/settings/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. 如果没有登录，且访问的不是登录页 -> 强制跳转登录页
  if (!authStore.token && to.name !== 'login') {
    next({ name: 'login' })
  }
  // 2. 如果已经登录，且访问的是登录页 -> 跳转首页 (避免重复登录)
  else if (authStore.token && to.name === 'login') {
    next({ name: 'home' })
  }
  // 3. 其他情况放行
  else {
    next()
  }
})

export default router
