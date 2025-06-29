<template>
  <div class="scores-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>成绩管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加成绩
          </el-button>
        </div>
      </template>
      
      <!-- 搜索条件 -->
      <div class="search-form">
        <el-form :model="searchForm" inline>
          <el-form-item label="学生姓名">
            <el-input v-model="searchForm.student_name" placeholder="请输入学生姓名" />
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input v-model="searchForm.course_name" placeholder="请输入课程名称" />
          </el-form-item>
          <el-form-item label="学期">
            <el-select v-model="searchForm.semester" placeholder="请选择学期" clearable>
              <el-option label="2024春季" value="2024-1" />
              <el-option label="2024秋季" value="2024-2" />
              <el-option label="2025春季" value="2025-1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table
        v-loading="loading"
        :data="scores"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="student_name" label="学生姓名" />
        <el-table-column prop="student_id" label="学号" />
        <el-table-column prop="course_name" label="课程名称" />
        <el-table-column prop="course_id" label="课程编号" />
        <el-table-column prop="score" label="成绩" />
        <el-table-column prop="semester" label="学期" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑成绩对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑成绩' : '添加成绩'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学生" prop="student_id">
          <el-select v-model="form.student_id" placeholder="请选择学生">
            <el-option
              v-for="student in students"
              :key="student.id"
              :label="`${student.name} (${student.student_id})`"
              :value="student.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="course_id">
          <el-select v-model="form.course_id" placeholder="请选择课程">
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="`${course.name} (${course.course_id})`"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input-number v-model="form.score" :min="0" :max="100" :precision="1" />
        </el-form-item>
        <el-form-item label="学期" prop="semester">
          <el-select v-model="form.semester" placeholder="请选择学期">
            <el-option label="2024春季" value="2024-1" />
            <el-option label="2024秋季" value="2024-2" />
            <el-option label="2025春季" value="2025-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { adminApi } from '../../api/admin'
import type { Score, Student, Course } from '../../types'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const scores = ref<Score[]>([])
const students = ref<Student[]>([])
const courses = ref<Course[]>([])
const showAddDialog = ref(false)
const isEdit = ref(false)
const formRef = ref()

const searchForm = reactive({
  student_name: '',
  course_name: '',
  semester: ''
})

const form = reactive({
  id: 0,
  student_id: 0,
  course_id: 0,
  score: 0,
  semester: '',
  remark: ''
})

const rules = {
  student_id: [{ required: true, message: '请选择学生', trigger: 'change' }],
  course_id: [{ required: true, message: '请选择课程', trigger: 'change' }],
  score: [{ required: true, message: '请输入成绩', trigger: 'blur' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }]
}

const loadScores = async () => {
  loading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getScores(adminId)
    if (response.code === 0) {
      scores.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('加载成绩列表失败')
  } finally {
    loading.value = false
  }
}

const loadStudents = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getStudents(adminId)
    if (response.code === 0) {
      students.value = response.data.list || []
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
  }
}

const loadCourses = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getCourses(adminId)
    if (response.code === 0) {
      courses.value = response.data.list || []
    }
  } catch (error) {
    console.error('加载课程列表失败:', error)
  }
}

const handleSearch = () => {
  // 这里可以实现搜索功能
  console.log('搜索条件:', searchForm)
  loadScores()
}

const handleReset = () => {
  Object.assign(searchForm, {
    student_name: '',
    course_name: '',
    semester: ''
  })
  loadScores()
}

const handleEdit = (row: Score) => {
  isEdit.value = true
  Object.assign(form, row)
  showAddDialog.value = true
}

const handleDelete = async (row: Score) => {
  try {
    await ElMessageBox.confirm('确定要删除这个成绩记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const adminId = authStore.user?.id || 1
    await adminApi.deleteScore({ admin_id: adminId, id: row.id })
    ElMessage.success('删除成功')
    loadScores()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    const adminId = authStore.user?.id || 1
    
    if (isEdit.value) {
      // 编辑成绩
      await adminApi.updateScore({ ...form, admin_id: adminId })
      ElMessage.success('更新成功')
    } else {
      // 添加成绩
      await adminApi.createScore({ ...form, admin_id: adminId })
      ElMessage.success('添加成功')
    }
    
    showAddDialog.value = false
    loadScores()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleSelectionChange = (selection: Score[]) => {
  console.log('选中的成绩:', selection)
}

onMounted(() => {
  loadScores()
  loadStudents()
  loadCourses()
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

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 