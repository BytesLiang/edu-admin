import request from '@/utils/request'

export default {

  // 获取课程章节信息
  getChapterVideo(courseId) {
    return request({
      url: `/eduService/chapter/${courseId}`,
      method: 'get'
    })
  }
}
