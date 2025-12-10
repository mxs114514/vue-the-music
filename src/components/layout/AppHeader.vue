<template>
  <header class="header">
    <div class="search-bar">
      <!-- 测试自动导入: el-input, el-icon, IEpSearch -->
      <el-input
        placeholder="搜索音乐..."
        class="search-input"
      >
        <template #prefix>
          <el-icon>
            <IEpSearch />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="user-info">
      <span class="username">用户</span>
      <div class="avatar">U</div>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.search-bar input {
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  width: 300px;
  outline: none;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 32px;
  height: 32px;
  background-color: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
