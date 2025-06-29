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
        <el-form-item label="学号">
          <el-input v-model="profile.student_id" disabled />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="profile.gender" disabled />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="profile.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profile.email" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="profile.address" type="textarea" />
        </el-form-item>
        <el-form-item label="GPA">
          <el-input v-model="profile.gpa" disabled />
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
import { studentApi } from '../../api/student'

const loading = ref(false)
const profile = reactive({
  name: '',
  student_id: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  gpa: 0
})

const loadProfile = async () => {
  loading.value = true
  try {
    const response = await studentApi.getInfo()
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
    await studentApi.updateInfo(profile)
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