# 学生管理系统 API 接口文档

## 基础信息

- **Base URL**: `http://121.43.236.83:8888`
- **Content-Type**: `application/json`
- **认证方式**: 无（当前版本）

## 通用响应格式

```typescript
interface ApiResponse<T = any> {
  code: number      // 响应状态码，200表示成功
  message: string   // 响应消息
  data: T          // 响应数据
}
```

## 1. 认证相关接口

### 1.1 用户登录

**接口地址**: `POST /api/login`

**请求参数**:
```typescript
interface LoginReq {
  username: string   // 用户名
  password: string   // 密码
  user_type: number  // 用户类型 1:学生 2:教师 3:管理员
}
```

**响应数据**:
```typescript
interface LoginResp {
  id: number        // 用户ID
  user_type: number // 用户类型 1:学生 2:教师 3:管理员
}
```

## 2. 管理员接口

### 2.1 学生管理

#### 2.1.1 获取学生列表
- **接口**: `GET /api/admin/students`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `class_id`: 班级ID (可选)

#### 2.1.2 获取学生信息
- **接口**: `GET /api/admin/student`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `id`: 学生表主键 (必填)

#### 2.1.3 创建学生
- **接口**: `POST /api/admin/student`
- **参数**:
```typescript
interface CreateStudentReq {
  admin_id: number    // 管理员ID
  student_id: string  // 学号
  password: string    // 密码
  name: string        // 姓名
  gender: string      // 性别
  age: number         // 年龄
  city_id: number     // 城市ID
  class_id: number    // 班级ID
}
```

#### 2.1.4 更新学生信息
- **接口**: `PUT /api/admin/student`
- **参数**:
```typescript
interface UpdateStudentReq {
  admin_id: number    // 管理员ID
  id: number          // 学生表主键
  name: string        // 姓名
  gender: string      // 性别
  age: number         // 年龄
  city_id: number     // 城市ID
  class_id: number    // 班级ID
}
```

#### 2.1.5 删除学生
- **接口**: `DELETE /api/admin/student`
- **参数**:
```typescript
interface DeleteStudentReq {
  admin_id: number    // 管理员ID
  id: number          // 学生表主键
}
```

### 2.2 教师管理

#### 2.2.1 获取教师列表
- **接口**: `GET /api/admin/teachers`
- **参数**: 
  - `admin_id`: 管理员ID (必填)

#### 2.2.2 获取教师信息
- **接口**: `GET /api/admin/teacher`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `id`: 教师表主键 (必填)

#### 2.2.3 创建教师
- **接口**: `POST /api/admin/teacher`
- **参数**:
```typescript
interface CreateTeacherReq {
  admin_id: number    // 管理员ID
  teacher_id: string  // 教师工号
  password: string    // 密码
  name: string        // 姓名
  gender: string      // 性别
  age: number         // 年龄
  title: string       // 职称
  phone: string       // 联系电话
  is_admin: boolean   // 是否管理员
}
```

#### 2.2.4 更新教师信息
- **接口**: `PUT /api/admin/teacher`
- **参数**:
```typescript
interface UpdateTeacherReq {
  admin_id: number    // 管理员ID
  id: number          // 教师表主键
  name: string        // 姓名
  gender: string      // 性别
  age: number         // 年龄
  title: string       // 职称
  phone: string       // 联系电话
  is_admin: boolean   // 是否管理员
}
```

#### 2.2.5 删除教师
- **接口**: `DELETE /api/admin/teacher`
- **参数**:
```typescript
interface DeleteTeacherReq {
  admin_id: number    // 管理员ID
  id: number          // 教师表主键
}
```

### 2.3 课程管理

#### 2.3.1 获取课程列表
- **接口**: `GET /api/admin/courses`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `class_id`: 归属班级 (可选)

#### 2.3.2 获取课程信息
- **接口**: `GET /api/admin/course`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `id`: 课程ID (必填)

#### 2.3.3 创建课程
- **接口**: `POST /api/admin/course`
- **参数**:
```typescript
interface CreateCourseReq {
  admin_id: number    // 管理员ID
  name: string        // 课程名称
  school_year: number // 开课年份
  semester: string    // 开课学期
  hours: number       // 学时
  credit: number      // 学分
  class_id: number    // 归属班级
  exam_type: string   // 考核方式
}
```

