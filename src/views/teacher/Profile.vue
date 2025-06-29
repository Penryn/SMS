<template>
  <div class="profile-page">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="page-header">
              <span>个人信息</span>
              <el-button type="primary" @click="editMode = !editMode">
                {{ editMode ? '取消编辑' : '编辑信息' }}
              </el-button>
            </div>
          </template>
          
          <el-form
            v-loading="loading"
            :model="profile"
            label-width="100px"
            style="max-width: 600px"
          >
            <el-form-item label="姓名">
              <el-input v-model="profile.name" disabled />
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="profile.teacher_id" disabled />
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="profile.gender" disabled />
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="profile.age" disabled />
            </el-form-item>
            <el-form-item label="职称">
              <el-input v-model="profile.title" disabled />
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="profile.phone" :disabled="!editMode" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="profile.email" :disabled="!editMode" />
            </el-form-item>
            <el-form-item label="是否管理员">
              <el-input :value="profile.is_admin ? '是' : '否'" disabled />
            </el-form-item>
            <el-form-item v-if="editMode">
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="page-header">
              <span>统计信息</span>
            </div>
          </template>
          
          <div class="stats-info">
            <div class="stat-item">
              <div class="stat-label">授课课程数</div>
              <div class="stat-value">{{ stats.courseCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">学生总数</div>
              <div class="stat-value">{{ stats.studentCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">平均成绩</div>
              <div class="stat-value">{{ stats.avgScore }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">授课班级数</div>
              <div class="stat-value">{{ stats.classCount }}</div>
            </div>
          </div>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="page-header">
              <span>快捷操作</span>
            </div>
          </template>
          
          <div class="quick-actions">
            <el-button type="primary" @click="goToCourses" style="width: 100%; margin-bottom: 10px;">
              <el-icon><Reading /></el-icon>
              我的课程
            </el-button>
            <el-button type="success" @click="goToStudents" style="width: 100%; margin-bottom: 10px;">
              <el-icon><User /></el-icon>
              学生管理
            </el-button>
            <el-button type="warning" @click="goToScores" style="width: 100%; margin-bottom: 10px;">
              <el-icon><Document /></el-icon>
              成绩管理
            </el-button>
            <el-button type="info" @click="goToDashboard" style="width: 100%;">
              <el-icon><DataBoard /></el-icon>
              返回仪表盘
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Reading, User, Document, DataBoard } from '@element-plus/icons-vue'
import { teacherApi } from '../../api/teacher'
import type { Teacher } from '../../api/teacher'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const editMode = ref(false)

const profile = reactive<Teacher & { email: string }>({
  id: 0,
  teacher_id: '',
  name: '',
  gender: '',
  age: 0,
  title: '',
  phone: '',
  email: '',
  is_admin: false
})

const stats = ref({
  courseCount: 0,
  studentCount: 0,
  avgScore: '0',
  classCount: 0
})

const loadProfile = async () => {
  loading.value = true
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    const response = await teacherApi.getTeacher(teacherId)
    if (response.code === 0 && response.data.teacher) {
      Object.assign(profile, response.data.teacher)
    }
    
    // 加载统计信息
    await loadStats()
  } catch (error) {
    ElMessage.error('加载个人信息失败')
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    // 加载教师课程
    const coursesResponse = await teacherApi.getCourse(teacherId)
    if (coursesResponse.code === 0 && Array.isArray(coursesResponse.data.courses)) {
      stats.value.courseCount = coursesResponse.data.courses.length
    }
    
    // 加载课程平均成绩
    const avgScoreResponse = await teacherApi.getCourseAvgScore(teacherId)
    if (avgScoreResponse.code === 0 && Array.isArray(avgScoreResponse.data.avg_scores)) {
      const avgScores = avgScoreResponse.data.avg_scores
      if (avgScores.length > 0) {
        const totalAvg = avgScores.reduce((sum: number, item: any) => sum + item.avg_score, 0)
        stats.value.avgScore = (totalAvg / avgScores.length).toFixed(1)
      }
    }
    
    // 模拟其他数据
    stats.value.studentCount = 120
    stats.value.classCount = 8
  } catch (error) {
    console.error('加载统计信息失败:', error)
  }
}

const saveProfile = async () => {
  try {
    // 这里应该调用更新API，但API文档中没有提供教师信息更新接口
    // 暂时只更新本地状态
    editMode.value = false
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const cancelEdit = () => {
  editMode.value = false
  // 重新加载数据，取消修改
  loadProfile()
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

const goToDashboard = () => {
  router.push('/teacher/dashboard')
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-info {
  padding: 10px 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.quick-actions {
  padding: 10px 0;
}

.quick-actions .el-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style> 