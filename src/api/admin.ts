/**
 * 管理员API接口
 * Base URL: http://121.43.236.83:8888
 */

import request from '../utils/request'
import type {
  ApiResponse,
  Student,
  StudentListResponse,
  Teacher,
  TeacherListResponse,
  Class,
  ClassListResponse,
  Course,
  CourseListResponse,
  Department,
  DepartmentListResponse,
  Teaching,
  TeachingListResponse,
  AvgScore,
  CityStudentCount,
  Province,
  City,
  GpaRank,
  CityGpaTopTenCount,
  ScoreDistribution,
  TeacherStatistics
} from '../types';

// 类型定义
export interface LoginReq {
  username: string // 用户名
  password: string // 密码
  user_type: number // 用户类型 1:学生 2:教师 3:管理员
}

export interface LoginResp {
  id: number // 用户ID
  user_type: number // 用户类型 1:学生 2:教师 3:管理员
}

export interface Student {
  id: number // 学生表主键
  student_id: string // 学号
  name: string // 姓名
  gender: string // 性别
  age: number // 年龄
  city_id: number // 城市ID
  class_id: number // 班级ID
}

export interface CreateStudentReq {
  admin_id: number // 管理员ID
  student_id: string // 学号
  password: string // 密码
  name: string // 姓名
  gender: string // 性别
  age: number // 年龄
  city_id: number // 城市ID
  class_id: number // 班级ID
}

export interface UpdateStudentReq {
  admin_id: number // 管理员ID
  id: number // 学生表主键
  name: string // 姓名
  gender: string // 性别
  age: number // 年龄
  city_id: number // 城市ID
  class_id: number // 班级ID
}

export interface DeleteStudentReq {
  admin_id: number // 管理员ID
  id: number // 学生表主键
}

export interface Teacher {
  id: number // 教师表主键
  teacher_id: string // 教师工号
  name: string // 姓名
  gender: string // 性别
  age: number // 年龄
  title: string // 职称
  phone: string // 联系电话
  is_admin: boolean // 是否管理员
}

export interface CreateTeacherReq {
  admin_id: number // 管理员ID
  teacher_id: string // 教师工号
  password: string // 密码
  name: string // 姓名
  gender: string // 性别
  age: number // 年龄
  title: string // 职称
  phone: string // 联系电话
  is_admin: boolean // 是否管理员
}

export interface UpdateTeacherReq {
  admin_id: number // 管理员ID
  id: number // 教师表主键
  name: string // 姓名
  gender: string // 性别
  age: number // 年龄
  title: string // 职称
  phone: string // 联系电话
  is_admin: boolean // 是否管理员
}

export interface DeleteTeacherReq {
  admin_id: number // 管理员ID
  id: number // 教师表主键
}

export interface Course {
  id: number // 课程ID
  name: string // 课程名称
  school_year: number // 开课年份
  semester: string // 开课学期
  hours: number // 学时
  credit: number // 学分
  class_id: number // 归属班级
  exam_type: string // 考核方式
}

export interface CreateCourseReq {
  admin_id: number // 管理员ID
  name: string // 课程名称
  school_year: number // 开课年份
  semester: string // 开课学期
  hours: number // 学时
  credit: number // 学分
  class_id: number // 归属班级
  exam_type: string // 考核方式
}

export interface UpdateCourseReq {
  admin_id: number // 管理员ID
  id: number // 课程ID
  name: string // 课程名称
  school_year: number // 开课年份
  semester: string // 开课学期
  hours: number // 学时
  credit: number // 学分
  class_id: number // 归属班级
  exam_type: string // 考核方式
}

export interface DeleteCourseReq {
  admin_id: number // 管理员ID
  id: number // 课程ID
}

export interface Class {
  id: number // 班级ID
  name: string // 班级名称
  department_id: number // 所属专业ID
}

export interface CreateClassReq {
  admin_id: number // 管理员ID
  name: string // 班级名称
  department_id: number // 所属专业ID
}

export interface UpdateClassReq {
  admin_id: number // 管理员ID
  class_id: number // 班级ID
  name: string // 班级名称
  department_id: number // 所属专业ID
}