#### 2.3.4 更新课程信息
- **接口**: `PUT /api/admin/course`
- **参数**:
```typescript
interface UpdateCourseReq {
  admin_id: number    // 管理员ID
  id: number          // 课程ID
  name: string        // 课程名称
  school_year: number // 开课年份
  semester: string    // 开课学期
  hours: number       // 学时
  credit: number      // 学分
  class_id: number    // 归属班级
  exam_type: string   // 考核方式
}
```

#### 2.3.5 删除课程
- **接口**: `DELETE /api/admin/course`
- **参数**:
```typescript
interface DeleteCourseReq {
  admin_id: number    // 管理员ID
  id: number          // 课程ID
}
```

### 2.4 班级管理

#### 2.4.1 获取班级列表
- **接口**: `GET /api/admin/classes`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `department_id`: 所属专业ID (可选)

#### 2.4.2 获取班级信息
- **接口**: `GET /api/admin/class`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `class_id`: 班级ID (必填)

#### 2.4.3 创建班级
- **接口**: `POST /api/admin/class`
- **参数**:
```typescript
interface CreateClassReq {
  admin_id: number    // 管理员ID
  name: string        // 班级名称
  department_id: number // 所属专业ID
}
```

#### 2.4.4 更新班级信息
- **接口**: `PUT /api/admin/class`
- **参数**:
```typescript
interface UpdateClassReq {
  admin_id: number    // 管理员ID
  class_id: number    // 班级ID
  name: string        // 班级名称
  department_id: number // 所属专业ID
}
```

#### 2.4.5 删除班级
- **接口**: `DELETE /api/admin/class`
- **参数**:
```typescript
interface DeleteClassReq {
  admin_id: number    // 管理员ID
  class_id: number    // 班级ID
}
```

### 2.5 部门管理

#### 2.5.1 获取部门列表
- **接口**: `GET /api/admin/departments`
- **参数**: 
  - `admin_id`: 管理员ID (必填)

#### 2.5.2 获取部门信息
- **接口**: `GET /api/admin/department`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `department_id`: 部门ID (必填)

#### 2.5.3 创建部门
- **接口**: `POST /api/admin/department`
- **参数**:
```typescript
interface CreateDepartmentReq {
  admin_id: number    // 管理员ID
  name: string        // 部门名称
}
```

#### 2.5.4 更新部门信息
- **接口**: `PUT /api/admin/department`
- **参数**:
```typescript
interface UpdateDepartmentReq {
  admin_id: number    // 管理员ID
  department_id: number // 部门ID
  name: string        // 部门名称
}
```

#### 2.5.5 删除部门
- **接口**: `DELETE /api/admin/department`
- **参数**:
```typescript
interface DeleteDepartmentReq {
  admin_id: number    // 管理员ID
  department_id: number // 部门ID
}
```

### 2.6 授课管理

#### 2.6.1 获取授课列表
- **接口**: `GET /api/admin/teachings`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `teacher_id`: 教师工号 (可选)
  - `course_id`: 课程ID (可选)

#### 2.6.2 获取授课信息
- **接口**: `GET /api/admin/teaching`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `id`: 授课表主键 (必填)

#### 2.6.3 创建授课
- **接口**: `POST /api/admin/teaching`
- **参数**:
```typescript
interface CreateTeachingReq {
  admin_id: number    // 管理员ID
  teacher_id: string  // 教师工号
  course_id: number   // 课程ID
}
```

#### 2.6.4 更新授课信息
- **接口**: `PUT /api/admin/teaching`
- **参数**:
```typescript
interface UpdateTeachingReq {
  admin_id: number    // 管理员ID
  id: number          // 授课表主键
  teacher_id: string  // 教师工号
  course_id: number   // 课程ID
}
```

#### 2.6.5 删除授课
- **接口**: `DELETE /api/admin/teaching`
- **参数**:
```typescript
interface DeleteTeachingReq {
  admin_id: number    // 管理员ID
  id: number          // 授课表主键
}
```

### 2.7 统计分析

#### 2.7.1 获取每门课程平均成绩
- **接口**: `GET /api/admin/avg/score`
- **参数**: 
  - `admin_id`: 管理员ID (必填)

