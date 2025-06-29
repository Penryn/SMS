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
      if (response.code === 200) {
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
        return { success: false, message: response.message };
      }
    } catch (error: any) {
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
    if (!user.value) return false;
    
    // 根据user_type判断角色
    const userType = user.value.user_type;
    switch (role) {
      case 'student':
        return userType === 1;
      case 'teacher':
        return userType === 2;
      case 'admin':
        return userType === 3;
      default:
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