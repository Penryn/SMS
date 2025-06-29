<template>
  <div class="courses-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>我的课程</span>
          <div class="filter-section">
            <el-select v-model="selectedYear" placeholder="选择学年" size="small" style="width:120px;margin-right:8px;" @change="loadCourses">
              <el-option label="全部" value="" />
              <el-option v-for="year in years" :key="year" :label="year" :value="year" />
            </el-select>
            <el-select v-model="selectedSemester" placeholder="选择学期" size="small" style="width:100px;" @change="loadCourses">
              <el-option label="全部" value="" />
              <el-option label="上学期" value="1" />
              <el-option label="下学期" value="2" />
            </el-select>
          </div>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="courses"
        style="width: 100%"
      >
        <el-table-column prop="course_name" label="课程名称" />
        <el-table-column prop="credits" label="学分" />
        <el-table-column prop="year" label="学年" />
        <el-table-column prop="semester" label="学期">
          <template #default="{ row }">
            {{ row.semester === 1 ? '上学期' : '下学期' }}
          </template>
        </el-table-column>
        <el-table-column prop="hours" label="课时" />
        <el-table-column prop="exam_type" label="考试类型">
          <template #default="{ row }">
            {{ row.exam_type === '1' ? '考试' : '考查' }}
          </template>
        </el-table-column>
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { teacherApi } from '../../api/teacher'
import type { Course } from '../../api/teacher'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const courses = ref<Course[]>([])
const selectedYear = ref('')
const selectedSemester = ref('')
const years = ref<number[]>([])

const loadCourses = async () => {
  loading.value = true
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    const response = await teacherApi.getCourse(
      teacherId, 
      selectedYear.value ? Number(selectedYear.value) : undefined,
      selectedSemester.value ? Number(selectedSemester.value) : undefined
    )
    
    if (response.code === 0 && Array.isArray(response.data.courses)) {
      courses.value = response.data.courses
      
      // 生成年份列表
      const yearSet = new Set<number>()
      response.data.courses.forEach((course: Course) => {
        if (course.year) yearSet.add(course.year)
      })
      years.value = Array.from(yearSet).sort((a, b) => b - a)
    }
  } catch (error) {
    ElMessage.error('加载课程列表失败')
  } finally {
    loading.value = false
  }
}

const viewStudents = (course: Course) => {
  router.push({
    path: '/teacher/students',
    query: { courseId: course.course_id.toString() }
  })
}

const manageScores = (course: Course) => {
  router.push({
    path: '/teacher/scores',
    query: { courseId: course.course_id.toString() }
  })
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

.filter-section {
  display: flex;
  align-items: center;
}
</style> 