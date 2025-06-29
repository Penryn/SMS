<template>
  <div class="courses-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>课程管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加课程
          </el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="courses"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="course_id" label="课程编号" />
        <el-table-column prop="teacher_name" label="授课教师" />
        <el-table-column prop="credits" label="学分" />
        <el-table-column prop="hours" label="学时" />
        <el-table-column prop="semester" label="学期" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑课程对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑课程' : '添加课程'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="课程编号" prop="course_id">
          <el-input v-model="form.course_id" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher_id">
          <el-select v-model="form.teacher_id" placeholder="请选择教师">
            <el-option
              v-for="teacher in teachers"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学分" prop="credits">
          <el-input-number v-model="form.credits" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="学时" prop="hours">
          <el-input-number v-model="form.hours" :min="16" :max="200" />
        </el-form-item>
        <el-form-item label="学期" prop="semester">
          <el-select v-model="form.semester" placeholder="请选择学期">
            <el-option label="2024春季" value="2024-1" />
            <el-option label="2024秋季" value="2024-2" />
            <el-option label="2025春季" value="2025-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入课程描述"
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
import type { Course, Teacher } from '../../types'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const courses = ref<Course[]>([])
const teachers = ref<Teacher[]>([])
const showAddDialog = ref(false)
const isEdit = ref(false)
const formRef = ref()

const form = reactive({
  id: 0,
  course_id: '',
  name: '',
  teacher_id: 0,
  credits: 3,
  hours: 48,
  semester: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  course_id: [{ required: true, message: '请输入课程编号', trigger: 'blur' }],
  teacher_id: [{ required: true, message: '请选择授课教师', trigger: 'change' }],
  credits: [{ required: true, message: '请输入学分', trigger: 'blur' }],
  hours: [{ required: true, message: '请输入学时', trigger: 'blur' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }]
}

const loadCourses = async () => {
  loading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getCourses(adminId)
    if (response.code === 0) {
      courses.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('加载课程列表失败')
  } finally {
    loading.value = false
  }
}

const loadTeachers = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getTeachers(adminId)
    if (response.code === 0) {
      teachers.value = response.data.list || []
    }
  } catch (error) {
    console.error('加载教师列表失败:', error)
  }
}

const handleEdit = (row: Course) => {
  isEdit.value = true
  Object.assign(form, row)
  showAddDialog.value = true
}

const handleDelete = async (row: Course) => {
  try {
    await ElMessageBox.confirm('确定要删除这个课程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const adminId = authStore.user?.id || 1
    await adminApi.deleteCourse({ admin_id: adminId, id: row.id })
    ElMessage.success('删除成功')
    loadCourses()
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
      // 编辑课程
      await adminApi.updateCourse({ ...form, admin_id: adminId })
      ElMessage.success('更新成功')
    } else {
      // 添加课程
      await adminApi.createCourse({ ...form, admin_id: adminId })
      ElMessage.success('添加成功')
    }
    
    showAddDialog.value = false
    loadCourses()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleSelectionChange = (selection: Course[]) => {
  console.log('选中的课程:', selection)
}

onMounted(() => {
  loadCourses()
  loadTeachers()
})
</script>

<style scoped>
.courses-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 