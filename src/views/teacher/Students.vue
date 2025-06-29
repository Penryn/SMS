<template>
  <div class="students-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>学生管理</span>
          <div class="filter-section">
            <el-select v-model="selectedYear" placeholder="选择学年" size="small" style="width:120px;margin-right:8px;" @change="loadStudents">
              <el-option label="全部" value="" />
              <el-option v-for="year in years" :key="year" :label="year" :value="year" />
            </el-select>
            <el-select v-model="selectedSemester" placeholder="选择学期" size="small" style="width:100px;" @change="loadStudents">
              <el-option label="全部" value="" />
              <el-option label="上学期" value="1" />
              <el-option label="下学期" value="2" />
            </el-select>
          </div>
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
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="gpa" label="GPA" />
        <el-table-column prop="total_credits" label="已修学分" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewStudent(row)">查看详情</el-button>
            <el-button size="small" type="primary" @click="viewStudentScores(row)">查看成绩</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 学生详情对话框 -->
    <el-dialog
      v-model="studentDialogVisible"
      title="学生详细信息"
      width="600px"
    >
      <div v-if="selectedStudent" class="student-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ selectedStudent.name }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ selectedStudent.student_id }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ selectedStudent.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ selectedStudent.age }}</el-descriptions-item>
          <el-descriptions-item label="GPA">{{ selectedStudent.gpa }}</el-descriptions-item>
          <el-descriptions-item label="已修学分">{{ selectedStudent.total_credits }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { teacherApi } from '../../api/teacher'
import type { Student } from '../../api/teacher'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const students = ref<Student[]>([])
const selectedYear = ref('')
const selectedSemester = ref('')
const years = ref<number[]>([])
const studentDialogVisible = ref(false)
const selectedStudent = ref<Student | null>(null)

const loadStudents = async () => {
  loading.value = true
  try {
    const teacherId = authStore.user?.id
    const courseId = route.query.courseId ? Number(route.query.courseId) : undefined
    
    if (!teacherId || !courseId) {
      ElMessage.error('缺少必要参数')
      return
    }

    const response = await teacherApi.getCourseStudentList(
      teacherId,
      courseId,
      selectedYear.value ? Number(selectedYear.value) : undefined,
      selectedSemester.value ? Number(selectedSemester.value) : undefined
    )
    
    if (response.code === 0 && Array.isArray(response.data.students)) {
      students.value = response.data.students
      
      // 生成年份列表（这里可能需要从课程数据中获取）
      years.value = [2024, 2023, 2022]
    }
  } catch (error) {
    ElMessage.error('加载学生列表失败')
  } finally {
    loading.value = false
  }
}

const viewStudent = async (student: Student) => {
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    // 调用获取学生详细信息接口
    const response = await teacherApi.getStudent(teacherId, student.student_id)
    if (response.code === 0 && response.data.student) {
      selectedStudent.value = response.data.student
      studentDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取学生详情失败')
  }
}

const viewStudentScores = (student: Student) => {
  // 跳转到成绩管理页面，并传递学生ID
  router.push({
    path: '/teacher/scores',
    query: { 
      courseId: route.query.courseId,
      studentId: student.student_id 
    }
  })
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

.filter-section {
  display: flex;
  align-items: center;
}

.student-detail {
  padding: 20px 0;
}
</style> 