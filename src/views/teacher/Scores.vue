<template>
  <div class="scores-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>成绩管理</span>
          <div class="filter-section">
            <el-select v-model="selectedYear" placeholder="选择学年" size="small" style="width:120px;margin-right:8px;" @change="loadScores">
              <el-option label="全部" value="" />
              <el-option v-for="year in years" :key="year" :label="year" :value="year" />
            </el-select>
            <el-select v-model="selectedSemester" placeholder="选择学期" size="small" style="width:100px;" @change="loadScores">
              <el-option label="全部" value="" />
              <el-option label="上学期" value="1" />
              <el-option label="下学期" value="2" />
            </el-select>
            <el-button type="primary" size="small" @click="exportScores" style="margin-left: 10px;">
              导出成绩
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="scores"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="rank" label="排名" width="80" />
        <el-table-column prop="student_name" label="学生姓名" />
        <el-table-column prop="course_name" label="课程名称" />
        <el-table-column prop="score" label="成绩">
          <template #default="{ row }">
            <el-input 
              v-if="row.editing" 
              v-model="row.tempScore" 
              size="small" 
              type="number" 
              min="0" 
              max="100"
              @blur="saveScore(row)"
              @keyup.enter="saveScore(row)"
            />
            <span v-else @click="editScore(row)" style="cursor: pointer; color: #409EFF;">
              {{ row.score || '未录入' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="semester" label="学期">
          <template #default="{ row }">
            {{ row.semester === 1 ? '上学期' : '下学期' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="!row.editing" size="small" @click="editScore(row)">编辑成绩</el-button>
            <el-button v-else size="small" type="primary" @click="saveScore(row)">保存</el-button>
            <el-button size="small" type="info" @click="viewStudentDetail(row)">学生详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 批量操作工具栏 -->
      <div class="batch-actions" v-if="selectedScores.length > 0">
        <el-button type="primary" @click="batchEditScores">批量编辑</el-button>
        <el-button type="success" @click="batchSaveScores">批量保存</el-button>
        <span class="selected-count">已选择 {{ selectedScores.length }} 条记录</span>
      </div>
    </el-card>

    <!-- 学生详情对话框 -->
    <el-dialog
      v-model="studentDialogVisible"
      title="学生详细信息"
      width="500px"
    >
      <el-card v-if="selectedStudent" class="student-detail-card">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="学号">{{ selectedStudent.student_id }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ selectedStudent.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ selectedStudent.gender === 'M' ? '男' : selectedStudent.gender === 'F' ? '女' : selectedStudent.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ selectedStudent.age }}</el-descriptions-item>
          <el-descriptions-item label="城市">{{ (selectedStudent as any).city_name }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{ (selectedStudent as any).class_name }}</el-descriptions-item>
          <el-descriptions-item label="GPA">{{ selectedStudent.gpa }}</el-descriptions-item>
          <el-descriptions-item label="已修学分">{{ selectedStudent.total_credits }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { teacherApi } from '../../api/teacher'
import type { CourseRank, Student } from '../../api/teacher'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const scores = ref<CourseRank[]>([])
const selectedYear = ref('')
const selectedSemester = ref('')
const years = ref<number[]>([])
const selectedScores = ref<CourseRank[]>([])
const studentDialogVisible = ref(false)
const selectedStudent = ref<Student | null>(null)

const loadScores = async () => {
  loading.value = true
  try {
    const teacherId = authStore.user?.id
    const courseId = route.query.courseId ? Number(route.query.courseId) : undefined
    
    if (!teacherId || !courseId) {
      ElMessage.error('缺少必要参数')
      return
    }

    // 这里需要学年和学期参数，暂时使用默认值
    const year = selectedYear.value ? Number(selectedYear.value) : 2024
    const semester = selectedSemester.value ? Number(selectedSemester.value) : 1

    const response = await teacherApi.getCourseRank(teacherId, courseId, year, semester)
    
    if (response.code === 0 && Array.isArray(response.data.rank)) {
      scores.value = response.data.rank.map((item, index) => ({
        ...item,
        editing: false,
        tempScore: item.score,
        rank: index + 1
      }))
      
      // 生成年份列表
      years.value = [2024, 2023, 2022]
    }
  } catch (error) {
    ElMessage.error('加载成绩列表失败')
  } finally {
    loading.value = false
  }
}

const editScore = (score: CourseRank & { editing: boolean; tempScore: number; rank: number }) => {
  score.editing = true
  score.tempScore = score.score || 0
}

const saveScore = async (score: CourseRank & { editing: boolean; tempScore: number; rank: number }) => {
  try {
    const teacherId = authStore.user?.id
    const courseId = route.query.courseId ? Number(route.query.courseId) : undefined
    
    if (!teacherId || !courseId) {
      ElMessage.error('缺少必要参数')
      return
    }

    const response = await teacherApi.setStudentScore({
      teacher_id: teacherId,
      student_id: score.student_id,
      course_id: courseId,
      score: score.tempScore
    })
    
    if (response.code === 0) {
      score.score = score.tempScore
      score.editing = false
      ElMessage.success('成绩保存成功')
    } else {
      ElMessage.error('成绩保存失败')
    }
  } catch (error) {
    ElMessage.error('成绩保存失败')
  }
}

const handleSelectionChange = (selection: CourseRank[]) => {
  selectedScores.value = selection
}

const batchEditScores = () => {
  selectedScores.value.forEach(score => {
    score.editing = true
    score.tempScore = score.score || 0
  })
  ElMessage.info('已进入批量编辑模式，请修改成绩后点击批量保存')
}

const batchSaveScores = async () => {
  try {
    await ElMessageBox.confirm('确定要保存所有选中的成绩吗？', '批量保存', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const teacherId = authStore.user?.id
    const courseId = route.query.courseId ? Number(route.query.courseId) : undefined
    
    if (!teacherId || !courseId) {
      ElMessage.error('缺少必要参数')
      return
    }

    // 批量保存成绩
    const promises = selectedScores.value.map(score => 
      teacherApi.setStudentScore({
        teacher_id: teacherId,
        student_id: score.student_id,
        course_id: courseId,
        score: score.tempScore
      })
    )

    await Promise.all(promises)
    
    // 更新本地数据
    selectedScores.value.forEach(score => {
      score.score = score.tempScore
      score.editing = false
    })
    
    ElMessage.success('批量保存成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量保存失败')
    }
  }
}

const viewStudentDetail = async (score: CourseRank) => {
  try {
    const teacherId = authStore.user?.id
    if (!teacherId) return

    const response = await teacherApi.getStudent(teacherId, score.student_id)
    if (response.code === 0 && response.data.student) {
      selectedStudent.value = response.data.student
      studentDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取学生详情失败')
  }
}

const exportScores = () => {
  // 导出成绩功能
  ElMessage.info('导出功能开发中...')
}

onMounted(() => {
  loadScores()
})
</script>

<style scoped>
.scores-page {
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

.batch-actions {
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-count {
  margin-left: auto;
  color: #666;
  font-size: 14px;
}

.student-detail {
  padding: 20px 0;
}

.student-detail-card {
  padding: 20px;
}
</style> 