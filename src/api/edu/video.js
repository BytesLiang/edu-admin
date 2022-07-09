import request from '@/utils/request'

export default {

  // 获取小节信息
  getVideoById(id) {
    return request({
      url: `/eduService/video/${id}`,
      method: 'get'
    })
  },

  // 添加小节
  addVideo(video) {
    return request({
      url: '/eduService/video/add',
      method: 'post',
      data: video
    })
  },
  // 修改小节信息
  updateVideo(video) {
    return request({
      url: '/eduService/video/update',
      method: 'put',
      data: video
    })
  },
  // 删除章节
  deleteVideo(videoId) {
    return request({
      url: `/eduService/video/${videoId}`,
      method: 'delete'
    })
  }
}
