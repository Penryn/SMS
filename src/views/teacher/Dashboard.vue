<template>
  <div class="page-root">
    <div class="teacher-dashboard">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon course-icon">
                <el-icon><Reading /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.courseCount }}</div>
                <div class="stat-label">授课课程</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon student-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.studentCount }}</div>
                <div class="stat-label">学生总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
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
        
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon class-icon">
                <el-icon><School /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.classCount }}</div>
                <div class="stat-label">授课班级</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>我的课程</span>
                <el-button size="small" type="primary" @click="viewAllCourses">查看全部</el-button>
              </div>
            </template>
            <el-table :data="myCourses" style="width: 100%">
              <el-table-column prop="course_name" label="课程名称" />
              <el-table-column prop="credits" label="学分" />
              <el-table-column prop="hours" label="课时" />
              <el-table-column prop="exam_type" label="考试类型">
                <template #default="{ row }">
                  {{ row.exam_type === '1' ? '考试' : '考查' }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>课程成绩统计</span>
              </div>
            </template>
            <el-table :data="courseStats" style="width: 100%">
              <el-table-column prop="course_name" label="课程" />
              <el-table-column prop="avg_score" label="平均分" />
              <el-table-column prop="class_name" label="班级" />
              <el-table-column prop="school_year" label="学年" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>快速操作</span>
              </div>
            </template>
            <div class="quick-actions">
              <el-button type="primary" @click="goToCourses">
                <el-icon><Reading /></el-icon>
                管理课程
              </el-button>
              <el-button type="success" @click="goToStudents">
                <el-icon><User /></el-icon>
                查看学生
              </el-button>
              <el-button type="warning" @click="goToScores">
                <el-icon><Document /></el-icon>
                成绩管理
              </el-button>
              <el-button type="info" @click="goToProfile">
                <el-icon><Avatar /></el-icon>
                个人信息
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Reading, User, Document, School, Avatar } from '@element-plus/icons-vue'
import { teacherApi } from '../../api/teacher'
import type { Course, CourseAvgScore } from '../../api/teacher'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  courseCount: 0,
  studentCount: 0,
  avgScore: '0',
  classCount: 0
})

const myCourses = ref<Course[]>([])
const courseStats = ref<CourseAvgScore[]>([])

const loadDashboardData = async () => {
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    // 加载教师课程
    const coursesResponse = await teacherApi.getCourse(teacherId)
    if (coursesResponse.code === 0 && Array.isArray(coursesResponse.data.courses)) {
      stats.value.courseCount = coursesResponse.data.courses.length
      myCourses.value = coursesResponse.data.courses.slice(0, 5) // 只显示前5门课程
    }
    
    // 加载课程平均成绩
    const avgScoreResponse = await teacherApi.getCourseAvgScore(teacherId)
    if (avgScoreResponse.code === 0 && Array.isArray(avgScoreResponse.data.avg_scores)) {
      const avgScores = avgScoreResponse.data.avg_scores
      if (avgScores.length > 0) {
        const totalAvg = avgScores.reduce((sum: number, item: any) => sum + item.avg_score, 0)
        stats.value.avgScore = (totalAvg / avgScores.length).toFixed(1)
        courseStats.value = avgScores.slice(0, 5) // 只显示前5门课程的统计
      }
    }
    
    // 模拟其他数据
    stats.value.studentCount = 120
    stats.value.classCount = 8
  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
  }
}

const viewAllCourses = () => {
  router.push('/teacher/courses')
}

const goToCourses = () => {
  router.push('/teacher/courses')
}

const goToStudents = () => {
  router.push('/teacher/students')
}

const goToScores = () => {
  router.push('/teacher/scores')
}

const goToProfile = () => {
  router.push('/teacher/profile')
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.page-root {
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.teacher-dashboard {
  padding: 20px;
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

.student-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.score-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.class-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.quick-actions .el-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 20px;
}
</style> 