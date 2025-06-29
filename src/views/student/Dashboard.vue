<template>
  <div class="dashboard">
    <el-card class="student-info-card styled-card">
      <div class="student-info-row">
        <el-icon class="info-icon" color="#409EFF"><User /></el-icon>
        <span>姓名：<b>{{ studentInfo.name }}</b></span>
        <span>学号：<b>{{ studentInfo.student_id }}</b></span>
        <span>性别：<b>{{ studentInfo.gender === 'M' ? '男' : studentInfo.gender === 'F' ? '女' : studentInfo.gender }}</b></span>
        <span>班级：<b>{{ studentInfo.class_name }}</b></span>
        <span>生源地：<b>{{ studentInfo.city_name }}</b></span>
        <span>年龄：<b>{{ studentInfo.age }}</b></span>
      </div>
    </el-card>
    <el-row :gutter="32" style="width: 100%; margin-bottom: 32px;">
      <el-col :span="12">
        <el-card class="stat-card styled-card">
          <div class="stat-content stat-center">
            <div class="stat-icon course-icon">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number big-number">{{ myCourses.length }}</div>
              <div class="stat-label">在学课程</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="stat-card styled-card">
          <div class="stat-content stat-center">
            <div class="stat-icon gpa-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number big-number">{{ stats.gpa }}</div>
              <div class="stat-label">GPA</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="margin: 16px 0 32px 0; text-align: right;">
      <el-button size="small" icon="el-icon-Refresh" @click="loadDashboardData" :loading="loading">刷新</el-button>
    </div>
    <el-row :gutter="32" style="margin-top: 0; width: 100%">
      <el-col :span="12">
        <el-card class="styled-card">
          <template #header>
            <div class="card-header"><el-icon style="vertical-align: middle;"><Reading /></el-icon> <span style="margin-left: 6px; font-weight: bold;">我的课程</span></div>
          </template>
          <el-table :data="myCourses" style="width: 100%" v-loading="loading" class="styled-table">
            <el-table-column prop="course_name" label="课程名称" header-align="center" align="center" />
            <el-table-column prop="credits" label="学分" header-align="center" align="center" />
            <template #empty>
              <div style="text-align:center;color:#999;">暂无在学课程</div>
            </template>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="styled-card">
          <template #header>
            <div class="card-header"><el-icon style="vertical-align: middle;"><TrendCharts /></el-icon> <span style="margin-left: 6px; font-weight: bold;">最近成绩</span></div>
          </template>
          <el-table :data="recentScores" style="width: 100%" v-loading="loading" class="styled-table">
            <el-table-column prop="course_name" label="课程名称" header-align="center" align="center" />
            <el-table-column prop="credits" label="学分" header-align="center" align="center" />
            <el-table-column prop="score" label="成绩" header-align="center" align="center" />
            <template #empty>
              <div style="text-align:center;color:#999;">暂无成绩数据</div>
            </template>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="courseDetailVisible" title="课程详情" width="400px">
      <div v-if="courseDetail">
        <div>课程名称：{{ courseDetail.name }}</div>
        <div>授课教师：{{ courseDetail.teacher }}</div>
        <div>学分：{{ courseDetail.credits }}</div>
        <div>学期：{{ courseDetail.semester }}</div>
      </div>
    </el-dialog>
    <el-dialog v-model="scoreDetailVisible" title="成绩详情" width="400px">
      <div v-if="scoreDetail">
        <div>课程名称：{{ scoreDetail.course_name }}</div>
        <div>成绩：{{ scoreDetail.score }}</div>
        <div>学期：{{ scoreDetail.semester }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Reading, TrendCharts, User } from '@element-plus/icons-vue'
import { studentApi } from '../../api/student'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const stats = ref({
  gpa: 0
})
const studentInfo = ref({
  name: '',
  student_id: '',
  gender: '',
  class_name: '',
  city_name: '',
  age: ''
})
const loading = ref(false)
const myCourses = ref<any[]>([])
const recentScores = ref<any[]>([])
const courseDetailVisible = ref(false)
const courseDetail = ref<any>(null)
const scoreDetailVisible = ref(false)
const scoreDetail = ref<any>(null)

const loadDashboardData = async () => {
  loading.value = true
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    // 获取学生信息
    const studentInfoResp = await studentApi.getStudent(studentId)
    const studentData = studentInfoResp.data as any
    if (studentInfoResp.code === 0 && studentData) {
      Object.assign(studentInfo.value, studentData)
      stats.value.gpa = studentData.gpa || 0
    }
    // 获取成绩
    const scoresResp = await studentApi.getScore(studentId)
    if (scoresResp.code === 200 && Array.isArray(scoresResp.data.scores)) {
      // 新结构：每个score对象包含course_id, course_name, school_year, semester, hours, exam_type, teachers, score, credits, retake_required
      const allScores = scoresResp.data.scores
      myCourses.value = allScores.filter(s => s.score === null || s.score === undefined)
      recentScores.value = allScores.filter(s => typeof s.score === 'number')
    } else {
      myCourses.value = []
      recentScores.value = []
    }
  } catch (error) {
    ElMessage.error('加载仪表盘数据失败')
  } finally {
    loading.value = false
  }
}

const viewCourseDetail = (row: any) => {
  courseDetail.value = row
  courseDetailVisible.value = true
}
const viewScoreDetail = (row: any) => {
  scoreDetail.value = row
  scoreDetailVisible.value = true
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  background: #f7f9fb;
}
.styled-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(64,158,255,0.07), 0 1.5px 6px 0 rgba(0,0,0,0.03);
  border: none;
}
.student-info-card {
  background: linear-gradient(90deg, #e0eaff 0%, #f8faff 100%);
  margin-bottom: 32px;
}
.student-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  font-size: 16px;
  color: #333;
  align-items: center;
  padding: 8px 0 2px 0;
}
.info-icon {
  font-size: 22px;
  margin-right: 10px;
}
.stat-card {
  margin-bottom: 0;
  background: linear-gradient(135deg, #e3f0ff 0%, #f8faff 100%);
  border: none;
}
.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}
.stat-center {
  justify-content: center;
}
.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
  font-size: 28px;
  color: white;
  box-shadow: 0 2px 8px 0 rgba(64,158,255,0.13);
}
.course-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.gpa-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
.stat-info {
  flex: 1;
  text-align: left;
}
.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  line-height: 1;
}
.big-number {
  font-size: 38px;
  color: #409EFF;
  font-weight: 700;
}
.stat-label {
  font-size: 15px;
  color: #666;
  margin-top: 5px;
}
.card-header {
  font-weight: bold;
  color: #333;
  font-size: 17px;
  letter-spacing: 1px;
  padding: 2px 0 2px 0;
}
.styled-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(64,158,255,0.06);
}
.styled-table :deep(.el-table__header th) {
  background: #f4f8ff;
  font-weight: bold;
  font-size: 15px;
  color: #333;
}
.styled-table :deep(.el-table__row) {
  transition: background 0.2s;
}
.styled-table :deep(.el-table__row:hover) {
  background: #eaf4ff;
}
</style> 