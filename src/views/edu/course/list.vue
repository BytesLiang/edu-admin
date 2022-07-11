<template>
  <div class="app-container">
    课程列表
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option value="1" label="已发布" />
          <el-option value="0" label="未发布" />
        </el-select>
      </el-form-item>

      <el-form-item label="课程分类">
        <el-select
          v-model="courseQuery.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseQuery.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.sort" clearable placeholder="排序方式">
          <el-option value="create" label="创建时间排序" />
          <el-option value="count" label="销售数量排序" />
          <el-option value="price" label="价格排序" />
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="date"
          placeholder="选择开始时间"
          style="width: 100%;"
        />
        <el-date-picker
          v-model="courseQuery.end"
          type="date"
          placeholder="选择截止时间"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80" />

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">{{ scope.row.status===true?'已发布':'未发布' }}</template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" />

      <el-table-column prop="price" label="销售价格" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="buyCount" label="销售数量" />

      <el-table-column prop="viewCount" label="浏览数量" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲息</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCourseBy(scope.row.id)"
          >删除课程信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'

export default {
  data() {
    return {
      list: null, // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      courseQuery: {}, // 条件封装对象
      subjectOneList: [], // 封装一级分类
      subjectTwoList: [] // 封装二级分类
    }
  },
  created() {
    this.getList()
    this.getOneSubject()
  },
  methods: {
    getList(page = 1) {
      this.page = page
      course.getCourseListPage(this.page, this.limit, this.courseQuery)
        .then(response => {
          this.list = response.data.rows
          this.total = response.data.total
        })
    },

    removeCourseBy(id) {
      this.$confirm('此操作将永久删除课程记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.removeCourse(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },

    resetData() {
      // 表单输入项数据清空
      this.courseQuery = {}
      this.getList()
    },

    // 点击某个一级分类，触发change，显示对应二级分类
    subjectLevelOneChanged(value) {
      // value就是一级分类id值
      // 遍历所有的分类，包含一级和二级
      for (var oneSubject of this.subjectOneList) {
        // 判断：所有一级分类id 和 点击一级分类id是否一样
        if (value === oneSubject.id) {
          // 从一级分类获取里面所有的二级分类
          this.subjectTwoList = oneSubject.children
          // 把二级分类id值清空
          this.courseInfo.subjectId = ''
        }
      }
    },
    // 查询所有的一级分类
    getOneSubject() {
      subject.getSubjectList().then(response => {
        this.subjectOneList = response.data
      })
    }
  }
}
</script>
