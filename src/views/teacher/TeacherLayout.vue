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
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  background: #f5f6fa;
}
.sidebar {
  width: 220px;
  height: 100vh;
  min-height: 100vh;
  background: #253858;
  color: #fff;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background: transparent;
  display: flex;
  flex-direction: column;
}
</style> 