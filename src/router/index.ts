import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import AlbumView from '../views/AlbumView.vue'
import MyMusicView from '../views/MyMusicView.vue'
import RankView from '../views/RankView.vue'
import ProfileView from '../views/ProfileView.vue'
import EditProfileView from '../views/EditProfileView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      // 添加 meta 字段，标记此路由不需要基础布局
      meta: { layout: 'BasicAuthLayout' },
    },
    {
      path: '/album',
      name: 'album',
      component: AlbumView,
    },
    {
      path: '/my-music',
      name: 'my-music',
      component: MyMusicView,
    },
    {
      path: '/rank',
      name: 'rank',
      component: RankView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/edit-profile',
      name: 'edit-profile',
      component: EditProfileView,
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
