<template>
  <el-card>
    <template #header>
      <div class="page-header">
        <span>我的课程</span>
        <div class="header-actions">
          <el-select v-model="selectedYear" placeholder="选择学年" size="small" style="width:120px;margin-right:8px;" @change="loadCourses">
            <el-option v-for="year in years" :key="year" :label="year" :value="year" />
          </el-select>
          <el-select v-model="selectedSemester" :placeholder="selectedSemester === '' ? '全部' : '选择学期'" size="small" style="width:100px;margin-right:8px;" @change="loadCourses">
            <el-option label="全部" value="" />
            <el-option label="上学期" value="1" />
            <el-option label="下学期" value="2" />
          </el-select>
          <el-button type="primary" size="small" @click="openSelectCourseDialog">选课</el-button>
        </div>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="filteredCourses"
      style="width: 100%"
    >
      <el-table-column prop="course_name" label="课程名称" />
      <el-table-column prop="credits" label="学分" />
      <el-table-column prop="school_year" label="学年" />
      <el-table-column prop="semester" label="学期" />
      <el-table-column prop="hours" label="课时" />
      <el-table-column prop="exam_type" label="考试类型" />
      <el-table-column label="授课教师">
        <template #default="{ row }">
          <span>{{ row.teachers && row.teachers.length ? row.teachers.map((t: any) => t.teacher_name).join('，') : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retake_required" label="需重修">
        <template #default="{ row }">
          {{ row.retake_required ? '是' : '否' }}
        </template>
      </el-table-column>
      <template #empty>
        <div style="text-align:center;color:#999;">暂无课程数据</div>
      </template>
    </el-table>
    <el-dialog v-model="selectCourseDialogVisible" title="可选课程" width="600px">
      <div class="dialog-header">
        <el-select v-model="selectedOptionalYear" placeholder="选择学年" size="small" style="width:120px;margin-right:8px;margin-bottom:16px;" @change="loadOptionalCourses">
          <el-option v-for="year in years" :key="year" :label="year" :value="year" />
        </el-select>
        <el-select v-model="selectedOptionalSemester" placeholder="选择学期" size="small" style="width:120px;margin-bottom:16px;" @change="loadOptionalCourses">
          <el-option label="上学期" value="1" />
          <el-option label="下学期" value="2" />
        </el-select>
      </div>
      <el-table :data="optionalCourses" v-loading="loadingOptional">
        <el-table-column prop="course_name" label="课程名称" />
        <el-table-column prop="credits" label="学分" />
        <el-table-column prop="hours" label="课时" />
        <el-table-column prop="exam_type" label="考试类型" />
        <el-table-column label="授课教师">
          <template #default="{ row }">
            <span>{{ row.teachers && row.teachers.length ? row.teachers.map((t: any) => t.teacher_name).join('，') : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="selectCourse(row)">选课</el-button>
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { studentApi } from '../../api/student'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const courses = ref<any[]>([])
const selectCourseDialogVisible = ref(false)
const optionalCourses = ref<any[]>([])
const loadingOptional = ref(false)
const courseDetailVisible = ref(false)
const courseDetail = ref<any>(null)
const years = ref<number[]>([])
const selectedYear = ref<number>(new Date().getFullYear())
const selectedSemester = ref<string>('')
const selectedOptionalYear = ref<number>(new Date().getFullYear())
const selectedOptionalSemester = ref<string>('1')

const getYearOptions = () => {
  const thisYear = new Date().getFullYear()
  const minYear = 2020
  const arr = []
  for (let y = thisYear; y >= minYear; y--) arr.push(y)
  return arr
}

const filteredCourses = computed(() => {
  let list = courses.value
  if (selectedYear.value) {
    list = list.filter((s: any) => s.school_year === selectedYear.value)
  }
  if (selectedSemester.value) {
    list = list.filter((s: any) => s.semester === selectedSemester.value)
  }
  return list
})

const loadCourses = async () => {
  loading.value = true
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const scoresResp = await studentApi.getScore(studentId, selectedYear.value)
    if (scoresResp.code === 0 && Array.isArray(scoresResp.data.scores)) {
      courses.value = scoresResp.data.scores
    } else {
      courses.value = []
    }
  } catch (error) {
    ElMessage.error('加载课程列表失败')
  } finally {
    loading.value = false
  }
}

const loadOptionalCourses = async () => {
  loadingOptional.value = true
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const studentInfoResp = await studentApi.getStudent(studentId)
    if (studentInfoResp.code === 0 && studentInfoResp.data) {
      const classId = studentInfoResp.data.class_id
      const year = selectedOptionalYear.value
      const semester = parseInt(selectedOptionalSemester.value)
      // 获取班级课程列表，传递学生ID获取可选课程
      const res = await studentApi.getClassCourse(classId, year, semester, studentId)
      if (res.code === 0 && Array.isArray(res.data.courses)) {
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

const openSelectCourseDialog = async () => {
  selectCourseDialogVisible.value = true
  selectedOptionalYear.value = new Date().getFullYear()
  selectedOptionalSemester.value = '1' // 默认选择上学期
  await loadOptionalCourses()
}

const selectCourse = async (row: any) => {
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const res = await studentApi.selectCourse({ student_id: studentId, course_id: row.course_id })
    if (res.code === 0) {
      ElMessage.success('选课成功')
      selectCourseDialogVisible.value = false
      loadCourses()
    } else {
      ElMessage.error(res.msg || '选课失败')
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
  years.value = getYearOptions()
  loadCourses()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}
</style> 