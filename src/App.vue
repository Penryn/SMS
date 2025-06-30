<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  console.error('应用错误:', err)
  error.value = err
  return false
})
</script>

<template>
  <div id="app">
    <div v-if="error" class="error-container">
      <h2>应用出现错误</h2>
      <p>{{ error.message }}</p>
      <button @click="error = null">重试</button>
    </div>
    <router-view v-else />
  </div>
</template>

<style>
/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  color: #2c3e50;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 错误容器样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.error-container h2 {
  color: #ff6b6b;
  margin-bottom: 16px;
  font-size: 2rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.error-container p {
  margin-bottom: 24px;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.9);
  max-width: 500px;
  line-height: 1.6;
}

.error-container button {
  margin-top: 20px;
  padding: 12px 32px;
  background: linear-gradient(45deg, #409eff, #36a3f7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.error-container button:hover {
  background: linear-gradient(45deg, #337ecc, #2d8fd6);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.error-container button:active {
  transform: translateY(0);
}

/* 全局动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 全局卡片样式 */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}
</style>
