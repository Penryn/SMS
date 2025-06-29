<template>
  <div class="page-root">
    <div class="dashboard">
      <el-row :gutter="20">
        <el-col :span="8">
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
        
        <el-col :span="8">
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
        
        <el-col :span="8">
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
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
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
        
        <el-col :span="8">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon department-icon">
                <el-icon><OfficeBuilding /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.departmentCount }}</div>
                <div class="stat-label">部门总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon teaching-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.teachingCount }}</div>
                <div class="stat-label">教师授课总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon province-icon">
                <el-icon><Location /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.provinceCount }}</div>
                <div class="stat-label">省份总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon city-icon">
                <el-icon><House /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.cityCount }}</div>
                <div class="stat-label">城市总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon score-icon">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ stats.scoreCount }}</div>
                <div class="stat-label">成绩总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <!-- 课程平均成绩统计 -->
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
                  <el-select v-model="gpaRankType" placeholder="排名类型" size="small" @change="onRankTypeChange" style="width: 120px;">
                    <el-option label="专业排名" :value="1" />
                    <el-option label="班级排名" :value="2" />
                  </el-select>
                  <el-select v-model="selectedDepartment" placeholder="选择部门" size="small" @change="onDepartmentChange" style="width: 150px;">
                    <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
                  </el-select>
                </div>
              </div>
            </template>
            <!-- 班级切换按钮，仅在班级排名时显示 -->
            <div v-if="gpaRankType === 2 && classGroups.length > 0" class="class-navigation-container">
              <div class="class-navigation">
                <el-button size="small" @click="prevClass" :disabled="currentClassIndex === 0">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <span class="class-info">{{ currentClassInfo }}</span>
                <el-button size="small" @click="nextClass" :disabled="currentClassIndex === classGroups.length - 1">
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
            <el-table
              v-loading="gpaRankLoading"
              :data="currentGpaRanks"
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
              :data="paginatedTeacherStatistics"
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
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="teacherStatsCurrentPage"
                v-model:page-size="teacherStatsPageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="teacherStatistics.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleTeacherStatsSizeChange"
                @current-change="handleTeacherStatsCurrentChange"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { User, Avatar, Reading, School, ArrowLeft, ArrowRight, OfficeBuilding, Document, Location, House, Trophy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '../../api/admin'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const stats = ref({
  studentCount: 0,
  teacherCount: 0,
  courseCount: 0,
  classCount: 0,
  departmentCount: 0,
  teachingCount: 0,
  provinceCount: 0,
  cityCount: 0,
  scoreCount: 0
})

// 加载状态
const avgScoreLoading = ref(false)
const cityCountLoading = ref(false)
const gpaRankLoading = ref(false)
const topTenLoading = ref(false)
const teacherStatsLoading = ref(false)

// 数据
const avgScores = ref<any[]>([])
const cityStudentCounts = ref<any[]>([])
const gpaRanks = ref<any[]>([])
const cityGpaTopTenCounts = ref<any[]>([])
const teacherStatistics = ref<any[]>([])
const departments = ref<any[]>([])

// 班级分组相关
const classGroups = ref<any[]>([])
const currentClassIndex = ref(0)
const currentGpaRanks = ref<any[]>([])

// 教师授课统计分页
const teacherStatsCurrentPage = ref(1)
const teacherStatsPageSize = ref(10)

// 筛选条件
const gpaRankType = ref(1)
const selectedDepartment = ref<number | null>(null)
const selectedClass = ref<string | null>(null)

// 计算当前班级信息
const currentClassInfo = computed(() => {
  console.log('计算当前班级信息:', {
    classGroupsLength: classGroups.value.length,
    currentClassIndex: currentClassIndex.value,
    gpaRankType: gpaRankType.value,
    selectedClass: selectedClass.value
  })
  
  if (classGroups.value.length === 0) return ''
  const currentClass = classGroups.value[currentClassIndex.value]
  const info = `${currentClass.class_name} (${currentClassIndex.value + 1}/${classGroups.value.length})`
  console.log('当前班级信息:', info)
  return info
})

// 计算分页后的教师授课统计数据
const paginatedTeacherStatistics = computed(() => {
  const start = (teacherStatsCurrentPage.value - 1) * teacherStatsPageSize.value
  const end = start + teacherStatsPageSize.value
  return teacherStatistics.value.slice(start, end)
})

const loadDashboardData = async () => {
  try {
    console.log('开始加载仪表盘数据...')
    console.log('authStore:', authStore)
    console.log('authStore.user:', authStore.user)
    const adminId = authStore.user?.id || 1
    console.log('管理员ID:', adminId)

    // 获取统计数据
    console.log('开始调用API...')
    const results = await Promise.allSettled([
      adminApi.getStudents(adminId),
      adminApi.getTeachers(adminId),
      adminApi.getCourses(adminId),
      adminApi.getClasses(adminId)
    ])
    console.log('API调用完成')
    
    // 处理结果
    const [studentsResult, teachersResult, coursesResult, classesResult] = results
    
    console.log('API调用结果:', results)
    
    // 更新统计数据
    if (studentsResult.status === 'fulfilled' && studentsResult.value.code === 0) {
      console.log('学生响应:', studentsResult.value)
      console.log('学生数据详情:', studentsResult.value.data)
      console.log('学生列表:', studentsResult.value.data.list)
      console.log('学生列表长度:', studentsResult.value.data.list?.length)
      stats.value.studentCount = studentsResult.value.data.list?.length || 0
    } else {
      console.log('学生API失败:', studentsResult)
    }
    
    if (teachersResult.status === 'fulfilled' && teachersResult.value.code === 0) {
      console.log('教师数据详情:', teachersResult.value.data)
      stats.value.teacherCount = teachersResult.value.data?.list?.length || 0
    } else {
      console.log('教师API失败:', teachersResult)
    }
    
    if (coursesResult.status === 'fulfilled' && coursesResult.value.code === 0) {
      console.log('课程数据详情:', coursesResult.value.data)
      stats.value.courseCount = coursesResult.value.data?.list?.length || 0
    } else {
      console.log('课程API失败:', coursesResult)
    }
    
    if (classesResult.status === 'fulfilled' && classesResult.value.code === 0) {
      console.log('班级数据详情:', classesResult.value.data)
      stats.value.classCount = classesResult.value.data?.list?.length || 0
    } else {
      console.log('班级API失败:', classesResult)
    }

  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
    // 如果API调用失败，使用默认数据
    stats.value = {
      studentCount: 1250,
      teacherCount: 89,
      courseCount: 156,
      classCount: 45,
      departmentCount: 0,
      teachingCount: 0,
      provinceCount: 0,
      cityCount: 0,
      scoreCount: 0
    }
  }
}

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
      cityStudentCounts.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('加载生源地学生数量失败')
  } finally {
    cityCountLoading.value = false
  }
}

