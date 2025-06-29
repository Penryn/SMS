<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="page-header">
          <div class="header-left">
            <el-icon class="header-icon"><User /></el-icon>
            <span class="header-title">个人信息</span>
          </div>
          <el-button type="primary" @click="saveProfile" :loading="loading" class="save-btn">
            <el-icon><Check /></el-icon>
            保存修改
          </el-button>
        </div>
      </template>
      
      <el-form
        v-loading="loading"
        :model="profile"
        label-width="120px"
        class="profile-form"
        :rules="rules"
        ref="formRef"
      >
        <div class="form-section">
          <div class="section-title">
            <el-icon><UserFilled /></el-icon>
            <span>基本信息</span>
          </div>
          <div class="form-grid">
            <el-form-item label="姓名" prop="name" class="form-item">
              <el-input v-model="profile.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="学号" class="form-item">
              <el-input v-model="profile.student_id" disabled class="disabled-input" />
            </el-form-item>
            <el-form-item label="性别" prop="gender" class="form-item">
              <el-select v-model="profile.gender" placeholder="请选择性别" class="full-width">
                <el-option label="男" value="M" />
                <el-option label="女" value="F" />
              </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age" class="form-item">
              <el-input-number v-model="profile.age" :min="16" :max="30" class="full-width" />
            </el-form-item>
          </div>
        </div>

        <div class="form-section">
          <div class="section-title">
            <el-icon><School /></el-icon>
            <span>学习信息</span>
          </div>
          <div class="form-grid">
            <el-form-item label="班级" class="form-item">
              <el-input v-model="profile.class_name" disabled class="disabled-input" />
            </el-form-item>
            <el-form-item label="生源地" class="form-item">
              <el-input v-model="profile.city_name" disabled class="disabled-input" />
            </el-form-item>
            <el-form-item label="GPA" class="form-item">
              <el-input v-model="profile.gpa" disabled class="disabled-input gpa-input" />
            </el-form-item>
            <el-form-item label="总学分" class="form-item">
              <el-input v-model="profile.total_credits" disabled class="disabled-input" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, UserFilled, School, Check } from '@element-plus/icons-vue'
import { studentApi } from '../../api/student'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const profile = reactive({
  id: 0,
  student_id: '',
  name: '',
  gender: '',
  age: 0,
  city_id: 0,
  city_name: '',
  class_id: 0,
  class_name: '',
  gpa: 0,
  total_credits: 0,
})

const formRef = ref()
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 16, max: 30, message: '年龄必须在 16 到 30 之间', trigger: 'blur' }
  ]
}

const loadProfile = async () => {
  loading.value = true
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const response = await studentApi.getStudent(studentId)
    if (response.code === 0 && response.data) {
      Object.assign(profile, response.data)
    }
  } catch (error) {
    ElMessage.error('加载个人信息失败')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      const updateData = {
        id: profile.id,
        name: profile.name,
        gender: profile.gender,
        age: profile.age,
        city_id: profile.city_id
      }
      await studentApi.updateStudent(updateData)
      ElMessage.success('保存成功')
      loadProfile()
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  })
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
  min-height: 100vh;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: none;
  background: #ffffff;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  color: #409EFF;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.save-btn {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.profile-form {
  padding: 20px 0;
}

.form-section {
  margin-bottom: 32px;
  background: #f8faff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e1f0ff;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
  padding-bottom: 12px;
  border-bottom: 2px solid #e1f0ff;
}

.section-title .el-icon {
  font-size: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-item {
  margin-bottom: 0;
}

.form-item :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.form-item :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.form-item :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.form-item :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.disabled-input :deep(.el-input__wrapper) {
  background: #f5f7fa;
  border-color: #e4e7ed;
}

.disabled-input :deep(.el-input__inner) {
  color: #909399;
}

.gpa-input :deep(.el-input__inner) {
  color: #67c23a;
  font-weight: 600;
}

.full-width {
  width: 100%;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-container {
    padding: 10px;
  }
  
  .form-section {
    padding: 16px;
  }
}
</style> 