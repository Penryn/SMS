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
  User,
  Avatar,
  School,
  Reading,
  OfficeBuilding,
  Calendar,
  TrendCharts,
  ArrowDown
} from '@element-plus/icons-vue'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const userAvatar = computed(() => {
  // 这里可以设置用户头像，暂时使用默认头像
  return ''
})

const getCurrentPageTitle = () => {
  const routeMap: Record<string, string> = {
    '/admin/dashboard': '仪表盘',
    '/admin/students': '学生管理',
    '/admin/teachers': '教师管理',
    '/admin/classes': '班级管理',
    '/admin/courses': '课程管理',
    '/admin/departments': '部门管理',
    '/admin/teachings': '授课管理',
    '/admin/statistics': '统计分析'
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
    // 跳转到个人信息页面
    console.log('个人信息')
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