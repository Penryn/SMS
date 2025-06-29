<template>
  <div class="students-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>学生管理</span>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="students"
        style="width: 100%"
      >
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="student_id" label="学号" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="viewStudent(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { teacherApi } from '../../api/teacher'

const loading = ref(false)
const students = ref([])

const loadStudents = async () => {
  loading.value = true
  try {
    // 这里需要传入course_id，暂时使用1
    const response = await teacherApi.getCourseStudents(1)
    if (response.code === 200) {
      students.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载学生列表失败')
  } finally {
    loading.value = false
  }
}

const viewStudent = (student: any) => {
  console.log('查看学生详情:', student)
}

onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
.students-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 