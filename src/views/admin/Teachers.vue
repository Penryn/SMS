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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { adminApi } from '../../api/admin'
import type { Teacher } from '../../types'

const loading = ref(false)
const teachers = ref<Teacher[]>([])
const showAddDialog = ref(false)

const loadTeachers = async () => {
  loading.value = true
  try {
    // 这里需要传入admin_id，暂时使用1
    const response = await adminApi.getTeachers(1)
    if (response.code === 200) {
      teachers.value = response.data.teachers
    }
  } catch (error) {
    ElMessage.error('加载教师列表失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = (row: Teacher) => {
  console.log('编辑教师:', row)
}

const handleDelete = async (row: Teacher) => {
  try {
    await ElMessageBox.confirm('确定要删除这个教师吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 这里需要传入admin_id，暂时使用1
    await adminApi.deleteTeacher({ admin_id: 1, teacher_id: row.id })
    ElMessage.success('删除成功')
    loadTeachers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
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
</style> 