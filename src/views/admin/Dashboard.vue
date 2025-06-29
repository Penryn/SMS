<template>
  <div class="page-root">
    <div class="dashboard">
      <el-row :gutter="20">
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
              <div class="stat-icon teacher-icon">
                <el-icon><Avatar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.teacherCount }}</div>
                <div class="stat-label">教师总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon course-icon">
                <el-icon><Reading /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.courseCount }}</div>
                <div class="stat-label">课程总数</div>
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
                <div class="stat-label">班级总数</div>
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
                <span>最近添加的学生</span>
              </div>
            </template>
            <el-table :data="recentStudents" style="width: 100%">
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="student_id" label="学号" />
              <el-table-column prop="class_name" label="班级" />
            </el-table>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>系统公告</span>
              </div>
            </template>
            <div class="notice-list">
              <div v-for="notice in notices" :key="notice.id" class="notice-item">
                <div class="notice-title">{{ notice.title }}</div>
                <div class="notice-time">{{ notice.time }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Avatar, Reading, School } from '@element-plus/icons-vue'
import { adminApi } from '../../api/admin'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const stats = ref({
  studentCount: 0,
  teacherCount: 0,
  courseCount: 0,
  classCount: 0
})

const recentStudents = ref([])
const notices = ref([
  {
    id: 1,
    title: '新学期开始，请各位教师及时更新课程信息',
    time: '2024-02-20'
  },
  {
    id: 2,
    title: '学生选课系统将于下周开放',
    time: '2024-02-19'
  },
  {
    id: 3,
    title: '请各部门负责人及时提交年度总结报告',
    time: '2024-02-18'
  }
])

const loadDashboardData = async () => {
  try {
    const adminId = authStore.user?.id || 1

    // 获取统计数据
    const [studentsRes, teachersRes, coursesRes, classesRes, avgScoresRes] = await Promise.all([
      adminApi.getStudents(adminId),
      adminApi.getTeachers(adminId),
      adminApi.getCourses(adminId),
      adminApi.getClasses(adminId),
      adminApi.getAvgScore(adminId)
    ])

    // 更新统计数据
    if (studentsRes.code === 0) {
      stats.value.studentCount = studentsRes.data.list?.length || 0
    }
    if (teachersRes.code === 0) {
      stats.value.teacherCount = teachersRes.data.list?.length || 0
    }
    if (coursesRes.code === 0) {
      stats.value.courseCount = coursesRes.data.list?.length || 0
    }
    if (classesRes.code === 0) {
      stats.value.classCount = classesRes.data.list?.length || 0
    }

    // 获取最近添加的学生（取前5个）
    if (studentsRes.code === 0 && studentsRes.data.list) {
      recentStudents.value = studentsRes.data.list.slice(0, 5).map(student => ({
        name: student.name,
        student_id: student.student_id,
        class_name: `班级${student.class_id}` // 这里可以根据class_id获取真实班级名称
      }))
    }

    // 获取课程平均成绩统计
    if (avgScoresRes.code === 0 && avgScoresRes.data.avg_scores) {
      const avgScores = avgScoresRes.data.avg_scores
      if (avgScores.length > 0) {
        const totalAvg = avgScores.reduce((sum: number, item: any) => sum + item.avg_score, 0)
        stats.value.avgScore = (totalAvg / avgScores.length).toFixed(1)
      }
    }

  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
    // 如果API调用失败，使用默认数据
    stats.value = {
      studentCount: 1250,
      teacherCount: 89,
      courseCount: 156,
      classCount: 45
    }
    
    recentStudents.value = [
      { name: '张三', student_id: '2024001', class_name: '计算机科学1班' },
      { name: '李四', student_id: '2024002', class_name: '软件工程1班' },
      { name: '王五', student_id: '2024003', class_name: '数据科学1班' }
    ]
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.page-root {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.dashboard {
  padding: 20px;
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

.student-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.teacher-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.course-icon {
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

.notice-list {
  max-height: 300px;
  overflow-y: auto;
}

.notice-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.notice-time {
  font-size: 12px;
  color: #999;
}
</style> 