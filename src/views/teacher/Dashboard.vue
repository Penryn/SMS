<template>
  <div class="page-root">
    <div class="teacher-dashboard">
      <el-row :gutter="20">
        <el-col :span="12">
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
        <el-col :span="12">
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
          <el-card class="my-courses-card">
            <template #header>
              <div class="card-header">
                <span>我的课程</span>
                <el-button size="small" type="primary" @click="viewAllCourses">查看详情</el-button>
              </div>
            </template>
            <div class="my-courses-table">
              <el-table :data="pagedCourses" style="width: 100%">
                <el-table-column prop="course_name" label="课程名称" />
                <el-table-column prop="credits" label="学分" />
                <el-table-column prop="hours" label="课时" />
                <el-table-column prop="exam_type" label="考试类型">
                  <template #default="{ row }">
                    {{ row.exam_type === '1' ? '考试' : '考查' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              v-if="myCourses.length > pageSize"
              v-model:current-page="coursePage"
              :page-size="pageSize"
              :total="myCourses.length"
              layout="prev, pager, next"
              style="margin-top: 10px; text-align: right;"
            />
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card class="course-stats-card">
            <template #header>
              <div class="card-header">
                <span>课程成绩统计</span>
              </div>
            </template>
            <div class="course-stats-table">
              <el-table :data="pagedCourseStats" style="width: 100%">
                <el-table-column prop="course_name" label="课程" />
                <el-table-column prop="avg_score" label="平均分" />
                <el-table-column prop="class_name" label="班级" />
                <el-table-column prop="school_year" label="学年" />
              </el-table>
            </div>
            <el-pagination
              v-if="courseStats.length > pageSize"
              v-model:current-page="courseStatsPage"
              :page-size="pageSize"
              :total="courseStats.length"
              layout="prev, pager, next"
              style="margin-top: 10px; text-align: right;"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Reading, User, Document, School, Avatar } from '@element-plus/icons-vue'
import { teacherApi } from '../../api/teacher'
import type { Course, CourseAvgScore } from '../../api/teacher'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  courseCount: 0,
  classCount: 0
})

const myCourses = ref<Course[]>([])
const courseStats = ref<CourseAvgScore[]>([])
const coursePage = ref(1)
const courseStatsPage = ref(1)
const pageSize = 10

const pagedCourses = computed(() => {
  const start = (coursePage.value - 1) * pageSize
  return myCourses.value.slice(start, start + pageSize)
})
const pagedCourseStats = computed(() => {
  const start = (courseStatsPage.value - 1) * pageSize
  return courseStats.value.slice(start, start + pageSize)
})

const loadDashboardData = async () => {
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    // 获取当前年份
    const year = new Date().getFullYear()

    // 分别请求学期1和2的课程
    const [coursesRes1, coursesRes2] = await Promise.all([
      teacherApi.getCourse(teacherId, year, 1),
      teacherApi.getCourse(teacherId, year, 2)
    ])

    let allCourses: Course[] = []
    if (coursesRes1.code === 0 && Array.isArray(coursesRes1.data.courses)) {
      allCourses = allCourses.concat(coursesRes1.data.courses)
    }
    if (coursesRes2.code === 0 && Array.isArray(coursesRes2.data.courses)) {
      allCourses = allCourses.concat(coursesRes2.data.courses)
    }
    myCourses.value = allCourses // 展示全部课程
    stats.value.courseCount = myCourses.value.length

    // 加载课程平均成绩
    const avgScoreResponse = await teacherApi.getCourseAvgScore(teacherId)
    if (avgScoreResponse.code === 0 && Array.isArray(avgScoreResponse.data.avg_scores)) {
      let avgScores = avgScoreResponse.data.avg_scores
      if (avgScores.length > 0) {
        // 按学年倒序排序
        avgScores = avgScores.slice().sort((a, b) => (b.school_year || 0) - (a.school_year || 0))
        courseStats.value = avgScores // 展示全部课程统计
        // 授课班级数量为所有班级名去重后的数量
        const classSet = new Set(avgScores.map(item => item.class_name))
        stats.value.classCount = classSet.size
      }
    }
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
  width: 100%;
  height: 100vh;
  min-width: 0;
  min-height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.teacher-dashboard {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.el-row {
  width: 100%;
  box-sizing: border-box;
}

.el-card {
  width: 100%;
  box-sizing: border-box;
}

.el-table {
  width: 100%;
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

.el-card.my-courses-card,
.el-card.course-stats-card {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.my-courses-table,
.course-stats-table {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
}

.el-pagination {
  flex-shrink: 0;
}
</style> 