#### 2.7.2 获取课程分数分布
- **接口**: `GET /api/admin/course/score/distribution`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `course_id`: 课程ID (必填)
  - `school_year`: 学年 (必填)

#### 2.7.3 获取某学年某个相同课程名的课程的所有学生成绩总览
- **接口**: `GET /api/admin/course/student/score`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `course_name`: 课程名称 (必填)
  - `school_year`: 学年 (必填)

#### 2.7.4 获取教师授课统计
- **接口**: `GET /api/admin/teacher/statistics`
- **参数**: 
  - `admin_id`: 管理员ID (必填)

#### 2.7.5 获取GPA排名
- **接口**: `GET /api/admin/department/gpa/rank`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `department_id`: 对象ID (必填)
  - `type`: 排名类型 1:专业 2:班级 (必填)

#### 2.7.6 获取各生源地在各专业绩点前十的数量
- **接口**: `GET /api/admin/city/gpa/top/ten/count`
- **参数**: 
  - `admin_id`: 管理员ID (必填)

#### 2.7.7 各生源地招收学生数量
- **接口**: `GET /api/admin/city/student/count`
- **参数**: 
  - `admin_id`: 管理员ID (必填)

### 2.8 地区管理

#### 2.8.1 获取省份列表
- **接口**: `GET /api/admin/provinces`
- **参数**: 
  - `admin_id`: 管理员ID (必填)

#### 2.8.2 获取城市列表
- **接口**: `GET /api/admin/cities`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `province_id`: 省份ID (必填)

### 2.9 关联查询

#### 2.9.1 获取班级的课程列表
- **接口**: `GET /api/admin/class/course`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `class_id`: 班级ID (必填)
  - `school_year`: 学年 (可选)
  - `semester`: 学期 (可选)

#### 2.9.2 获取教师教授的课程列表
- **接口**: `GET /api/admin/teacher/course`
- **参数**: 
  - `admin_id`: 管理员ID (必填)
  - `teacher_id`: 教师工号 (必填)
  - `school_year`: 学年 (可选)
  - `semester`: 学期 (可选)

## 3. 学生接口

### 3.1 个人信息

#### 3.1.1 获取学生信息
- **接口**: `GET /api/student/info`
- **参数**: 
  - `id`: 学生ID (必填)

#### 3.1.2 修改学生信息
- **接口**: `PUT /api/student/info`
- **参数**:
```typescript
interface UpdateStudentReq {
  id: number         // 学生ID 用来指定要更新的学生
  name: string       // 姓名
  gender: string     // 性别
  age: number        // 年龄
  city_id: number    // 城市ID
}
```

### 3.2 成绩查询

#### 3.2.1 获取学生课程成绩
- **接口**: `GET /api/student/score`
- **参数**: 
  - `id`: 学生ID (必填)
  - `year`: 学年 (可选)

### 3.3 课程相关

#### 3.3.1 获取班级课程列表
- **接口**: `GET /api/student/class/course`
- **参数**: 
  - `class_id`: 班级ID (必填)
  - `student_id`: 学生ID 如果传了代表查询该学生的可选课程 (必填)
  - `year`: 学年 (可选)
  - `semester`: 学期 (可选)

#### 3.3.2 获取教师课程列表
- **接口**: `GET /api/student/teacher/course`
- **参数**: 
  - `teacher_id`: 教师ID (必填)
  - `year`: 学年 (可选)
  - `semester`: 学期 (可选)

#### 3.3.3 学生选课
- **接口**: `POST /api/student/course/select`
- **参数**:
```typescript
interface SelectCourseReq {
  student_id: string // 学生ID
  course_id: number  // 课程ID
}
```

## 4. 教师接口

### 4.1 个人信息

#### 4.1.1 获取教师信息
- **接口**: `GET /api/teacher`
- **参数**: 
  - `id`: 教师ID (必填)

### 4.2 课程管理

#### 4.2.1 获取教师所授课程
- **接口**: `GET /api/teacher/course`
- **参数**: 
  - `teacher_id`: 教师ID (必填)
  - `year`: 学年 (可选)
  - `semester`: 学期 (可选)

#### 4.2.2 获取教师所授课程平均成绩
- **接口**: `GET /api/teacher/course/avgscore`
- **参数**: 
  - `teacher_id`: 教师ID (必填)

