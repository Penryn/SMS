<template>
  <div class="dashboard">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon course-icon">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.courseCount }}</div>
              <div class="stat-label">已选课程</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon score-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.avgScore }}</div>
              <div class="stat-label">平均成绩</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon gpa-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.gpa }}</div>
              <div class="stat-label">GPA</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px; width: 100%">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>我的课程</span>
            </div>
          </template>
          <el-table :data="myCourses" style="width: 100%">
            <el-table-column prop="name" label="课程名称" />
            <el-table-column prop="teacher" label="授课教师" />
            <el-table-column prop="credits" label="学分" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近成绩</span>
            </div>
          </template>
          <el-table :data="recentScores" style="width: 100%">
            <el-table-column prop="course_name" label="课程" />
            <el-table-column prop="score" label="成绩" />
            <el-table-column prop="semester" label="学期" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Reading, Document, TrendCharts } from '@element-plus/icons-vue'
import { studentApi } from '../../api/student'

const stats = ref({
  courseCount: 0,
  avgScore: 0,
  gpa: 0
})

const myCourses = ref([])
const recentScores = ref([])

const loadDashboardData = async () => {
  try {
    // 加载学生信息
    const studentInfo = await studentApi.getInfo()
    if (studentInfo.code === 200) {
      stats.value.gpa = studentInfo.data.gpa || 0
    }
    
    // 加载课程信息
    const coursesResponse = await studentApi.getClassCourses()
    if (coursesResponse.code === 200) {
      stats.value.courseCount = coursesResponse.data.length
      myCourses.value = coursesResponse.data.slice(0, 5) // 只显示前5门课程
    }
    
    // 加载成绩信息
    const scoresResponse = await studentApi.getScores()
    if (scoresResponse.code === 200) {
      const scores = scoresResponse.data
      if (scores.length > 0) {
        const totalScore = scores.reduce((sum: number, score: any) => sum + score.score, 0)
        stats.value.avgScore = (totalScore / scores.length).toFixed(1)
        recentScores.value = scores.slice(0, 5) // 只显示最近5个成绩
      }
    }
  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
  }
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
}
.stat-card {
  margin-bottom: 20px;
}
.stat-content {
  display: flex;
  align-items: center;
}
.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}
.course-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.score-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
.gpa-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
.stat-info {
  flex: 1;
}
.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  line-height: 1;
}
.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}
.card-header {
  font-weight: bold;
  color: #333;
}
</style> 