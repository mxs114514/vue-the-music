<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/business/LoginForm.vue'
import RegisterForm from '@/components/business/RegisterForm.vue'

// 控制模式：false = 登录模式, true = 注册模式
const isSignUpMode = ref(false)

// 切换模式
const toggleMode = () => {
  isSignUpMode.value = !isSignUpMode.value
}
</script>

<template>
  <!-- 动态绑定 class 来控制动画状态 -->
  <div class="container" :class="{ 'sign-up-mode': isSignUpMode }">
    <div class="forms-container">
      <div class="signin-signup">

        <!-- 登录表单 -->
        <LoginForm class="sign-in-form" />

        <!-- 注册表单 -->
        <RegisterForm class="sign-up-form" />
      </div>
    </div>

    <div class="panels-container">
      <!-- 左侧面板 (登录模式下显示在左边) -->
      <div class="panel left-panel">
        <div class="content">
          <h3>新朋友？</h3>
          <p>输入您的个人详细信息，开始与我们的旅程</p>
          <el-button class="btn transparent" round @click="toggleMode">去注册</el-button>
        </div>
        <img src="/imgs/登录.png" class="image" alt="登录插图" />
      </div>

      <!-- 右侧面板 (注册模式下显示在右边) -->
      <div class="panel right-panel">
        <div class="content">
          <h3>已经是会员？</h3>
          <p>请登录您的账户，继续享受音乐</p>
          <el-button class="btn transparent" round @click="toggleMode">去登录</el-button>
        </div>
        <img src="/imgs/注册.png" class="image" alt="注册插图" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  background-color: var(--el-bg-color);
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%; /* 默认登录表单在右侧 (75%处) */
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0.5rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.btn {
  width: 150px;
  height: 49px;
  border: none;
  outline: none;
  border-radius: 49px;
  cursor: pointer;
  background-color: var(--el-color-primary);
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  transition: 0.5s;
}

.btn:hover {
  background-color: var(--el-color-primary-dark-2);
}

.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 80%; /* 稍微缩小图片宽度 */
  max-width: 350px; /* 限制最大宽度 */
  border-radius: 20px; /* 添加圆角 */
  box-shadow: 0 10px 20px rgba(0,0,0,0.15); /* 添加轻微阴影增加质感 */
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}
/* 图片位置 */
.left-panel {
  pointer-events: all;
  padding: 0rem 30% 2rem 10%;
}
.right-panel {
  pointer-events: none;
  padding: 0rem 10% 2rem 30%;
}

.panel .content {
  color: var(--el-color-white);
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid var(--el-color-white);
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--el-color-white);
}

.btn.transparent:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: var(--el-color-white);
  color: var(--el-color-white);
}

/* 动画核心逻辑 */

/* 1. 注册模式下，背景圆圈移动 */
.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

/* 2. 注册模式下，左面板移出，右面板移入 */
.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%; /* 表单容器移到左侧 */
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

/* 初始状态下，右面板在屏幕外 */
.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* 响应式调整 (可选，防止小屏幕炸裂) */
@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }
  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }
  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }
  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }
  .right-panel {
    grid-row: 3 / 4;
  }
  .left-panel {
    grid-row: 1 / 2;
  }
  .image {
    width:200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }
  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }
  .panel h3 {
    font-size: 1.2rem;
  }
  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }
  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }
  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }
  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }
  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }
  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }
  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }
  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}
</style>
