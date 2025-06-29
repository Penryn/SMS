<template>
  <div class="layout-root">
    <aside class="sidebar">
      <div class="logo">
        <h2>学生管理系统</h2>
        <p>管理员端</p>
      </div>
      
      <el-menu
        :default-active="route.path"
        class="sidebar-menu"
        background-color="#253858"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/students">
          <el-icon><User /></el-icon>
          <span>学生管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/teachers">
          <el-icon><Avatar /></el-icon>
          <span>教师管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/classes">
          <el-icon><School /></el-icon>
          <span>班级管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/courses">
          <el-icon><Reading /></el-icon>
          <span>课程管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/departments">
          <el-icon><OfficeBuilding /></el-icon>
          <span>部门管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/teachings">
          <el-icon><Calendar /></el-icon>
          <span>授课管理</span>
        </el-menu-item>
      </el-menu>
    </aside>
    
    <div class="main-area">
      <header class="header">
        <div class="header-left">
          <h3>{{ getCurrentPageTitle() }}</h3>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon class="user-avatar"><Avatar /></el-icon>
              <span class="username">{{ username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <main class="main-content">
        <router-view />
      </main>
    </div>
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
  ArrowDown
} from '@element-plus/icons-vue'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.user?.username || '')

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
    '/admin/teachings': '授课管理'
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
  flex-shrink: 0;
}

.main-area {
  flex: 1;
  width: calc(100vw - 220px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
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
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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
  flex: 1;
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

.user-avatar {
  width: 32px;
  height: 32px;
  background: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
</style> 