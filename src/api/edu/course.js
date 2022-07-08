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
      method: 'post',
      data: courseInfo
    })
  }
}