export interface DeleteClassReq {
  admin_id: number // 管理员ID
  class_id: number // 班级ID
}

export interface Department {
  id: number // 部门ID
  name: string // 部门名称
}

export interface CreateDepartmentReq {
  admin_id: number // 管理员ID
  name: string // 部门名称
}

export interface UpdateDepartmentReq {
  admin_id: number // 管理员ID
  department_id: number // 部门ID
  name: string // 部门名称
}

export interface DeleteDepartmentReq {
  admin_id: number // 管理员ID
  department_id: number // 部门ID
}

export interface Teaching {
  id: number // 授课表主键
  teacher_id: string // 教师工号
  course_id: number // 课程ID
}

export interface CreateTeachingReq {
  admin_id: number // 管理员ID
  teacher_id: string // 教师工号
  course_id: number // 课程ID
}

export interface UpdateTeachingReq {
  admin_id: number // 管理员ID
  id: number // 授课表主键
  teacher_id: string // 教师工号
  course_id: number // 课程ID
}

export interface DeleteTeachingReq {
  admin_id: number // 管理员ID
  id: number // 授课表主键
}

export interface Province {
  id: number // 省份ID
  name: string // 省份名称
}

export interface City {
  id: number // 城市ID
  name: string // 城市名称
  province_id: number // 所属省份ID
}

export interface ScoreDistribution {
  score_range: string // 分数范围
  count: number // 该分数范围内的学生数量
}

export interface StudentScore {
  student_id: string // 学号
  student_name: string // 学生姓名
  course_name: string // 课程名称
  semester: string // 学期
  class_name: string // 班级名称
  teacher_name: string // 教师姓名
  score: number // 分数
}

export interface TeacherStatistics {
  teacher_id: string // 教师工号
  teacher_name: string // 教师姓名
  course_id: number // 课程ID
  course_name: string // 课程名称
  school_year: number // 学年
  semester: string // 学期
  student_count: number // 学生数
  avg_score: number // 平均成绩
}

export interface GPARank {
  rank: number // 排名
  student_id: string // 学生ID
  student_name: string // 学生姓名
  class_id: number // 班级ID
  class_name: string // 班级名称
  gpa: number // 平均GPA
}

export interface CityGpaTopTenCount {
  province_name: string // 省份名称
  department_name: string // 专业名称
  top_ten_count: number // 前十名数量
}

export interface CityStudentCount {
  province_id: number // 省份ID
  province_name: string // 省份名称
  city_id: number // 城市ID
  city_name: string // 城市名称
  student_count: number // 学生数量
}

