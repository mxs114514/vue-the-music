<script setup lang="ts">
import AppSideNavBar from './AppSideNavBar.vue'
import AppHeader from './AppHeader.vue'
import AppFooterPlayerBar from './AppFooterPlayerBar.vue'
</script>

<template>
  <div class="layout-container">
    <!-- 上半部分：侧边栏 + 右侧内容 -->
    <div class="main-wrapper">
      <!-- 左侧侧边栏 -->
      <aside class="left-side">
        <AppSideNavBar />
      </aside>

      <!-- 右侧主体 -->
      <div class="right-side">
        <!-- 顶部 -->
        <AppHeader />

        <!-- 中间内容区 (插槽) -->
        <main class="main-content">
          <slot></slot>
        </main>
      </div>
    </div>

    <!-- 底部播放栏 (横跨全屏) -->
    <footer class="footer-bar">
      <AppFooterPlayerBar />
    </footer>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column; /* 整体改为上下布局 */
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-wrapper {
  flex: 1; /* 占据除底部外的所有空间 */
  display: flex; /* 内部左右布局 */
  overflow: hidden; /* 防止溢出 */
}

.left-side {
  width: 200px;
  flex-shrink: 0;
  border-right: 1px solid #eee;
}

.right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  min-width: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  position: relative;
}

.footer-bar {
  height: 80px;
  flex-shrink: 0;
  z-index: 100;
  /* 确保横跨全屏 */
  width: 100%;
  border-top: 1px solid #eee;
}
</style>
