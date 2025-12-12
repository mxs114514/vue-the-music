<template>
  <div class="sidebar">
    <div class="logo">
      <h1>
      <el-icon ><IEpHeadset /></el-icon>
      莫小帅唱唱播
    </h1>
    </div>
    <el-menu
      default-active="/"
      class="side-menu"
      router
    >
      <el-menu-item index="/">
        <el-icon><IEpHomeFilled /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/album">
        <el-icon><IEpCollection /></el-icon>
        <span>专辑</span>
      </el-menu-item>
      <el-menu-item index="/my-music">
        <el-icon><IEpStarFilled /></el-icon>
        <span>我的收藏</span>
      </el-menu-item>
      <el-menu-item index="/rank">
        <el-icon><IEpTrophy /></el-icon>
        <span>排行榜</span>
      </el-menu-item>
      <el-menu-item index="/profile">
        <el-icon><IEpUserFilled /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar {
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color); /* 侧边栏背景色 */
  display: flex;
  flex-direction: column;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--el-border-color-light);
}
.logo h1 {
  font-size: 18px;
  margin: 0;
  color: var(--el-color-primary);
}

/* 覆盖 el-menu 默认样式 */
.side-menu {
  border-right: none; /* 去除菜单右侧边框 */
  flex: 1;
}
</style>
