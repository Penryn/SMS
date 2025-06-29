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
            <el-select v-model="selectedSemester" :placeholder="selectedSemester === '' ? '全部' : '选择学期'" size="small" style="width:100px;" @change="loadCourses">
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
        <el-table-column prop="class_name" label="班级" />
        <el-table-column prop="credits" label="学分" />
        <el-table-column prop="school_year" label="学年" />
        <el-table-column prop="semester" label="学期">
          <template #default="{ row }">
            {{ row.semester === 1 ? '上学期' : '下学期' }}
          </template>
        </el-table-column>
        <el-table-column prop="hours" label="课时" />
        <el-table-column prop="exam_type" label="考试类型" />
        <el-table-column label="任课教师">
          <template #default="{ row }">
            {{ teacherNames(row.teachers) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewStudents(row)">查看学生</el-button>
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
const currentYear = new Date().getFullYear()
const years = ref<number[]>([])
const selectedYear = ref(String(currentYear))
const selectedSemester = ref('')

// 初始化学年列表 2020~今年
for (let y = currentYear; y >= 2020; y--) {
  years.value.push(y)
}

const loadCourses = async () => {
  loading.value = true
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    const year = selectedYear.value ? Number(selectedYear.value) : currentYear
    let allCourses: Course[] = []
    if (!selectedSemester.value) {
      // 学期为全部，分别请求上学期和下学期
      const [res1, res2] = await Promise.all([
        teacherApi.getCourse(teacherId, year, 1),
        teacherApi.getCourse(teacherId, year, 2)
      ])
      if (res1.code === 0 && Array.isArray(res1.data.courses)) {
        allCourses = allCourses.concat(res1.data.courses)
      }
      if (res2.code === 0 && Array.isArray(res2.data.courses)) {
        allCourses = allCourses.concat(res2.data.courses)
      }
    } else {
      // 只请求选中的学期
      const res = await teacherApi.getCourse(teacherId, year, Number(selectedSemester.value))
      if (res.code === 0 && Array.isArray(res.data.courses)) {
        allCourses = res.data.courses
      }
    }
    courses.value = allCourses
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

function teacherNames(teachers: Array<{ teacher_name: string }>) {
  return teachers && teachers.length ? teachers.map(t => t.teacher_name).join('，') : '-';
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