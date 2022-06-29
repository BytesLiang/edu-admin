<template>
  <div class="app-container">
    <!-- 添加讲师 -->
    <el-form label-width="120px" :model="teacher">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="选择头衔">
          <el-option label="高级讲师" :value="1" />
          <el-option label="首席讲师" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>
      <el-form-item label="讲师头像">
        <!-- 缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <el-button type="primary" icon="el-icon-upload" @click="imageCropperShow=true">
          更换头像
        </el-button>
        <image-cropper
          v-show="imageCropperShow"
          :key="imageCropperKey"
          :width="300"
          :height="300"
          :url="BASE_API+'/eduCos/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
import imageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { imageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: ''
      },
      saveBtnDisabled: false,
      imageCropperShow: false,
      imageCropperKey: 0,
      BASE_API: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.getInfo(this.$route.params.id)
    } else {
      this.teacher = {}
    }
  },
  methods: {
    getInfo(id) {
      teacher.getTeacherInfo(id)
        .then(response => {
          this.teacher.id = response.data.id
          this.teacher.name = response.data.name
          this.teacher.sort = response.data.sort
          this.teacher.level = response.data.level
          this.teacher.career = response.data.career
          this.teacher.intro = response.data.intro
          this.teacher.avatar = response.data.avatar
        })
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    saveData() {
      teacher.addTeacher(this.teacher)
        .then(() => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.$router.push({
            path: '/teacher/table' })
        })
    },
    updateData() {
      teacher.updateTeacher(this.teacher)
        .then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.$router.push({
            path: '/teacher/table' })
        })
    },
    close() {
      this.imageCropperShow = false
      this.imageCropperKey = this.imageCropperKey + 1
    },
    cropSuccess(data) {
      this.imageCropperShow = false
      this.imageCropperKey = this.imageCropperKey + 1
      this.teacher.avatar = data
    }
  }
}
</script>
