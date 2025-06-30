<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
      <div class="bg-gradient"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 头部logo -->
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-icon">🎓</div>
          <div class="logo-text">
            <h1>学生管理系统</h1>
            <p>Student Management System</p>
          </div>
        </div>
      </div>

      <!-- 登录表单 -->
      <div class="login-form-container">
        <div class="form-header">
          <h2>欢迎登录</h2>
          <p>请选择您的身份并填写登录信息</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <!-- 用户类型选择 -->
          <el-form-item prop="userType" class="user-type-item">
            <label class="form-label">选择身份</label>
            <div class="user-type-grid">
              <div 
                v-for="userType in userTypes" 
                :key="userType.value"
                class="user-type-card"
                :class="{ active: loginForm.userType === userType.value }"
                @click="loginForm.userType = userType.value"
              >
                <div class="user-type-icon" :style="{ background: userType.color }">
                  {{ userType.icon }}
                </div>
                <div class="user-type-info">
                  <div class="user-type-name">{{ userType.label }}</div>
                  <div class="user-type-desc">{{ userType.desc }}</div>
                </div>
              </div>
            </div>
          </el-form-item>

          <!-- 用户名输入 -->
          <el-form-item prop="username">
            <label class="form-label">用户名</label>
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
              class="login-input"
            />
          </el-form-item>

          <!-- 密码输入 -->
          <el-form-item prop="password">
            <label class="form-label">密码</label>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              class="login-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- 记住密码和忘记密码 -->
          <div class="form-options">
            <el-checkbox v-model="rememberPassword" class="remember-checkbox">
              记住密码
            </el-checkbox>
            <el-link type="primary" class="forgot-password">
              忘记密码？
            </el-link>
          </div>

          <!-- 登录按钮 -->
          <el-form-item class="login-button-item">
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="login-button"
              @click="handleLogin"
            >
              <span v-if="!loading">立即登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 页脚信息 -->
        <div class="login-footer">
          <p>© 2025 学生管理系统. 版权所有</p>
          <div class="footer-links">
            <el-link>使用条款</el-link>
            <el-divider direction="vertical" />
            <el-link>隐私政策</el-link>
            <el-divider direction="vertical" />
            <el-link>帮助中心</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref()
const loading = ref(false)
const rememberPassword = ref(false)

// 用户类型配置
const userTypes = [
  {
    value: 1,
    label: '学生',
    desc: '查看课程、成绩等信息',
    icon: '👨‍🎓',
    color: 'linear-gradient(45deg, #0ea5e9, #06b6d4)'
  },
  {
    value: 2,
    label: '教师',
    desc: '管理课程、录入成绩',
    icon: '👨‍🏫',
    color: 'linear-gradient(45deg, #059669, #10b981)'
  },
  {
    value: 3,
    label: '管理员',
    desc: '系统管理、数据统计',
    icon: '👨‍💼',
    color: 'linear-gradient(45deg, #667eea, #764ba2)'
  }
]

const loginForm = reactive({
  username: '',
  password: '',
  userType: 1 // 默认为学生
})

const loginRules = {
  userType: [
    { required: true, message: '请选择用户类型', trigger: 'change' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password,
      userType: loginForm.userType
    })

    ElMessage.success('登录成功！')
    
    // 根据用户类型跳转到对应页面
    const routes = {
      1: '/student/dashboard',  // 学生
      2: '/teacher/dashboard',  // 教师
      3: '/admin/dashboard'     // 管理员
    }
    
    router.push(routes[loginForm.userType] || '/student/dashboard')
    
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 25%,
    rgba(64, 158, 255, 0.1) 50%,
    rgba(118, 75, 162, 0.1) 75%,
    rgba(102, 126, 234, 0.1) 100%
  );
  animation: gradientShift 8s ease-in-out infinite;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  left: 15%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes gradientShift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* 登录卡片 */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头部logo */
.login-header {
  background: linear-gradient(45deg, #667eea, #764ba2);
  padding: 32px 40px;
  text-align: center;
  position: relative;
}

.login-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1));
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.logo-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.logo-text h1 {
  margin: 0;
  color: white;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.logo-text p {
  margin: 4px 0 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* 表单容器 */
.login-form-container {
  padding: 40px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h2 {
  margin: 0 0 8px 0;
  color: #1a202c;
  font-size: 24px;
  font-weight: 600;
}

.form-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

/* 表单样式 */
.login-form {
  margin-top: 32px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

/* 用户类型选择 */
.user-type-item {
  margin-bottom: 24px;
}

.user-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 8px;
}

.user-type-card {
  padding: 16px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  background: #f9fafb;
}

.user-type-card:hover {
  border-color: #667eea;
  background: #f0f4ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.user-type-card.active {
  border-color: #667eea;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.user-type-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  font-size: 18px;
  color: white;
  background: #e5e7eb;
}

.user-type-card.active .user-type-icon {
  background: rgba(255, 255, 255, 0.2);
}

.user-type-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-type-desc {
  font-size: 11px;
  opacity: 0.8;
  line-height: 1.3;
}

/* 输入框样式 */
.login-input {
  margin-bottom: 20px;
}

.login-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  box-shadow: none;
  transition: all 0.3s ease;
}

.login-input :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
}

.login-input :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
}

.remember-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
  color: #64748b;
}

.forgot-password {
  font-size: 14px;
  text-decoration: none;
}

/* 登录按钮 */
.login-button-item {
  margin-bottom: 0;
}

.login-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 页脚 */
.login-footer {
  margin-top: 32px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.login-footer p {
  margin: 0 0 12px 0;
  color: #9ca3af;
  font-size: 12px;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer-links .el-link {
  font-size: 12px;
  color: #64748b;
}

.footer-links .el-divider {
  margin: 0;
  height: 12px;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    max-width: 100%;
  }
  
  .login-header {
    padding: 24px 20px;
  }
  
  .logo-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .logo-icon {
    font-size: 40px;
  }
  
  .logo-text h1 {
    font-size: 24px;
  }
  
  .login-form-container {
    padding: 24px 20px;
  }
  
  .user-type-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .user-type-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    text-align: left;
  }
  
  .user-type-icon {
    margin: 0;
    flex-shrink: 0;
  }
  
  .user-type-info {
    flex: 1;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(30, 41, 59, 0.95);
    color: white;
  }
  
  .form-header h2 {
    color: white;
  }
  
  .form-label {
    color: #e2e8f0;
  }
  
  .user-type-card {
    background: #374151;
    border-color: #4b5563;
    color: #e5e7eb;
  }
  
  .login-footer p {
    color: #6b7280;
  }
}
</style> 