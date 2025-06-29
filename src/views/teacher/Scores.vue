<template>
  <div class="scores-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>成绩管理</span>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="scores"
        style="width: 100%"
      >
        <el-table-column prop="student_name" label="学生姓名" />
        <el-table-column prop="course_name" label="课程名称" />
        <el-table-column prop="score" label="成绩" />
        <el-table-column prop="semester" label="学期" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="editScore(row)">编辑成绩</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { teacherApi } from '../../api/teacher'

const loading = ref(false)
const scores = ref([])

const loadScores = async () => {
  loading.value = true
  try {
    // 这里应该加载成绩数据，暂时使用空数组
    scores.value = []
  } catch (error) {
    ElMessage.error('加载成绩列表失败')
  } finally {
    loading.value = false
  }
}

const editScore = (score: any) => {
  console.log('编辑成绩:', score)
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
</style> 