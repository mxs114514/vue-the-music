<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="container">
    <h1>Hello Vue 3 + TypeScript!</h1>
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit
        <code>src/App.vue</code> to test HMR
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
</style>
