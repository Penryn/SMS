# 学生管理系统 (SMS)

一个基于 Vue 3 + TypeScript + Element Plus 的现代化学生管理系统，提供完整的学生、教师、管理员功能。

## 🚀 功能特性

### 管理员功能
- **仪表盘**: 查看系统整体统计信息
- **学生管理**: 增删改查学生信息
- **教师管理**: 增删改查教师信息
- **课程管理**: 增删改查课程信息
- **班级管理**: 增删改查班级信息
- **成绩管理**: 管理学生成绩

### 教师功能
- **仪表盘**: 查看个人教学统计
- **课程管理**: 查看所授课程
- **学生管理**: 查看课程学生
- **成绩管理**: 录入和管理学生成绩

### 学生功能
- **仪表盘**: 查看个人学习统计
- **成绩查询**: 查看个人成绩
- **课程选择**: 选课和退课
- **个人信息**: 查看和修改个人信息

## 🛠 技术栈

- **前端框架**: Vue 3
- **开发语言**: TypeScript
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **代码规范**: ESLint + Prettier

## 📦 项目结构

```
src/
├── api/                 # API接口
│   ├── admin.ts        # 管理员API
│   ├── teacher.ts      # 教师API
│   ├── student.ts      # 学生API
│   └── config.ts       # API配置
├── components/         # 公共组件
├── layouts/           # 布局组件
├── router/            # 路由配置
├── stores/            # 状态管理
├── types/             # 类型定义
├── utils/             # 工具函数
└── views/             # 页面组件
    ├── admin/         # 管理员页面
    ├── teacher/       # 教师页面
    └── student/       # 学生页面
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 🔧 配置说明

### API配置

在 `src/api/config.ts` 中配置后端API地址：

```typescript
const api = axios.create({
  baseURL: 'http://121.43.236.83:8888',
  timeout: 10000
})
```

### 环境变量

创建 `.env` 文件配置环境变量：

```env
VITE_API_BASE_URL=http://121.43.236.83:8888
VITE_APP_TITLE=学生管理系统
```

## 📱 页面预览

### 登录页面
- 支持管理员、教师、学生三种角色登录
- 表单验证和错误提示

### 管理员仪表盘
- 学生、教师、课程、班级数量统计
- 最近添加的学生列表
- 平均成绩统计

### 教师仪表盘
- 授课课程数量统计
- 学生数量统计
- 平均成绩统计
- 最近课程列表

### 学生仪表盘
- 在学课程数量
- 平均成绩显示
- 最近成绩列表

## 🔐 权限管理

系统采用基于角色的权限控制：

- **管理员**: 拥有所有权限，可以管理学生、教师、课程、班级、成绩
- **教师**: 可以查看所授课程、管理学生成绩
- **学生**: 可以查看个人成绩、进行选课操作

## 📊 数据管理

### 学生信息
- 基本信息：姓名、学号、性别、年龄
- 班级信息：所属班级、专业
- 学习信息：GPA、总学分

### 教师信息
- 基本信息：姓名、工号、性别、年龄
- 职称信息：职称、电话、邮箱
- 权限信息：是否管理员

### 课程信息
- 课程信息：课程名称、课程编号、学分、课时
- 教学信息：授课教师、学期、考试类型
- 课程描述

### 成绩信息
- 成绩记录：学生、课程、成绩、学期
- 统计信息：平均成绩、排名

## 🎨 UI设计

- 采用 Element Plus 设计规范
- 响应式布局，支持多种屏幕尺寸
- 现代化界面设计，用户体验友好
- 统一的色彩搭配和图标使用

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 对应目录下创建页面组件
2. 在 `src/router/` 中添加路由配置
3. 在菜单配置中添加导航项

### 添加新API

1. 在 `src/api/` 对应文件中添加API方法
2. 定义请求和响应类型
3. 在页面组件中调用API

### 状态管理

使用 Pinia 进行状态管理：

```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  actions: {
    login(credentials) {
      // 登录逻辑
    },
    logout() {
      // 登出逻辑
    }
  }
})
```

## 🐛 常见问题

### 1. API请求失败
- 检查网络连接
- 确认API地址配置正确
- 查看浏览器控制台错误信息

### 2. 页面显示异常
- 检查浏览器兼容性
- 确认依赖包版本正确
- 清除浏览器缓存

### 3. 权限问题
- 确认用户角色配置正确
- 检查路由权限设置
- 验证API权限控制

## 📝 更新日志

### v1.0.0 (2025-01-01)
- 初始版本发布
- 实现基础的学生、教师、管理员功能
- 完成前端界面开发

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目地址: [GitHub Repository](https://github.com/your-username/sms)
- 问题反馈: [Issues](https://github.com/your-username/sms/issues)
- 邮箱: your-email@example.com

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
