import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types';
import { authApi } from '../api/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  // 初始化状态
  const initAuth = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  };

  // 登录
  const login = async (username: string, password: string, userType: number) => {
    try {
      const response = await authApi.login({ username, password, user_type: userType });
      console.log('登录响应:', response); // 调试信息
      
      // 后端返回 code: 0 表示成功
      if (response.code === 0) {
        // 根据API文档，登录响应包含id和user_type
        const userData = {
          id: response.data.id,
          user_type: response.data.user_type,
          username: username
        };
        
        token.value = `token_${response.data.id}`; // 临时token
        user.value = userData;
        
        localStorage.setItem('token', token.value);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        return { success: false, message: response.msg || response.message || '登录失败' };
      }
    } catch (error: any) {
      console.error('登录错误:', error); // 调试信息
      return { success: false, message: error.message || '登录失败' };
    }
  };

  // 登出
  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // 检查是否已登录
  const isLoggedIn = () => {
    return !!token.value && !!user.value;
  };

  // 检查用户角色
  const hasRole = (role: string) => {
    if (!user.value) {
      console.log('hasRole: 用户未登录')
      return false;
    }
    
    // 根据user_type判断角色
    const userType = user.value.user_type;
    console.log('hasRole: 检查角色', role, '用户类型:', userType)
    
    switch (role) {
      case 'student':
        const isStudent = userType === 1;
        console.log('hasRole: 学生角色检查结果:', isStudent)
        return isStudent;
      case 'teacher':
        const isTeacher = userType === 2;
        console.log('hasRole: 教师角色检查结果:', isTeacher)
        return isTeacher;
      case 'admin':
        const isAdmin = userType === 3;
        console.log('hasRole: 管理员角色检查结果:', isAdmin)
        return isAdmin;
      default:
        console.log('hasRole: 未知角色:', role)
        return false;
    }
  };

  // 获取用户类型
  const getUserType = () => {
    return user.value?.user_type;
  };

  // 获取用户ID
  const getUserId = () => {
    return user.value?.id;
  };

  return {
    user,
    token,
    initAuth,
    login,
    logout,
    isLoggedIn,
    hasRole,
    getUserType,
    getUserId,
  };
}); 