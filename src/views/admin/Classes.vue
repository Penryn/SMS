<template>
  <div class="classes-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>班级管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加班级
          </el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="classes"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="班级名称" />
        <el-table-column prop="class_id" label="班级编号" />
        <el-table-column prop="grade" label="年级" />
        <el-table-column prop="major" label="专业" />
        <el-table-column prop="student_count" label="学生人数" />
        <el-table-column prop="advisor_name" label="班主任" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑班级对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑班级' : '添加班级'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="班级编号" prop="class_id">
          <el-input v-model="form.class_id" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择年级">
            <el-option label="2021级" value="2021" />
            <el-option label="2022级" value="2022" />
            <el-option label="2023级" value="2023" />
            <el-option label="2024级" value="2024" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" />
        </el-form-item>
        <el-form-item label="班主任" prop="advisor_id">
          <el-select v-model="form.advisor_id" placeholder="请选择班主任">
            <el-option
              v-for="teacher in teachers"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入班级描述"
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
import type { Class, Teacher } from '../../types'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const classes = ref<Class[]>([])
const teachers = ref<Teacher[]>([])
const showAddDialog = ref(false)
const isEdit = ref(false)
const formRef = ref()

const form = reactive({
  id: 0,
  class_id: '',
  name: '',
  grade: '',
  major: '',
  advisor_id: 0,
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  class_id: [{ required: true, message: '请输入班级编号', trigger: 'blur' }],
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  advisor_id: [{ required: true, message: '请选择班主任', trigger: 'change' }]
}

const loadClasses = async () => {
  loading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getClasses(adminId)
    if (response.code === 0) {
      classes.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('加载班级列表失败')
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

const handleEdit = (row: Class) => {
  isEdit.value = true
  Object.assign(form, row)
  showAddDialog.value = true
}

const handleDelete = async (row: Class) => {
  try {
    await ElMessageBox.confirm('确定要删除这个班级吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const adminId = authStore.user?.id || 1
    await adminApi.deleteClass({ admin_id: adminId, id: row.id })
    ElMessage.success('删除成功')
    loadClasses()
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
      // 编辑班级
      await adminApi.updateClass({ ...form, admin_id: adminId })
      ElMessage.success('更新成功')
    } else {
      // 添加班级
      await adminApi.createClass({ ...form, admin_id: adminId })
      ElMessage.success('添加成功')
    }
    
    showAddDialog.value = false
    loadClasses()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleSelectionChange = (selection: Class[]) => {
  console.log('选中的班级:', selection)
}

onMounted(() => {
  loadClasses()
  loadTeachers()
})
</script>

<style scoped>
.classes-page {
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