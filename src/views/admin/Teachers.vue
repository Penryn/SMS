<template>
  <div class="teachers-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>教师管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加教师
          </el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="teachers"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="teacher_id" label="工号" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column prop="title" label="职称" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑教师对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑教师' : '添加教师'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="工号" prop="teacher_id">
          <el-input v-model="form.teacher_id" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="M" />
            <el-option label="女" value="F" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="18" :max="100" />
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="是否管理员" prop="is_admin">
          <el-switch v-model="form.is_admin" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="form.password" type="password" />
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
import type { Teacher } from '../../types'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const teachers = ref<Teacher[]>([])
const showAddDialog = ref(false)
const isEdit = ref(false)
const formRef = ref()

const form = reactive({
  id: 0,
  teacher_id: '',
  name: '',
  gender: '',
  age: 30,
  title: '',
  phone: '',
  is_admin: false,
  password: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  teacher_id: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  title: [{ required: true, message: '请输入职称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const loadTeachers = async () => {
  loading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getTeachers(adminId)
    if (response.code === 0) {
      teachers.value = response.data.list || []
    }
  } catch (error) {
    ElMessage.error('加载教师列表失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = (row: Teacher) => {
  isEdit.value = true
  Object.assign(form, row)
  showAddDialog.value = true
}

const handleDelete = async (row: Teacher) => {
  try {
    await ElMessageBox.confirm('确定要删除这个教师吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const adminId = authStore.user?.id || 1
    await adminApi.deleteTeacher({ admin_id: adminId, id: row.id })
    ElMessage.success('删除成功')
    loadTeachers()
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
      // 编辑教师
      await adminApi.updateTeacher({ ...form, admin_id: adminId })
      ElMessage.success('更新成功')
    } else {
      // 添加教师
      await adminApi.createTeacher({ ...form, admin_id: adminId })
      ElMessage.success('添加成功')
    }
    
    showAddDialog.value = false
    loadTeachers()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleSelectionChange = (selection: Teacher[]) => {
  console.log('选中的教师:', selection)
}

onMounted(() => {
  loadTeachers()
})
</script>

<style scoped>
.teachers-page {
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