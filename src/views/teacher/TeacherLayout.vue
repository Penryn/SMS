<template>
  <div class="layout-root">
    <aside class="sidebar">
      <slot name="sidebar"></slot>
    </aside>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  DataBoard,
  Reading,
  User,
  Document,
  Avatar,
  ArrowDown
} from '@element-plus/icons-vue'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const userAvatar = computed(() => {
  return ''
})

const getCurrentPageTitle = () => {
  const routeMap: Record<string, string> = {
    '/teacher/dashboard': '仪表盘',
    '/teacher/courses': '我的课程',
    '/teacher/students': '学生管理',
    '/teacher/scores': '成绩管理',
    '/teacher/profile': '个人信息'
  }
  return routeMap[route.path] || '首页'
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      authStore.logout()
      router.push('/login')
    } catch {
      // 用户取消
    }
  } else if (command === 'profile') {
    router.push('/teacher/profile')
  }
}
</script>

<style scoped>
.layout-root {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
  background: #f5f6fa;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.sidebar {
  width: 220px;
  height: 100vh;
  background: #253858;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.main-area {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0;
}
.main-content {
  flex: 1;
  overflow: auto;
  background: transparent;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #435266;
}
.logo h2 {
  margin: 0;
  font-size: 18px;
  color: #fff;
}
.logo p {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: #bfcbd9;
}
.sidebar-menu {
  border: none;
}
.header-left {
  flex: 1;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.user-info:hover {
  background-color: #f5f5f5;
}
.username {
  margin: 0 8px;
  color: #333;
}
</style> 