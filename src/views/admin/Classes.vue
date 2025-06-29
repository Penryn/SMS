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
      >
        <el-table-column prop="name" label="班级名称" />
        <el-table-column prop="grade" label="年级" />
        <el-table-column prop="student_count" label="学生数量" />
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
import type { Class } from '../../types'

const loading = ref(false)
const classes = ref<Class[]>([])
const showAddDialog = ref(false)

const loadClasses = async () => {
  loading.value = true
  try {
    // 这里需要传入admin_id，暂时使用1
    const response = await adminApi.getClasses(1)
    if (response.code === 200) {
      classes.value = response.data.classes
    }
  } catch (error) {
    ElMessage.error('加载班级列表失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = (row: Class) => {
  console.log('编辑班级:', row)
}

const handleDelete = async (row: Class) => {
  try {
    await ElMessageBox.confirm('确定要删除这个班级吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 这里需要传入admin_id，暂时使用1
    await adminApi.deleteClass({ admin_id: 1, class_id: row.id })
    ElMessage.success('删除成功')
    loadClasses()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadClasses()
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
</style> 