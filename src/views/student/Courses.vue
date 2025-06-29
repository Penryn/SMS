<template>
  <el-card>
    <template #header>
      <div class="page-header">
        <span>我的课程</span>
        <el-button type="primary" size="small" @click="openSelectCourseDialog">选课</el-button>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="courses"
      style="width: 100%"
    >
      <el-table-column prop="name" label="课程名称">
        <template #default="{ row }">
          <el-link @click="viewCourseDetail(row)">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="课程代码" />
      <el-table-column prop="credits" label="学分" />
      <el-table-column prop="teacher" label="授课教师" />
      <el-table-column prop="semester" label="学期" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="viewCourseDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div style="text-align:center;color:#999;">暂无课程数据</div>
      </template>
    </el-table>
    <el-dialog v-model="selectCourseDialogVisible" title="可选课程" width="600px">
      <el-table :data="optionalCourses" v-loading="loadingOptional">
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="teacher" label="授课教师" />
        <el-table-column prop="credits" label="学分" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="selectCourse(row)">选课</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div style="text-align:center;color:#999;">暂无可选课程</div>
        </template>
      </el-table>
    </el-dialog>
    <el-dialog v-model="courseDetailVisible" title="课程详情" width="400px">
      <div v-if="courseDetail">
        <div>课程名称：{{ courseDetail.name }}</div>
        <div>课程代码：{{ courseDetail.code }}</div>
        <div>授课教师：{{ courseDetail.teacher }}</div>
        <div>学分：{{ courseDetail.credits }}</div>
        <div>学期：{{ courseDetail.semester }}</div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { studentApi } from '../../api/student'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const courses = ref([])
const selectCourseDialogVisible = ref(false)
const optionalCourses = ref([])
const loadingOptional = ref(false)
const courseDetailVisible = ref(false)
const courseDetail = ref<any>(null)

const loadCourses = async () => {
  loading.value = true
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const studentInfoResp = await studentApi.getStudent(studentId)
    if (studentInfoResp.code === 200 && studentInfoResp.data?.student) {
      const classId = studentInfoResp.data.student.class_id
      const student_id_str = studentInfoResp.data.student.student_id
      const response = await studentApi.getClassCourse(classId, student_id_str)
      if (response.code === 200 && Array.isArray(response.data.courses)) {
        courses.value = response.data.courses
      } else {
        courses.value = []
      }
    }
  } catch (error) {
    ElMessage.error('加载课程列表失败')
  } finally {
    loading.value = false
  }
}

const openSelectCourseDialog = async () => {
  selectCourseDialogVisible.value = true
  loadingOptional.value = true
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const studentInfoResp = await studentApi.getStudent(studentId)
    if (studentInfoResp.code === 200 && studentInfoResp.data?.student) {
      const classId = studentInfoResp.data.student.class_id
      const student_id_str = studentInfoResp.data.student.student_id
      // 获取可选课程（假设API有此参数，实际可根据后端调整）
      const res = await studentApi.getClassCourse(classId, student_id_str)
      if (res.code === 200 && Array.isArray(res.data.courses)) {
        optionalCourses.value = res.data.courses
      } else {
        optionalCourses.value = []
      }
    }
  } catch (e) {
    ElMessage.error('加载可选课程失败')
  } finally {
    loadingOptional.value = false
  }
}

const selectCourse = async (row: any) => {
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const studentInfoResp = await studentApi.getStudent(studentId)
    if (studentInfoResp.code === 200 && studentInfoResp.data?.student) {
      const student_id_str = studentInfoResp.data.student.student_id
      const res = await studentApi.selectCourse({ student_id: student_id_str, course_id: row.course_id })
      if (res.code === 200) {
        ElMessage.success('选课成功')
        selectCourseDialogVisible.value = false
        loadCourses()
      } else {
        ElMessage.error(res.msg || '选课失败')
      }
    }
  } catch (e) {
    ElMessage.error('选课失败')
  }
}

const viewCourseDetail = (row: any) => {
  courseDetail.value = row
  courseDetailVisible.value = true
}

onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 