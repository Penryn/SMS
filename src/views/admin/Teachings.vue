<template>
  <div class="teachings-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>授课管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加授课
          </el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="teachings"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="teacher_id" label="教师工号" />
        <el-table-column prop="course_id" label="课程ID" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑授课对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑授课' : '添加授课'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="教师工号" prop="teacher_id">
          <el-select v-model="form.teacher_id" placeholder="请选择教师" style="width: 100%">
            <el-option
              v-for="teacher in teachers"
              :key="teacher.teacher_id"
              :label="`${teacher.name} (${teacher.teacher_id})`"
              :value="teacher.teacher_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="course_id">
          <el-select v-model="form.course_id" placeholder="请选择课程" style="width: 100%">
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="`${course.name} (${course.school_year}年${course.semester}学期)`"
              :value="course.id"
            />
          </el-select>
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
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const teachings = ref([])
const teachers = ref([])
const courses = ref([])
const showAddDialog = ref(false)
const isEdit = ref(false)
const formRef = ref()

const form = reactive({
  id: 0,
  teacher_id: '',
  course_id: null
})

const rules = {
  teacher_id: [{ required: true, message: '请选择教师', trigger: 'change' }],
  course_id: [{ required: true, message: '请选择课程', trigger: 'change' }]
}

// 加载授课列表
const loadTeachings = async () => {
  loading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getTeachings(adminId)
    if (response.code === 0) {
      teachings.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('加载授课列表失败')
  } finally {
    loading.value = false
  }
}

// 加载教师列表
const loadTeachers = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getTeachers(adminId)
    if (response.code === 0) {
      teachers.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('加载教师列表失败')
  }
}

// 加载课程列表
const loadCourses = async () => {
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getCourses(adminId)
    if (response.code === 0) {
      courses.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('加载课程列表失败')
  }
}

// 编辑授课
const handleEdit = (row: any) => {
  isEdit.value = true
  Object.assign(form, row)
  showAddDialog.value = true
}

// 删除授课
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个授课安排吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const adminId = authStore.user?.id || 1
    await adminApi.deleteTeaching({ admin_id: adminId, id: row.id })
    ElMessage.success('删除成功')
    loadTeachings()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    const adminId = authStore.user?.id || 1
    
    if (isEdit.value) {
      // 编辑授课
      await adminApi.updateTeaching({ ...form, admin_id: adminId })
      ElMessage.success('更新成功')
    } else {
      // 添加授课
      await adminApi.createTeaching({ ...form, admin_id: adminId })
      ElMessage.success('添加成功')
    }
    
    showAddDialog.value = false
    loadTeachings()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 初始化数据
const initData = async () => {
  await Promise.all([
    loadTeachings(),
    loadTeachers(),
    loadCourses()
  ])
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
.teachings-page {
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