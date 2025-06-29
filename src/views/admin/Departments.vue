<template>
  <div class="departments-page">
    <el-card>
      <template #header>
        <div class="page-header">
          <span>部门管理</span>
          <el-button type="primary" @click="resetForm(); showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加部门
          </el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="paginatedDepartments"
        style="width: 100%"
      >
        <el-table-column prop="name" label="部门名称" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑部门对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑部门' : '添加部门'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { adminApi } from '../../api/admin'
import type { Department } from '../../types'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const departments = ref<Department[]>([])
const showAddDialog = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 分页相关
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 计算当前页显示的部门数据
const paginatedDepartments = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return departments.value.slice(start, end)
})

const form = reactive({
  id: 0,
  name: ''
})

const rules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
}

const loadDepartments = async () => {
  loading.value = true
  try {
    const adminId = authStore.user?.id || 1
    const response = await adminApi.getDepartments(adminId)
    if (response.code === 0) {
      departments.value = response.data.list || []
      pagination.total = departments.value.length
    }
  } catch (error) {
    ElMessage.error('加载部门列表失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = (row: Department) => {
  isEdit.value = true
  Object.assign(form, row)
  showAddDialog.value = true
}

const handleDelete = async (row: Department) => {
  try {
    await ElMessageBox.confirm('确定要删除这个部门吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const adminId = authStore.user?.id || 1
    await adminApi.deleteDepartment({ admin_id: adminId, department_id: row.id })
    ElMessage.success('删除成功')
    loadDepartments()
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
      // 编辑部门
      await adminApi.updateDepartment({ 
        admin_id: adminId, 
        department_id: form.id, 
        name: form.name 
      })
      ElMessage.success('更新成功')
    } else {
      // 添加部门
      await adminApi.createDepartment({ 
        admin_id: adminId, 
        name: form.name 
      })
      ElMessage.success('添加成功')
    }
    
    showAddDialog.value = false
    loadDepartments()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  isEdit.value = false
  Object.assign(form, {
    id: 0,
    name: ''
  })
}

// 分页处理函数
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
}

onMounted(() => {
  loadDepartments()
})
</script>

<style scoped>
.departments-page {
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 