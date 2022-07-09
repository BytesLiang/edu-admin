import request from '@/utils/request'

export default {

  // 获取课程章节信息
  getChapterVideo(courseId) {
    return request({
      url: `/eduService/chapter/list/${courseId}`,
      method: 'get'
    })
  },
  // 根据章节id获取章节信息
  getChapterById(chapterId) {
    return request({
      url: `/eduService/chapter/${chapterId}`,
      method: 'get'
    })
  },
  // 添加章节信息
  addChapter(chapter) {
    return request({
      url: '/eduService/chapter/add',
      method: 'post',
      data: chapter
    })
  },
  // 修改章节信息
  updateChapter(chapter) {
    return request({
      url: '/eduService/chapter/update',
      method: 'post',
      data: chapter
    })
  },
  // 删除章节
  deleteChapter(chapterId) {
    return request({
      url: `/eduService/chapter/${chapterId}`,
      method: 'delete'
    })
  }
}
