<script setup lang="ts">
import AppSideNavBar from './AppSideNavBar.vue'
import AppHeader from './AppHeader.vue'
import AppFooterPlayerBar from './AppFooterPlayerBar.vue'
</script>

<template>
  <el-container class="layout-container">
    <!-- 上半部分：侧边栏 + 右侧内容 -->
    <el-container class="main-wrapper">
      <!-- 左侧侧边栏 -->
      <el-aside width="200px" class="left-side">
        <AppSideNavBar />
      </el-aside>

      <!-- 右侧主体 -->
      <el-container class="right-side">
        <!-- 顶部 -->
        <el-header height="auto">
          <AppHeader />
        </el-header>

        <!-- 中间内容区 (插槽) -->
        <el-main class="main-content">
          <slot></slot>
        </el-main>
      </el-container>
    </el-container>

    <!-- 底部播放栏 (横跨全屏) -->
    <el-footer height="80px" class="footer-bar">
      <AppFooterPlayerBar />
    </el-footer>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-wrapper {
  overflow: hidden; /* 防止溢出 */
}

.left-side {
  border-right: 1px solid var(--el-border-color-light);
}

.right-side {
  background-color: var(--el-fill-color-lighter);
}

.main-content {
  padding: 20px;
  position: relative;
}

.footer-bar {
  z-index: 100;
  border-top: 1px solid var(--el-border-color-light);
}

/* 去除 Element Plus 容器组件的默认 Padding */
.el-header, .el-footer {
  padding: 0;
}
</style>