// 处理排名类型选择变化
const onRankTypeChange = () => {
  console.log('排名类型改变，重新请求API确保数据一致性')
  
  // 重置班级相关状态
  currentClassIndex.value = 0
  classGroups.value = []
  selectedClass.value = null
  
  // 重新请求API以确保数据一致性
  loadGpaRank()
}

// 处理部门选择变化
const onDepartmentChange = () => {
  console.log('部门选择改变，强制重新请求API')
  
  // 强制重新请求API，完全重置状态
  currentClassIndex.value = 0
  classGroups.value = []
  selectedClass.value = null
  currentGpaRanks.value = []
  
  // 加载GPA排名
  loadGpaRank()
}

// 加载GPA排名
const loadGpaRank = async () => {
  if (!selectedDepartment.value) {
    // 如果没有选择部门，使用默认值
    if (departments.value.length > 0) {
      selectedDepartment.value = departments.value[0].id
    } else {
      return
    }
  }
  
  console.log('加载GPA排名，部门ID:', selectedDepartment.value, '排名类型:', gpaRankType.value)
  
  gpaRankLoading.value = true
  try {
    const adminId = authStore.user?.id || 1
    // 确保selectedDepartment.value不为null
    if (selectedDepartment.value) {
      // 无论选择什么排名类型，都请求专业排名数据（type=1）
      const response = await adminApi.getDepartmentGpaRank(adminId, selectedDepartment.value, 1)
      if (response.code === 0) {
        gpaRanks.value = response.data.rank || []
        console.log('获取到GPA排名数据:', gpaRanks.value)
        
        // 如果是班级排名，进行分组处理
        if (gpaRankType.value === 2) {
          processClassGroups()
        } else {
          // 专业排名直接显示
          currentGpaRanks.value = gpaRanks.value
          classGroups.value = []
          currentClassIndex.value = 0
          selectedClass.value = null
          console.log('专业排名模式，直接显示所有数据')
        }
      }
    }
  } catch (error) {
    ElMessage.error('加载GPA排名失败')
  } finally {
    gpaRankLoading.value = false
  }
}

// 处理班级分组
const processClassGroups = () => {
  console.log('开始处理班级分组，原始数据:', gpaRanks.value)
  
  // 确保从干净的状态开始
  classGroups.value = []
  currentClassIndex.value = 0
  selectedClass.value = null
  
  const groups: { [key: string]: any[] } = {}
  
  // 按班级分组
  gpaRanks.value.forEach((student, index) => {
    const className = student.class_name
    console.log(`学生 ${student.student_name} 属于班级: ${className}`)
    if (!groups[className]) {
      groups[className] = []
    }
    // 为每个班级内的学生重新计算排名
    groups[className].push({
      ...student,
      rank: groups[className].length + 1
    })
  })
  
  // 转换为数组格式
  classGroups.value = Object.keys(groups).map(className => ({
    class_name: className,
    students: groups[className]
  }))
  
  console.log('班级分组结果:', classGroups.value)
  console.log('班级列表:', classGroups.value.map(c => c.class_name))
  
  // 设置默认班级选择
  if (classGroups.value.length > 0) {
    selectedClass.value = classGroups.value[0].class_name
    console.log('设置默认班级:', selectedClass.value)
  }
  
  // 更新当前显示的排名
  updateCurrentGpaRanks()
}

