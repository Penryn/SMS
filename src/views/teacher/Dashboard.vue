<template>
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
            </div>
          </template>
          <el-table :data="myCourses" style="width: 100%">
            <el-table-column prop="name" label="课程名称" />
            <el-table-column prop="code" label="课程代码" />
            <el-table-column prop="credits" label="学分" />
            <el-table-column prop="student_count" label="学生数" />
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
            <el-table-column prop="max_score" label="最高分" />
            <el-table-column prop="min_score" label="最低分" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Reading, User, Document, School } from '@element-plus/icons-vue'
import { teacherApi } from '../../api/teacher'

const stats = ref({
  courseCount: 0,
  studentCount: 0,
  avgScore: 0,
  classCount: 0
})

const myCourses = ref([])
const courseStats = ref([])

const loadDashboardData = async () => {
  try {
    // 加载教师课程
    const coursesResponse = await teacherApi.getCourses()
    if (coursesResponse.code === 200) {
      stats.value.courseCount = coursesResponse.data.length
      myCourses.value = coursesResponse.data.slice(0, 5) // 只显示前5门课程
    }
    
    // 加载课程平均成绩
    const avgScoreResponse = await teacherApi.getCourseAvgScore()
    if (avgScoreResponse.code === 200) {
      const avgScores = avgScoreResponse.data
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

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
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
}
</style> 