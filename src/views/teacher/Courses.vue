<template>
  <div class="courses-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>我的课程</span>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="courses"
        style="width: 100%"
      >
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="code" label="课程代码" />
        <el-table-column prop="credits" label="学分" />
        <el-table-column prop="description" label="课程描述" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewStudents(row)">查看学生</el-button>
            <el-button size="small" type="primary" @click="manageScores(row)">成绩管理</el-button>
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
const courses = ref([])

const loadCourses = async () => {
  loading.value = true
  try {
    const response = await teacherApi.getCourses()
    if (response.code === 200) {
      courses.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载课程列表失败')
  } finally {
    loading.value = false
  }
}

const viewStudents = (course: any) => {
  console.log('查看学生:', course)
}

const manageScores = (course: any) => {
  console.log('成绩管理:', course)
}

onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.courses-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 