#### 4.2.3 获取教师所授课程成绩排名
- **接口**: `GET /api/teacher/course/rank`
- **参数**: 
  - `teacher_id`: 教师ID (必填)
  - `course_id`: 课程ID (必填)
  - `year`: 学年 (必填)
  - `semester`: 学期 (必填)

### 4.3 学生管理

#### 4.3.1 获取教师所授课程下的学生列表
- **接口**: `GET /api/teacher/course/student`
- **参数**: 
  - `teacher_id`: 教师ID (必填)
  - `course_id`: 课程ID (必填)
  - `year`: 学年 (可选)
  - `semester`: 学期 (可选)

#### 4.3.2 获取教师所授课程下的学生信息
- **接口**: `GET /api/teacher/student`
- **参数**: 
  - `teacher_id`: 教师ID (必填)
  - `student_id`: 学生ID (必填)

### 4.4 成绩管理

#### 4.4.1 设置学生成绩
- **接口**: `POST /api/teacher/course/student/score`
- **参数**:
```typescript
interface SetStudentScoreReq {
  teacher_id: number  // 教师ID
  student_id: string  // 学生ID
  course_id: number   // 课程ID
  score: number       // 成绩
}
```

## 5. 数据模型

### 5.1 学生模型
```typescript
interface Student {
  id: number           // 学生ID
  student_id: string   // 学号
  name: string         // 姓名
  gender: string       // 性别
  age: number          // 年龄
  city_id: number      // 生源地城市编号
  class_id: number     // 所属班级编号
  gpa: number          // 学生平均绩点
  total_credits: number // 已修总学分
}
```

### 5.2 教师模型
```typescript
interface Teacher {
  id: number           // 主键ID
  teacher_id: string   // 工号
  name: string         // 姓名
  gender: string       // 性别
  age: number          // 年龄
  title: string        // 职称
  phone: string        // 电话
  is_admin: boolean    // 是否管理员
}
```

### 5.3 课程模型
```typescript
interface Course {
  course_id: number    // 课程ID
  course_name: string  // 课程名称
  credits: number      // 学分
  year: number         // 学年
  semester: number     // 学期
  hours: number        // 课时
  exam_type: string    // 考试类型 1:考试 2:考查
  teachers: Teacher[]  // 教师列表
}
```

### 5.4 班级模型
```typescript
interface Class {
  id: number           // 班级ID
  name: string         // 班级名称
  department_id: number // 所属专业ID
}
```

### 5.5 部门模型
```typescript
interface Department {
  id: number           // 部门ID
  name: string         // 部门名称
}
```

### 5.6 授课模型
```typescript
interface Teaching {
  id: number           // 授课表主键
  teacher_id: string   // 教师工号
  course_id: number    // 课程ID
}
```

## 6. 错误码说明

- `200`: 请求成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器内部错误

## 7. 使用示例

### 7.1 管理员登录
```javascript
const loginData = {
  username: "admin",
  password: "123456",
  user_type: 3
};

const response = await fetch('http://121.43.236.83:8888/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(loginData)
});

const result = await response.json();
console.log(result);
```

### 7.2 获取学生列表
```javascript
const response = await fetch('http://121.43.236.83:8888/api/admin/students?admin_id=1');
const result = await response.json();
console.log(result.data.list);
```

### 7.3 创建学生
```javascript
const studentData = {
  admin_id: 1,
  student_id: "2025001",
  password: "123456",
  name: "张三",
  gender: "男",
  age: 20,
  city_id: 1,
  class_id: 1
};

const response = await fetch('http://121.43.236.83:8888/api/admin/student', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(studentData)
});

const result = await response.json();
console.log(result);
```

## 8. 注意事项

1. 所有请求都需要设置 `Content-Type: application/json` 头部
2. 管理员ID在所有管理员接口中都是必填参数
3. 可选参数如果不传，则不会影响查询结果
4. 删除操作需要谨慎，建议在删除前进行二次确认
5. 成绩相关的接口需要确保数据的准确性
6. 统计分析接口可能需要较长的响应时间，建议添加加载状态

## 9. 更新日志

- **v1.0.0**: 初始版本，包含基础的学生、教师、课程管理功能
- **v1.1.0**: 新增统计分析功能
- **v1.2.0**: 新增地区管理功能
- **v1.3.0**: 完善错误处理和参数验证 