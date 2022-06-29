<template>
  <div class="app-container">
    <!-- 显示讲师 -->
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item label="讲师名称">
        <el-input v-model="teacherQuery.name" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacherQuery.level" clearable placeholder="头衔">
          <el-option label="高级讲师" value="1" />
          <el-option label="首席讲师" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="date"
          placeholder="选择开始时间"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="date"
          placeholder="选择截止时间"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetDate()">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      stripe
      fit
      style="width: 100%"
      loading
      border
      highlight-current-row
    >
      <el-table-column prop="id" label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="80" />
      <el-table-column prop="level" label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? "高级讲师" : "首席讲师" }}
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="joinDate" label="入驻时间" width="160" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDate(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
export default {
  data() {
    return {
      list: null,
      total: 0,
      page: 1,
      limit: 3,
      teacherQuery: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(page = 1) {
      this.page = page
      teacher
        .getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then((response) => {
          this.list = response.data.rows
          this.total = response.data.total
        })
        .catch((error) => {
          console.log(error)
        })
    },
    resetDate() {
      this.teacherQuery = {}
      this.getList()
    },
    removeDate(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          teacher.removeTeacher(id)
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
