<template>
  <div class="layout-root">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="logo">
        <div class="logo-icon">🎓</div>
        <div class="logo-text" v-show="!sidebarCollapsed">
          <h2>学生管理系统</h2>
          <p>教师工作台</p>
        </div>
      </div>
      
      <!-- 侧边栏折叠按钮 -->
      <div class="sidebar-toggle" @click="toggleSidebar">
        <el-icon>
          <Expand v-if="sidebarCollapsed" />
          <Fold v-else />
        </el-icon>
      </div>
      
      <el-menu
        :default-active="route.path"
        :collapse="sidebarCollapsed"
        class="sidebar-menu"
        background-color="transparent"
        text-color="rgba(255,255,255,0.8)"
        active-text-color="#ffffff"
        router
        unique-opened
      >
        <el-menu-item index="/teacher/dashboard" class="menu-item">
          <el-icon><DataBoard /></el-icon>
          <span class="menu-title">教学仪表盘</span>
          <div class="menu-item-bg"></div>
        </el-menu-item>
        
        <el-menu-item index="/teacher/courses" class="menu-item">
          <el-icon><Document /></el-icon>
          <span class="menu-title">课程管理</span>
          <div class="menu-item-bg"></div>
        </el-menu-item>
        
        <el-menu-item index="/teacher/students" class="menu-item">
          <el-icon><User /></el-icon>
          <span class="menu-title">学生管理</span>
          <div class="menu-item-bg"></div>
        </el-menu-item>
        
        <el-menu-item index="/teacher/profile" class="menu-item">
          <el-icon><Avatar /></el-icon>
          <span class="menu-title">个人中心</span>
          <div class="menu-item-bg"></div>
        </el-menu-item>
      </el-menu>
      
      <!-- 教师信息卡片 -->
      <div class="teacher-info-card" v-show="!sidebarCollapsed">
        <div class="teacher-avatar">
          <el-icon><Avatar /></el-icon>
        </div>
        <div class="teacher-details">
          <div class="teacher-name">{{ username }}</div>
          <div class="teacher-id">工号: T20210001</div>
          <div class="teacher-dept">计算机系</div>
        </div>
      </div>
    </aside>
    
    <!-- 主内容区域 -->
    <div class="main-area">
      <!-- 顶部导航栏 -->
      <header class="header">
        <div class="header-left">
          <div class="breadcrumb-container">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>
                <el-icon><House /></el-icon>
                首页
              </el-breadcrumb-item>
              <el-breadcrumb-item>{{ getCurrentPageTitle() }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <!-- 快速操作按钮 -->
          <div class="quick-actions">
            <el-button type="primary" :icon="Plus" size="small">新建课程</el-button>
            <el-button type="success" :icon="Document" size="small">成绩录入</el-button>
            <el-button type="info" :icon="DataBoard" size="small">数据统计</el-button>
          </div>
        </div>
        
        <div class="header-right">
          <!-- 消息通知 -->
          <div class="header-action">
            <el-badge :value="8" class="notification-badge">
              <el-icon class="notification-icon" size="18">
                <Bell />
              </el-icon>
            </el-badge>
          </div>
          
          <!-- 用户下拉菜单 -->
          <el-dropdown @command="handleCommand" class="user-dropdown">
            <div class="user-info">
              <div class="user-avatar">
                <el-icon><Avatar /></el-icon>
              </div>
              <div class="user-details" v-show="!sidebarCollapsed">
                <span class="username">{{ username }}</span>
                <span class="user-role">任课教师</span>
              </div>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown-menu">
                <el-dropdown-item command="profile">
                  <el-icon><Avatar /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  教学设置
                </el-dropdown-item>
                <el-dropdown-item command="help">
                  <el-icon><QuestionFilled /></el-icon>
                  帮助支持
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <!-- 主内容区 -->
      <main class="main-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  DataBoard,
  Document,
  User,
  Avatar,
  ArrowDown,
  House,
  Plus,
  Bell,
  Setting,
  QuestionFilled,
  SwitchButton,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

const username = computed(() => authStore.user?.username || '')

const getCurrentPageTitle = () => {
  const routeMap: Record<string, string> = {
    '/teacher/dashboard': '教学仪表盘',
    '/teacher/courses': '课程管理',
    '/teacher/students': '学生管理',
    '/teacher/profile': '个人中心'
  }
  return routeMap[route.path] || '首页'
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
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
  } else if (command === 'settings') {
    console.log('教学设置')
  } else if (command === 'help') {
    console.log('帮助支持')
  }
}
</script>