export interface AvgScore {
  course_id: number // 课程ID
  course_name: string // 课程名称
  school_year: number // 学年
  avg_score: number // 平均成绩
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface ListResponse<T> {
  list: T[]
}

export interface StudentListResponse {
  list: Student[]
}

export interface TeacherListResponse {
  list: Teacher[]
}

export interface CourseListResponse {
  list: Course[]
}

export interface ClassListResponse {
  list: Class[]
}

export interface DepartmentListResponse {
  list: Department[]
}

export interface TeachingListResponse {
  list: Teaching[]
}

export interface ProvinceListResponse {
  provinces: Province[]
}

export interface CityListResponse {
  cities: City[]
}

export interface ScoreDistributionResponse {
  distribution: ScoreDistribution[]
}

export interface StudentScoreResponse {
  scores: StudentScore[]
}

export interface TeacherStatisticsResponse {
  teacher_statistics: TeacherStatistics[]
}

export interface GPARankResponse {
  rank: GPARank[]
}

export interface CityGpaTopTenCountResponse {
  city_gpa_top_ten_count: CityGpaTopTenCount[]
}

export interface CityStudentCountResponse {
  city_student_count: CityStudentCount[]
}

export interface AvgScoreResponse {
  avg_scores: AvgScore[]
}

/**
 * 管理员API接口
 */
export const adminApi = {
  /**
   * 用户登录
   * @param data 登录参数
   * @returns 登录响应
   */
  login(data: LoginReq): Promise<ApiResponse<LoginResp>> {
    return request.post('/api/login', data)
  },

  /**
   * 获取学生列表
   * @param admin_id 管理员ID
   * @param class_id 班级ID，可选
   * @returns 学生列表
   */
  getStudents(admin_id: number, class_id?: number): Promise<ApiResponse<StudentListResponse>> {
    const params: any = { admin_id }
    if (class_id) params.class_id = class_id
    return request.get('/api/admin/students', { params })
  },

  /**
   * 获取学生信息
   * @param admin_id 管理员ID
   * @param id 学生表主键
   * @returns 学生信息
   */
  getStudent(admin_id: number, id: number): Promise<ApiResponse<Student>> {
    return request.get('/api/admin/student', { params: { admin_id, id } })
  },

  /**
   * 创建学生
   * @param data 创建学生参数
   * @returns 创建结果
   */
  createStudent(data: CreateStudentReq): Promise<ApiResponse> {
    return request.post('/api/admin/student', data)
  },

  /**
   * 更新学生信息
   * @param data 更新学生参数
   * @returns 更新结果
   */
  updateStudent(data: UpdateStudentReq): Promise<ApiResponse> {
    return request.put('/api/admin/student', data)
  },

  /**
   * 删除学生
   * @param data 删除学生参数
   * @returns 删除结果
   */
  deleteStudent(data: DeleteStudentReq): Promise<ApiResponse> {
    return request.delete('/api/admin/student', { data })
  },

  /**
   * 获取教师列表
   * @param admin_id 管理员ID
   * @returns 教师列表
   */
  getTeachers(admin_id: number): Promise<ApiResponse<TeacherListResponse>> {
    return request.get('/api/admin/teachers', { params: { admin_id } })
  },

  /**
   * 获取教师信息
   * @param admin_id 管理员ID
   * @param id 教师表主键
   * @returns 教师信息
   */
  getTeacher(admin_id: number, id: number): Promise<ApiResponse<Teacher>> {
    return request.get('/api/admin/teacher', { params: { admin_id, id } })
  },

  /**
   * 创建教师
   * @param data 创建教师参数
   * @returns 创建结果
   */
  createTeacher(data: CreateTeacherReq): Promise<ApiResponse> {
    return request.post('/api/admin/teacher', data)
  },

  /**
   * 更新教师信息
   * @param data 更新教师参数
   * @returns 更新结果
   */
  updateTeacher(data: UpdateTeacherReq): Promise<ApiResponse> {
    return request.put('/api/admin/teacher', data)
  },

  /**
   * 删除教师
   * @param data 删除教师参数
   * @returns 删除结果
   */
  deleteTeacher(data: DeleteTeacherReq): Promise<ApiResponse> {
    return request.delete('/api/admin/teacher', { data })
  },

  /**
   * 获取课程列表
   * @param admin_id 管理员ID
   * @param class_id 归属班级，可选
   * @returns 课程列表
   */
  getCourses(admin_id: number, class_id?: number): Promise<ApiResponse<CourseListResponse>> {
    const params: any = { admin_id }
    if (class_id) params.class_id = class_id
    return request.get('/api/admin/courses', { params })
  },

  /**
   * 获取课程信息
   * @param admin_id 管理员ID
   * @param id 课程ID
   * @returns 课程信息
   */
  getCourse(admin_id: number, id: number): Promise<ApiResponse<Course>> {
    return request.get('/api/admin/course', { params: { admin_id, id } })
  },

  /**
   * 创建课程
   * @param data 创建课程参数
   * @returns 创建结果
   */
  createCourse(data: CreateCourseReq): Promise<ApiResponse> {
    return request.post('/api/admin/course', data)
  },

  /**
   * 更新课程信息
   * @param data 更新课程参数
   * @returns 更新结果
   */
  updateCourse(data: UpdateCourseReq): Promise<ApiResponse> {
    return request.put('/api/admin/course', data)
  },

  /**
   * 删除课程
   * @param data 删除课程参数
   * @returns 删除结果
   */
  deleteCourse(data: DeleteCourseReq): Promise<ApiResponse> {
    return request.delete('/api/admin/course', { data })
  },

  /**
   * 获取班级列表
   * @param admin_id 管理员ID
   * @param department_id 所属专业ID，可选
   * @returns 班级列表
   */
  getClasses(admin_id: number, department_id?: number): Promise<ApiResponse<ClassListResponse>> {
    const params: any = { admin_id }
    if (department_id) params.department_id = department_id
    return request.get('/api/admin/classes', { params })
  },

  /**
   * 获取班级信息
   * @param admin_id 管理员ID
   * @param class_id 班级ID
   * @returns 班级信息
   */
  getClass(admin_id: number, class_id: number): Promise<ApiResponse<Class>> {
    return request.get('/api/admin/class', { params: { admin_id, class_id } })
  },

  /**
   * 创建班级
   * @param data 创建班级参数
   * @returns 创建结果
   */
  createClass(data: CreateClassReq): Promise<ApiResponse> {
    return request.post('/api/admin/class', data)
  },

  /**
   * 更新班级信息
   * @param data 更新班级参数
   * @returns 更新结果
   */
  updateClass(data: UpdateClassReq): Promise<ApiResponse> {
    return request.put('/api/admin/class', data)
  },

  /**
   * 删除班级
   * @param data 删除班级参数
   * @returns 删除结果
   */
  deleteClass(data: DeleteClassReq): Promise<ApiResponse> {
    return request.delete('/api/admin/class', { data })
  },

  /**
   * 获取部门列表
   * @param admin_id 管理员ID
   * @returns 部门列表
   */
  getDepartments(admin_id: number): Promise<ApiResponse<DepartmentListResponse>> {
    return request.get('/api/admin/departments', { params: { admin_id } })
  },

  /**
   * 获取部门信息
   * @param admin_id 管理员ID
   * @param department_id 部门ID
   * @returns 部门信息
   */
  getDepartment(admin_id: number, department_id: number): Promise<ApiResponse<Department>> {
    return request.get('/api/admin/department', { params: { admin_id, department_id } })
  },

  /**
   * 创建部门
   * @param data 创建部门参数
   * @returns 创建结果
   */
  createDepartment(data: CreateDepartmentReq): Promise<ApiResponse> {
    return request.post('/api/admin/department', data)
  },

  /**
   * 更新部门信息
   * @param data 更新部门参数
   * @returns 更新结果
   */
  updateDepartment(data: UpdateDepartmentReq): Promise<ApiResponse> {
    return request.put('/api/admin/department', data)
  },

  /**
   * 删除部门
   * @param data 删除部门参数
   * @returns 删除结果
   */
  deleteDepartment(data: DeleteDepartmentReq): Promise<ApiResponse> {
    return request.delete('/api/admin/department', { data })
  },

  /**
   * 获取授课列表
   * @param admin_id 管理员ID
   * @param teacher_id 教师工号，可选
   * @param course_id 课程ID，可选
   * @returns 授课列表
   */
  getTeachings(admin_id: number, teacher_id?: string, course_id?: number): Promise<ApiResponse<TeachingListResponse>> {
    const params: any = { admin_id }
    if (teacher_id) params.teacher_id = teacher_id
    if (course_id) params.course_id = course_id
    return request.get('/api/admin/teachings', { params })
  },

  /**
   * 获取授课信息
   * @param admin_id 管理员ID
   * @param id 授课表主键
   * @returns 授课信息
   */
  getTeaching(admin_id: number, id: number): Promise<ApiResponse<Teaching>> {
    return request.get('/api/admin/teaching', { params: { admin_id, id } })
  },

  /**
   * 创建授课
   * @param data 创建授课参数
   * @returns 创建结果
   */
  createTeaching(data: CreateTeachingReq): Promise<ApiResponse> {
    return request.post('/api/admin/teaching', data)
  },

  /**
   * 更新授课信息
   * @param data 更新授课参数
   * @returns 更新结果
   */
  updateTeaching(data: UpdateTeachingReq): Promise<ApiResponse> {
    return request.put('/api/admin/teaching', data)
  },

  /**
   * 删除授课
   * @param data 删除授课参数
   * @returns 删除结果
   */
  deleteTeaching(data: DeleteTeachingReq): Promise<ApiResponse> {
    return request.delete('/api/admin/teaching', { data })
  },

  /**
   * 获取省份列表
   * @param admin_id 管理员ID
   * @returns 省份列表
   */
  getProvinces(admin_id: number): Promise<ApiResponse<ProvinceListResponse>> {
    return request.get('/api/admin/provinces', { params: { admin_id } })
  },

  /**
   * 获取城市列表
   * @param admin_id 管理员ID
   * @param province_id 省份ID
   * @returns 城市列表
   */
  getCities(admin_id: number, province_id: number): Promise<ApiResponse<CityListResponse>> {
    return request.get('/api/admin/cities', { params: { admin_id, province_id } })
  },

  /**
   * 获取课程分数分布
   * @param admin_id 管理员ID
   * @param course_id 课程ID
   * @param school_year 学年
   * @returns 分数分布
   */
  getCourseScoreDistribution(admin_id: number, course_id: number, school_year: number): Promise<ApiResponse<ScoreDistributionResponse>> {
    return request.get('/api/admin/course/score/distribution', { params: { admin_id, course_id, school_year } })
  },

  /**
   * 获取某学年某个相同课程名的课程的所有学生成绩总览
   * @param admin_id 管理员ID
   * @param course_name 课程名称
   * @param school_year 学年
   * @returns 学生成绩列表
   */
  getCourseAllStudentScore(admin_id: number, course_name: string, school_year: number): Promise<ApiResponse<StudentScoreResponse>> {
    return request.get('/api/admin/course/student/score', { params: { admin_id, course_name, school_year } })
  },

  /**
   * 获取教师授课统计
   * @param admin_id 管理员ID
   * @returns 教师统计信息
   */
  getTeacherStatistics(admin_id: number): Promise<ApiResponse<TeacherStatisticsResponse>> {
    return request.get('/api/admin/teacher/statistics', { params: { admin_id } })
  },

  /**
   * 获取GPA排名
   * @param admin_id 管理员ID
   * @param department_id 对象ID
   * @param type 排名类型 1:专业 2:班级
   * @returns GPA排名
   */
  getDepartmentGpaRank(admin_id: number, department_id: number, type: number): Promise<ApiResponse<GPARankResponse>> {
    return request.get('/api/admin/department/gpa/rank', { params: { admin_id, department_id, type } })
  },

  /**
   * 获取各生源地在各专业绩点前十的数量
   * @param admin_id 管理员ID
   * @returns 生源地绩点前十数量
   */
  getCityGpaTopTenCount(admin_id: number): Promise<ApiResponse<CityGpaTopTenCountResponse>> {
    return request.get('/api/admin/city/gpa/top/ten/count', { params: { admin_id } })
  },

  /**
   * 各生源地招收学生数量
   * @param admin_id 管理员ID
   * @returns 生源地学生数量
   */
  getCityStudentCount(admin_id: number): Promise<ApiResponse<CityStudentCountResponse>> {
    return request.get('/api/admin/city/student/count', { params: { admin_id } })
  },

  /**
   * 获取每门课程平均成绩
   * @param admin_id 管理员ID
   * @returns 课程平均成绩
   */
  getAvgScore(admin_id: number): Promise<ApiResponse<AvgScoreResponse>> {
    return request.get('/api/admin/avg/score', { params: { admin_id } })
  },

  /**
   * 获取班级的课程列表
   * @param admin_id 管理员ID
   * @param class_id 班级ID
   * @param school_year 学年，可选
   * @param semester 学期，可选
   * @returns 课程列表
   */
  getClassCourseList(admin_id: number, class_id: number, school_year?: number, semester?: string): Promise<ApiResponse<CourseListResponse>> {
    const params: any = { admin_id, class_id }
    if (school_year) params.school_year = school_year
    if (semester) params.semester = semester
    return request.get('/api/admin/class/course', { params })
  },

  /**
   * 获取教师教授的课程列表
   * @param admin_id 管理员ID
   * @param teacher_id 教师工号
   * @param school_year 学年，可选
   * @param semester 学期，可选
   * @returns 课程列表
   */
  getTeacherCourseList(admin_id: number, teacher_id: string, school_year?: number, semester?: string): Promise<ApiResponse<CourseListResponse>> {
    const params: any = { admin_id, teacher_id }
    if (school_year) params.school_year = school_year
    if (semester) params.semester = semester
    return request.get('/api/admin/teacher/course', { params })
  }
} 