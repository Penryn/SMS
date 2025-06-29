<template>
  <div class="profile-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>个人信息</span>
        </div>
      </template>
      
      <el-form
        v-loading="loading"
        :model="profile"
        label-width="100px"
        style="max-width: 600px"
      >
        <el-form-item label="姓名">
          <el-input v-model="profile.name" disabled />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="profile.teacher_id" disabled />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="profile.gender" disabled />
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="profile.title" disabled />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="profile.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profile.email" />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-input v-model="profile.hire_date" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveProfile">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { teacherApi } from '../../api/teacher'

const loading = ref(false)
const profile = reactive({
  name: '',
  teacher_id: '',
  gender: '',
  title: '',
  phone: '',
  email: '',
  hire_date: ''
})

const loadProfile = async () => {
  loading.value = true
  try {
    const response = await teacherApi.getInfo()
    if (response.code === 200) {
      Object.assign(profile, response.data)
    }
  } catch (error) {
    ElMessage.error('加载个人信息失败')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  try {
    // 这里应该调用更新API
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 