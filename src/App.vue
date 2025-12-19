<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
// 引入你的布局组件
import BasicLayout from '@/components/layout/BasicLayout.vue' // 假设还在原位置
import BasicAuthLayout from '@/components/layout/BasicAuthLayout.vue' // 新建的

const route = useRoute()

// 1. 定义布局映射表 (字符串 -> 组件)
const layouts: Record<string, any> = {
  BasicLayout,
  BasicAuthLayout,
}

// 2. 动态计算当前布局
const layout = computed(() => {
  // 获取路由定义的 layout，如果没有定义，默认使用 BasicLayout
  const layoutName = (route.meta.layout as string) || 'BasicLayout'

  // 返回对应的组件，如果找不到（比如拼写错误），兜底回 BasicLayout
  return layouts[layoutName] || BasicLayout
})
</script>

<template>
  <!-- 3. 使用动态组件渲染布局 -->
  <!-- component :is 会根据 layout 变量的变化，自动切换组件 -->
  <component :is="layout">
    <RouterView />
  </component>
</template>
