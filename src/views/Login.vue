<template>
  <div class="login-bg">
    <div class="bg-decor"></div>
    <div class="login-center-card">
      <div class="login-title"><span class="logo-icon">🎓</span>学生管理系统</div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="userType">
          <el-select
            v-model="loginForm.userType"
            placeholder="选择用户类型"
            size="large"
            class="user-type-select"
            popper-class="user-type-dropdown"
          >
            <el-option label="学生" :value="1" />
            <el-option label="教师" :value="2" />
            <el-option label="管理员" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
            class="login-input"
          />
        </el-form-item>
        <el-form-item prop="password">
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
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
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
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    console.log('开始登录，参数:', {
      username: loginForm.username,
      password: loginForm.password,
      userType: loginForm.userType
    })
    
    const result = await authStore.login(loginForm.username, loginForm.password, loginForm.userType)
    
    console.log('登录结果:', result)
    
    if (result.success) {
      ElMessage.success('登录成功')
      
      // 根据用户角色跳转到对应的首页
      let targetRoute = ''
      
      if (authStore.hasRole('admin')) {
        targetRoute = '/admin/dashboard'
      } else if (authStore.hasRole('student')) {
        targetRoute = '/student/dashboard'
      } else if (authStore.hasRole('teacher')) {
        targetRoute = '/teacher/dashboard'
      }
      
      console.log('准备跳转到:', targetRoute)
      
      if (targetRoute) {
        try {
          await router.push(targetRoute)
          console.log('路由跳转成功')
        } catch (routerError) {
          console.error('路由跳转失败:', routerError)
          ElMessage.error('页面跳转失败，请刷新页面重试')
        }
      } else {
        console.error('未找到匹配的用户角色')
        ElMessage.error('用户角色识别失败')
      }
    } else {
      // 显示具体的错误信息
      const errorMessage = result.message || '登录失败，请检查用户名和密码'
      console.log('准备显示错误信息:', errorMessage)
      ElMessage.error(errorMessage)
      console.error('登录失败:', errorMessage)
    }
  } catch (error: any) {
    console.error('登录异常:', error)
    
    // 根据错误类型显示不同的错误信息
    let errorMessage = '登录失败，请检查输入信息'
    
    if (error.message) {
      if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
        errorMessage = '网络连接失败，请检查网络设置或联系管理员'
      } else if (error.message.includes('timeout')) {
        errorMessage = '请求超时，请稍后重试'
      } else if (error.message.includes('CORS')) {
        errorMessage = '服务器连接异常，请联系管理员'
      } else {
        errorMessage = error.message
      }
    }
    
    console.log('准备显示异常错误信息:', errorMessage)
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(120deg, #f3f0ff 0%, #e9e4f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
}

.bg-decor {
  position: absolute;
  left: 0; top: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 1;
  background: none;
}
.bg-decor::before, .bg-decor::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.18;
}
.bg-decor::before {
  width: 420px; height: 420px;
  left: -120px; top: -120px;
  background: radial-gradient(circle, #a18cd1 0%, #fbc2eb 100%);
}
.bg-decor::after {
  width: 320px; height: 320px;
  right: -80px; bottom: -80px;
  background: radial-gradient(circle, #fad0c4 0%, #ffd1ff 100%);
}

.login-center-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(80, 80, 120, 0.13);
  padding: 40px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.7s;
  z-index: 10;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-title {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  letter-spacing: 2px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-icon {
  font-size: 30px;
  margin-right: 4px;
}

.login-form {
  width: 100%;
}

.user-type-select {
  width: 100%;
}

.user-type-select :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1.5px solid #e4e7ed;
  transition: all 0.3s;
}

.user-type-select :deep(.el-input__wrapper:hover) {
  border-color: #a18cd1;
}

.user-type-select :deep(.el-input__wrapper.is-focus) {
  border-color: #a18cd1;
  box-shadow: 0 0 0 2px rgba(161, 140, 209, 0.08);
}

:global(.user-type-dropdown) {
  z-index: 3000 !important;
}

.login-input {
  width: 100%;
}

.login-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1.5px solid #e4e7ed;
  transition: all 0.3s;
}

.login-input :deep(.el-input__wrapper:hover) {
  border-color: #a18cd1;
}

.login-input :deep(.el-input__wrapper.is-focus) {
  border-color: #a18cd1;
  box-shadow: 0 0 0 2px rgba(161, 140, 209, 0.08);
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
  border: none;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(161, 140, 209, 0.08);
}

.login-button:hover {
  box-shadow: 0 6px 18px rgba(161, 140, 209, 0.18);
  transform: translateY(-2px) scale(1.03);
}

.login-button.is-loading {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
}

@media (max-width: 480px) {
  .login-center-card {
    max-width: 95vw;
    padding: 24px 8px 16px 8px;
  }
  .login-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
}
</style> 