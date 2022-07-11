import request from '@/utils/request'

export default {

  // 获取课程信息
  getCourseInfo(courseId) {
    return request({
      url: `/eduService/course/${courseId}`,
      method: 'get'
    })
  },

  // 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: '/eduService/course/add',
      method: 'post',
      data: courseInfo
    })
  },

  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: '/eduService/course/update',
      method: 'put',
      data: courseInfo
    })
  },

  // 获取课程确认信息
  getCoursePublishInfo(courseId) {
    return request({
      url: `/eduService/course/publish/${courseId}`,
      method: 'get'
    })
  },

  // 发布课程
  publishCourse(courseId) {
    return request({
      url: `/eduService/course/publish/${courseId}`,
      method: 'post'
    })
  },

  // 删除课程
  removeCourse(courseId) {
    return request({
      url: `/eduService/course/${courseId}`,
      method: 'delete'
    })
  },

  // 根据条件获取课程信息
  getCourseListPage(current, limit, courseQuery) {
    return request({
      url: `/eduService/course/page/${current}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  }
}
