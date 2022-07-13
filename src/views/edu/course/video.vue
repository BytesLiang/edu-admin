<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible.sync="dialogVideoFormVisible" title="编辑课时">
    <el-form :model="video" :rules="rules" label-width="120px">
      <el-form-item label="课时标题" prop="title">
        <el-input v-model="video.title" />
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="是否免费">
        <el-radio-group v-model="video.free">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传视频">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="#"
          :http-request="uploadVideo"
          :limit="1"
          :on-change="handleChange"
          :before-remove="handleBeforeRemove"
          :on-remove="handleOnRemove"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取视频</el-button>
          <el-button style="margin-left: 40px;" size="small" type="success" @click="submitUpload">点击上传</el-button>
          <el-progress class="progress" :text-inside="true" :stroke-width="18" :percentage="progress" status="exception" />
          <div slot="tip" class="el-upload__tip">只能上传mp4文件, 且不超过500M</div>
        </el-upload>
        <video id="video" :src="videoURL" controls="true" width="320"></video>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TcVod from 'vod-js-sdk-v6'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      dialogVideoFormVisible: false, // 小节弹框
      // uploadBtnDisabled: false,
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: ''
      },
      // 文件列表
      fileList: [],
      // 上传成功后的地址
      videoURL: '',
      // 进度条百分比
      progress: 0,
      // 上传视频获取成功后拿到的fileID【备用】
      signature: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getVodSignature()
  },

  methods: {
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      this.video.chapterId = chapterId
    },
    openEditVideo(videoId) {
      this.dialogVideoFormVisible = true
      video.getVideoById(videoId).then(response => {
        this.video = response.data
      })
    },
    // 添加小节
    addVideo() {
      // 设置课程id
      this.video.courseId = this.$parent.courseId
      video.addVideo(this.video).then(response => {
        // 关闭弹框
        this.dialogVideoFormVisible = false
        // 提示
        this.$message({
          type: 'success',
          message: '添加小节成功!'
        })
        // 刷新页面
        this.$parent.getChapterVideo()
      })
    },
    // 修改小节
    updateVideo() {
      video.updateVideo(this.video).then(response => {
        this.dialogVideoFormVisible = false
        this.$message({
          type: 'success',
          message: '修改小节成功!'
        })
        this.$parent.getChapterVideo()
      })
    },
    saveOrUpdate() {
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },
    // 获取签名  这里的签名请求是由后端提供的，只需要拿到后端给的签名请求即可
    getVodSignature() {
      video.getVodSignature()
        .then((response) => {
          this.signature = response.data
        })
    },
    // 文件列表改变时  将文件列表保存到本地
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    // 点击上传时
    submitUpload() {
      if (this.fileList.length < 1) return this.$message.error('请先选取视频，再进行上传', '提示')
      this.uploadVideo()
    },
    // 自定义上传
    uploadVideo(e) {
      if (this.fileList.length < 1) {
        window.alert('您还没有选取文件')
      } else {
        // 必须以函数的形式返回  sdk参数限制
        const getSignature = async() => {
          const data = await this.signature
          return data
        }
        const tcVod = new TcVod({
          getSignature: getSignature // 获取上传签名的函数
        })
        // 获取通过elementui上传到本地的文件  因为参数类型必须为file 不能直接以对象的形式传输
        const mediaFile = this.fileList[0].raw
        console.log('上传' + mediaFile)
        const uploader = tcVod.upload({
          mediaFile: mediaFile
        })
        // 监听上传进度
        uploader.on('media_progress', info => {
          this.progress = parseInt(info.percent * 100)
        })
        // 上传结束时，将url存到本地
        uploader.done().then(doneResult => {
          // 保存地址
          this.video.videoSourceId = doneResult.fileId
          this.video.videoOriginalName = mediaFile.name
          this.videoURL = doneResult.video.url
        })
      }
    },
    // 删除视频文件确认
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`)
    },
    handleOnRemove(file, fileList) {
      if (!this.video.videoSourceId) {
        return
      }
      video.removeVod(this.video.videoSourceId).then(response => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        video.updateVideo(this.video)
        this.$message.success(response.message)
      })
    }
  }
}
</script>