<style scoped>
.layout-root {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

/* 侧边栏样式 - 教师专用配色 */
.sidebar {
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #059669 0%, #047857 50%, #065f46 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 2px 0 8px rgba(5, 150, 105, 0.2);
  z-index: 1000;
}

.sidebar-collapsed {
  width: 64px;
}

.logo {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.1);
}

.logo-icon {
  font-size: 32px;
  margin-right: 12px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.logo-text h2 {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
}

.logo-text p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin: 0;
  white-space: nowrap;
}

.sidebar-toggle {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: #059669;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.4);
  z-index: 1001;
}

.sidebar-toggle:hover {
  background: #047857;
  transform: translateY(-50%) scale(1.1);
}

.sidebar-menu {
  border: none;
  background: transparent;
  flex: 1;
  padding: 20px 0;
}

.sidebar-menu :deep(.el-menu-item) {
  position: relative;
  margin: 4px 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 48px;
  line-height: 48px;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  transform: translateX(4px);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(45deg, #dc2626, #ef4444);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.sidebar-menu :deep(.el-menu-item .el-icon) {
  margin-right: 12px;
  font-size: 18px;
  transition: all 0.3s ease;
}

.menu-title {
  font-weight: 500;
  font-size: 14px;
}

/* 教师信息卡片 */
.teacher-info-card {
  margin: 16px 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.teacher-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(45deg, #dc2626, #ef4444);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin: 0 auto 12px;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.teacher-details {
  text-align: center;
  color: white;
}

.teacher-name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.teacher-id {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2px;
}

.teacher-dept {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* 主内容区域 */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  overflow: hidden;
}

/* 顶部导航栏 */
.header {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 999;
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 24px;
}

.breadcrumb-container :deep(.el-breadcrumb) {
  font-size: 14px;
}

.breadcrumb-container :deep(.el-breadcrumb__item) {
  color: #64748b;
  display: flex;
  align-items: center;
}

.breadcrumb-container :deep(.el-breadcrumb__item:last-child) {
  color: #1e293b;
  font-weight: 500;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.quick-actions :deep(.el-button) {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 13px;
  padding: 8px 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-action {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.header-action:hover {
  background: #f1f5f9;
}

.notification-icon {
  color: #64748b;
  transition: color 0.3s ease;
}

.header-action:hover .notification-icon {
  color: #059669;
}

.notification-badge :deep(.el-badge__content) {
  background: #10b981;
  border: 2px solid #ffffff;
}

/* 用户下拉菜单 */
.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #f8fafc;
  border: 1px solid transparent;
}

.user-info:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(45deg, #059669, #10b981);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #64748b;
  line-height: 1.2;
}

.dropdown-icon {
  color: #94a3b8;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.user-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* 用户下拉菜单样式 */
.user-dropdown-menu :deep(.el-dropdown-menu__item) {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.user-dropdown-menu :deep(.el-dropdown-menu__item:hover) {
  background: #f8fafc;
  color: #059669;
}

/* 主内容区 */
.main-content {
  flex: 1;
  overflow: hidden;
  background: #f8fafc;
}

.content-wrapper {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  background: transparent;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -260px;
    z-index: 1000;
  }
  
  .sidebar.mobile-show {
    left: 0;
  }
  
  .main-area {
    margin-left: 0;
  }
  
  .header {
    padding: 0 16px;
  }
  
  .content-wrapper {
    padding: 16px;
  }
  
  .user-details {
    display: none;
  }
  
  .quick-actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .quick-actions :deep(.el-button) {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .teacher-info-card {
    display: none;
  }
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
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
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
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
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
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