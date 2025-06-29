<template>
  <el-card>
    <template #header>
      <div class="page-header">
        <span>我的成绩</span>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="scores"
      style="width: 100%"
    >
      <el-table-column prop="course_name" label="课程名称" />
      <el-table-column prop="score" label="成绩" />
      <el-table-column prop="semester" label="学期" />
      <el-table-column prop="academic_year" label="学年" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { studentApi } from '../../api/student'

const loading = ref(false)
const scores = ref([])

const loadScores = async () => {
  loading.value = true
  try {
    const response = await studentApi.getScores()
    if (response.code === 200) {
      scores.value = response.data
    }
  } catch (error) {
    ElMessage.error('加载成绩列表失败')
  } finally {
    loading.value = false
  }
}

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