// 更新当前显示的GPA排名
const updateCurrentGpaRanks = () => {
  console.log('更新当前显示的GPA排名:', {
    gpaRankType: gpaRankType.value,
    classGroupsLength: classGroups.value.length,
    currentClassIndex: currentClassIndex.value,
    selectedClass: selectedClass.value,
    classGroups: classGroups.value.map(c => c.class_name)
  })
  
  if (gpaRankType.value === 2 && classGroups.value.length > 0 && selectedClass.value) {
    const currentClass = classGroups.value.find(c => c.class_name === selectedClass.value)
    if (currentClass) {
      currentGpaRanks.value = currentClass.students || []
      console.log('班级排名模式，当前班级:', selectedClass.value, '学生数量:', currentGpaRanks.value.length)
    } else {
      console.error('找不到选中的班级:', selectedClass.value)
      currentGpaRanks.value = []
    }
  } else {
    currentGpaRanks.value = gpaRanks.value
    console.log('专业排名模式，学生数量:', currentGpaRanks.value.length)
  }
}

// 加载生源地绩点前十统计
const loadCityGpaTopTenCount = async () => {
  topTenLoading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getCityGpaTopTenCount(adminId)
    if (response.code === 0) {
      cityGpaTopTenCounts.value = response.data.list || []
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
      teacherStatistics.value = response.data.list || []
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
        // 加载默认部门的GPA排名
        await loadGpaRank()
      }
    }
  } catch (error) {
    ElMessage.error('加载部门列表失败')
  }
}

// 切换到上一个班级
const prevClass = () => {
  console.log('切换到上一个班级，当前索引:', currentClassIndex.value)
  if (currentClassIndex.value > 0) {
    currentClassIndex.value--
    selectedClass.value = classGroups.value[currentClassIndex.value].class_name
    updateCurrentGpaRanks()
    console.log('切换到班级:', selectedClass.value)
  }
}

// 切换到下一个班级
const nextClass = () => {
  console.log('切换到下一个班级，当前索引:', currentClassIndex.value)
  if (currentClassIndex.value < classGroups.value.length - 1) {
    currentClassIndex.value++
    selectedClass.value = classGroups.value[currentClassIndex.value].class_name
    updateCurrentGpaRanks()
    console.log('切换到班级:', selectedClass.value)
  }
}

// 处理教师授课统计分页大小变化
const handleTeacherStatsSizeChange = (size: number) => {
  teacherStatsPageSize.value = size
  teacherStatsCurrentPage.value = 1
}

// 处理教师授课统计当前页变化
const handleTeacherStatsCurrentChange = (page: number) => {
  teacherStatsCurrentPage.value = page
}

// 加载部门总数
const loadDepartmentCount = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getDepartments(adminId)
    if (response.code === 0) {
      stats.value.departmentCount = response.data.list?.length || 0
    }
  } catch (error) {
    console.error('加载部门总数失败:', error)
  }
}

// 加载教师授课总数
const loadTeachingCount = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getTeachings(adminId)
    if (response.code === 0) {
      stats.value.teachingCount = response.data.list?.length || 0
    }
  } catch (error) {
    console.error('加载教师授课总数失败:', error)
  }
}

// 加载省份总数
const loadProvinceCount = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getProvinces(adminId)
    if (response.code === 0) {
      stats.value.provinceCount = response.data.provinces?.length || 0
    }
  } catch (error) {
    console.error('加载省份总数失败:', error)
  }
}

// 加载城市总数
const loadCityCount = async () => {
  try {
    const adminId = authStore.user?.id || 1
    // 直接获取所有城市
    const citiesResponse = await adminApi.getCities(adminId)
    if (citiesResponse.code === 0) {
      stats.value.cityCount = citiesResponse.data.cities?.length || 0
    }
  } catch (error) {
    console.error('加载城市总数失败:', error)
  }
}

// 加载成绩总数
const loadScoreCount = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getScores(adminId)
    
    // 检查响应结构
    if (response && response.code === 0) {
      // 如果data是undefined，可能数据直接在response中
      const scoreList = response.data?.list || []
      stats.value.scoreCount = scoreList.length
    } else {
      stats.value.scoreCount = 0
    }
  } catch (error) {
    stats.value.scoreCount = 0
  }
}

// 初始化数据
const initData = async () => {
  await Promise.all([
    loadDashboardData(),
    loadAvgScores(),
    loadCityStudentCount(),
    loadCityGpaTopTenCount(),
    loadTeacherStatistics(),
    loadDepartments(),
    loadDepartmentCount(),
    loadTeachingCount(),
    loadProvinceCount(),
    loadCityCount(),
    loadScoreCount()
  ])
}

onMounted(async () => {
  try {
    await initData();
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
});
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

.department-icon {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
}

.teaching-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
}

.province-icon {
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
}

.city-icon {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
}

.score-icon {
  background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  gap: 10px;
}

.class-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
}

.class-info {
  font-size: 12px;
  color: #666;
  background: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
}

.class-navigation-container {
  margin-top: 10px;
  margin-bottom: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 