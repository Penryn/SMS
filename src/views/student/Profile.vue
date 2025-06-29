<template>
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
      :rules="rules"
      ref="formRef"
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
      <el-form-item label="电话" prop="phone">
        <el-input v-model="profile.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { studentApi } from '../../api/student'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const profile = reactive({
  id: '',
  name: '',
  student_id: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  gpa: 0,
  city_id: '',
  age: '',
})
const formRef = ref()
const rules = {
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '电话格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

const loadProfile = async () => {
  loading.value = true
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const response = await studentApi.getStudent(studentId)
    if (response.code === 200 && response.data?.student) {
      Object.assign(profile, response.data.student)
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
      await studentApi.updateStudent(profile)
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
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 