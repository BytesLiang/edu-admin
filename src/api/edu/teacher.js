import request from '@/utils/request'

export default {
  getTeacherList(params) {
    console.log('调用方法')
    return request({
      url: '/eduService/teacher/list',
      method: 'get',
      params
    })
  },

  // 分页查询讲师
  // current: 当前页
  // limit: 每页记录数
  // teacherQuery: 查询条件
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      url: `/eduService/teacher/page/${current}/${limit}`,
      method: 'post',
      data: teacherQuery
    })
  },

  // 删除讲师
  // id: 讲师id
  removeTeacher(id) {
    return request({
      url: `/eduService/teacher/${id}`,
      method: 'delete'
    })
  },

  // 修改讲师信息
  // teacher: 讲师数据
  updateTeacher(teacher) {
    return request({
      url: `/eduService/teacher/update`,
      method: 'put',
      data: teacher
    })
  },

  // 添加讲师
  // teacher: 讲师数据
  addTeacher(teacher) {
    return request({
      url: `/eduService/teacher/add`,
      method: 'post',
      data: teacher
    })
  },

  // 获取讲师信息
  // id: 讲师id
  getTeacherInfo(id) {
    return request({
      url: `/eduService/teacher/${id}`,
      method: 'get'
    })
  }
}
