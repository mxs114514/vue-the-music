<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  trigger?: 'always' | 'hover' // always: 一直滚动, hover: 悬停滚动
}>(), {
  trigger: 'always'
})

const containerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const isOverflow = ref(false)

// 检查是否溢出
const checkOverflow = async () => {
  await nextTick()
  if (!containerRef.value || !textRef.value) return

  // 如果文本宽度 > 容器宽度，则标记为溢出
  isOverflow.value = textRef.value.scrollWidth > containerRef.value.clientWidth
}

// 监听文本变化，重新计算
watch(() => props.text, checkOverflow)

onMounted(checkOverflow)
</script>

<template>
  <div
    class="scrolling-text-container"
    ref="containerRef"
    :class="[`trigger-${trigger}`, { 'is-overflow': isOverflow }]"
  >
    <div class="scroll-wrapper" v-if="isOverflow">
      <!-- 原始内容 -->
      <span class="content" ref="textRef">{{ text }}</span>
      <!-- 影子内容 (用于无缝衔接) -->
      <span class="content shadow">{{ text }}</span>
    </div>

    <!-- 不溢出时，只显示普通文本 -->
    <div class="static-text" v-else ref="textRef">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
.scrolling-text-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  /* 确保容器有高度 */
  display: flex;
  align-items: center;
}

.scroll-wrapper {
  display: inline-block;
  white-space: nowrap;
  animation: scroll-left 10s linear infinite;
  /* 默认让内容撑开宽度，方便计算 */
}

.content {
  display: inline-block;
  padding-right: 50px; /* 两段文字之间的间距 */
}

.static-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

/* 动画定义：向左移动 50% (因为我们有两份内容，移动完一份的长度即可重置) */
@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* === 触发逻辑控制 === */

/* 1. Always 模式：一直滚动 */
.trigger-always.is-overflow .scroll-wrapper {
  animation-play-state: running;
}

/* 2. Hover 模式：默认暂停，Hover 时滚动 */
.trigger-hover.is-overflow .scroll-wrapper {
  animation-play-state: paused;
}

/* 注意：这里我们预留了一个机制，让父组件可以通过 CSS 控制子组件的滚动 */
/* 如果父组件 hover，我们可以通过 :deep() 或者全局类来控制 */
</style>
