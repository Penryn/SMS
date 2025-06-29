<template>
  <div class="statistics-page">
    <el-row :gutter="20">
      <!-- 成绩统计分析 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="page-header">
              <span>课程平均成绩统计</span>
            </div>
          </template>
          <el-table
            v-loading="avgScoreLoading"
            :data="avgScores"
            style="width: 100%"
            height="300"
          >
            <el-table-column prop="course_name" label="课程名称" />
            <el-table-column prop="school_year" label="学年" />
            <el-table-column prop="avg_score" label="平均成绩">
              <template #default="{ row }">
                {{ row.avg_score.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 生源地学生数量统计 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="page-header">
              <span>生源地学生数量统计</span>
            </div>
          </template>
          <el-table
            v-loading="cityCountLoading"
            :data="cityStudentCounts"
            style="width: 100%"
            height="300"
          >
            <el-table-column prop="province_name" label="省份" />
            <el-table-column prop="city_name" label="城市" />
            <el-table-column prop="student_count" label="学生数量" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- GPA排名分析 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="page-header">
              <span>GPA排名分析</span>
              <div class="filter-section">
                <el-select v-model="gpaRankType" placeholder="排名类型" size="small" @change="loadGpaRank">
                  <el-option label="专业排名" :value="1" />
                  <el-option label="班级排名" :value="2" />
                </el-select>
                <el-select v-model="selectedDepartment" placeholder="选择部门" size="small" @change="loadGpaRank">
                  <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
                </el-select>
              </div>
            </div>
          </template>
          <el-table
            v-loading="gpaRankLoading"
            :data="gpaRanks"
            style="width: 100%"
            height="300"
          >
            <el-table-column prop="rank" label="排名" width="80" />
            <el-table-column prop="student_name" label="学生姓名" />
            <el-table-column prop="class_name" label="班级" />
            <el-table-column prop="gpa" label="GPA">
              <template #default="{ row }">
                {{ row.gpa.toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 生源地绩点前十统计 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="page-header">
              <span>生源地绩点前十统计</span>
            </div>
          </template>
          <el-table
            v-loading="topTenLoading"
            :data="cityGpaTopTenCounts"
            style="width: 100%"
            height="300"
          >
            <el-table-column prop="province_name" label="省份" />
            <el-table-column prop="department_name" label="专业" />
            <el-table-column prop="top_ten_count" label="前十名数量" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 教师授课统计 -->
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="page-header">
              <span>教师授课统计</span>
            </div>
          </template>
          <el-table
            v-loading="teacherStatsLoading"
            :data="teacherStatistics"
            style="width: 100%"
          >
            <el-table-column prop="teacher_name" label="教师姓名" />
            <el-table-column prop="course_name" label="课程名称" />
            <el-table-column prop="school_year" label="学年" />
            <el-table-column prop="semester" label="学期" />
            <el-table-column prop="student_count" label="学生数" />
            <el-table-column prop="avg_score" label="平均成绩">
              <template #default="{ row }">
                {{ row.avg_score.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../../api/admin'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// 加载状态
const avgScoreLoading = ref(false)
const cityCountLoading = ref(false)
const gpaRankLoading = ref(false)
const topTenLoading = ref(false)
const teacherStatsLoading = ref(false)

// 数据
const avgScores = ref([])
const cityStudentCounts = ref([])
const gpaRanks = ref([])
const cityGpaTopTenCounts = ref([])
const teacherStatistics = ref([])
const departments = ref([])

// 筛选条件
const gpaRankType = ref(1)
const selectedDepartment = ref(null)

// 加载课程平均成绩
const loadAvgScores = async () => {
  avgScoreLoading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getAvgScore(adminId)
    if (response.code === 0) {
      avgScores.value = response.data.avg_scores || []
    }
  } catch (error) {
    ElMessage.error('加载课程平均成绩失败')
  } finally {
    avgScoreLoading.value = false
  }
}

// 加载生源地学生数量
const loadCityStudentCount = async () => {
  cityCountLoading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getCityStudentCount(adminId)
    if (response.code === 0) {
      cityStudentCounts.value = response.data.city_student_count || []
    }
  } catch (error) {
    ElMessage.error('加载生源地学生数量失败')
  } finally {
    cityCountLoading.value = false
  }
}

// 加载GPA排名
const loadGpaRank = async () => {
  if (!selectedDepartment.value) return
  
  gpaRankLoading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getDepartmentGpaRank(adminId, selectedDepartment.value, gpaRankType.value)
    if (response.code === 0) {
      gpaRanks.value = response.data.rank || []
    }
  } catch (error) {
    ElMessage.error('加载GPA排名失败')
  } finally {
    gpaRankLoading.value = false
  }
}

// 加载生源地绩点前十统计
const loadCityGpaTopTenCount = async () => {
  topTenLoading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getCityGpaTopTenCount(adminId)
    if (response.code === 0) {
      cityGpaTopTenCounts.value = response.data.city_gpa_top_ten_count || []
    }
  } catch (error) {
    ElMessage.error('加载生源地绩点前十统计失败')
  } finally {
    topTenLoading.value = false
  }
}

// 加载教师授课统计
const loadTeacherStatistics = async () => {
  teacherStatsLoading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getTeacherStatistics(adminId)
    if (response.code === 0) {
      teacherStatistics.value = response.data.teacher_statistics || []
    }
  } catch (error) {
    ElMessage.error('加载教师授课统计失败')
  } finally {
    teacherStatsLoading.value = false
  }
}

// 加载部门列表
const loadDepartments = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getDepartments(adminId)
    if (response.code === 0) {
      departments.value = response.data.list || []
      if (departments.value.length > 0) {
        selectedDepartment.value = departments.value[0].id
      }
    }
  } catch (error) {
    ElMessage.error('加载部门列表失败')
  }
}

// 初始化数据
const initData = async () => {
  await Promise.all([
    loadAvgScores(),
    loadCityStudentCount(),
    loadCityGpaTopTenCount(),
    loadTeacherStatistics(),
    loadDepartments()
  ])
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
.statistics-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  gap: 10px;
}
</style> 