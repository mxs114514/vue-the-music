<template>
  <aside class="sidebar">
    <div class="logo">
      <h1>🎵 唱唱播</h1>
    </div>
    <nav>
      <ul>
        <li class="active"><a href="#">首页</a></li>
        <li><a href="#">我的音乐</a></li>
        <li><a href="#">排行榜</a></li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ddd;
}
.logo h1 {
  font-size: 18px;
  margin: 0;
  color: #42b983;
}
nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
nav li a {
  display: block;
  padding: 15px 20px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
}
nav li.active a, nav li a:hover {
  background-color: #e6e6e6;
  color: #42b983;
}
</style>
