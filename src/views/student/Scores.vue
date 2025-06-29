<template>
  <el-card>
    <template #header>
      <div class="page-header">
        <span>我的成绩</span>
        <div>
          <el-select v-model="selectedYear" placeholder="选择学年" size="small" style="width:120px;margin-right:8px;" @change="loadScores">
            <el-option v-for="year in years" :key="year" :label="year" :value="year" />
          </el-select>
          <el-select v-model="selectedSemester" :placeholder="selectedSemester === '' ? '全部' : '选择学期'" size="small" style="width:100px;" @change="loadScores">
            <el-option label="全部" value="" />
            <el-option label="上学期" value="1" />
            <el-option label="下学期" value="2" />
          </el-select>
        </div>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="filteredScores"
      style="width: 100%"
    >
      <el-table-column prop="course_name" label="课程名称" />
      <el-table-column prop="credits" label="学分" />
      <el-table-column prop="score" label="成绩" />
      <el-table-column prop="school_year" label="学年" />
      <el-table-column prop="semester" label="学期" />
      <el-table-column prop="exam_type" label="考试类型" />
      <el-table-column label="授课教师">
        <template #default="{ row }">
          <span>{{ row.teachers && row.teachers.length ? row.teachers.map((t: any) => t.teacher_name).join('，') : '-' }}</span>
        </template>
      </el-table-column>
      <template #empty>
        <div style="text-align:center;color:#999;">暂无成绩数据</div>
      </template>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { studentApi } from '../../api/student'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const scores = ref<any[]>([])
const years = ref<number[]>([])
const selectedYear = ref<number>(new Date().getFullYear())
const selectedSemester = ref<string>('')

const loadScores = async () => {
  loading.value = true
  try {
    const studentId = authStore.user?.id
    if (!studentId) throw new Error('未获取到学生ID')
    const response = await studentApi.getScore(studentId, selectedYear.value)
    if (response.code === 0 && Array.isArray(response.data.scores)) {
      scores.value = response.data.scores
      years.value = Array.from(new Set(response.data.scores.map((s: any) => s.school_year))).filter(Boolean).sort((a, b) => b - a)
    } else {
      scores.value = []
    }
  } catch (error) {
    ElMessage.error('加载成绩列表失败')
  } finally {
    loading.value = false
  }
}

const filteredScores = computed(() => {
  let list = scores.value.filter((s: any) => s.score > 0)
  if (selectedYear.value) {
    list = list.filter((s: any) => s.school_year === selectedYear.value)
  }
  if (selectedSemester.value) {
    list = list.filter((s: any) => s.semester === selectedSemester.value)
  }
  return list
})

onMounted(() => {
  loadScores()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 