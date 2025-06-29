<template>
  <div class="profile-page">
    <el-card class="profile-card">
      <template #header>
        <div class="page-header">
          <div class="header-content">
            <el-icon class="header-icon"><User /></el-icon>
            <span class="header-title">个人信息</span>
          </div>
        </div>
      </template>
      
      <div class="profile-content">
        <div class="avatar-section">
          <div class="avatar">
            <el-icon><User /></el-icon>
          </div>
          <div class="basic-info">
            <div class="name-section">
              <h3 class="teacher-name">{{ profile.name }}</h3>
              <el-tag v-if="profile.is_admin" type="danger" size="small" class="admin-badge">
                <el-icon><Star /></el-icon>
                管理员
              </el-tag>
            </div>
            <p class="teacher-title">{{ profile.title }}</p>
          </div>
        </div>
        
        <el-divider />
        
        <el-form
          v-loading="loading"
          :model="profile"
          label-width="100px"
          class="profile-form"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工号">
                <el-input v-model="profile.teacher_id" disabled class="info-input" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别">
                <el-input :value="profile.gender === 'M' ? '男' : profile.gender === 'F' ? '女' : profile.gender" disabled class="info-input" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="年龄">
                <el-input v-model="profile.age" disabled class="info-input" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话">
                <el-input v-model="profile.phone" disabled class="info-input" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Star } from '@element-plus/icons-vue'
import { teacherApi } from '../../api/teacher'
import type { Teacher } from '../../api/teacher'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)

const profile = reactive<Teacher>({
  id: 0,
  teacher_id: '',
  name: '',
  gender: '',
  age: 0,
  title: '',
  phone: '',
  is_admin: false
})

const loadProfile = async () => {
  loading.value = true
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    const response = await teacherApi.getTeacher(teacherId)
    if (response.code === 0 && response.data) {
      Object.assign(profile, response.data)
    }
  } catch (error) {
    ElMessage.error('加载个人信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  padding: 20px;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-card {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.profile-content {
  padding: 20px;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.basic-info {
  flex: 1;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}

.teacher-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.teacher-title {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #606266;
}

.profile-form {
  margin-top: 20px;
}

.info-input {
  width: 100%;
}
</style> 