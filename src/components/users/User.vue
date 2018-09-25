<template>
    <div class="user">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>    
      <div class="search">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button type="success" plain @click="add">用户添加</el-button>
      </div>  
        <el-table
        :data="tableData"
        style="width: 100%">
          <el-table-column
              prop="username"
              label="姓名"
              width="150">
          </el-table-column>
          <el-table-column
              prop="email"
              label="邮箱"
              width="160">
          </el-table-column>
          <el-table-column
              prop="mobile"
              width="160"
              label="电话">
          </el-table-column>
          <el-table-column
              label="用户状态" width="160">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949" @change="changeStatus(scope.row)">
                </el-switch>
              </template>
          </el-table-column> 
          <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" plain @click="edit(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" plain @click="del(scope.row)"></el-button>
                <el-button type="success" icon="el-icon-check" size="small" plain @click="assign(scope.row)">分配角色</el-button>
              </template>
          </el-table-column>   
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageCurrent"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <!-- 修改用户 -->
        <el-dialog
          title="修改用户"
          :visible.sync="editDialogVisible"
          width="40%">
          <el-form label-width="60px" :model="editForm" :rules="rules" status-icon ref="editForm">
            <el-form-item label="用户名">
              <el-tag type="info">{{editForm.name}}</el-tag>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="editClick">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 添加用户 -->
        <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="40%">
          <el-form label-width="80px" :model="addForm" :rules="rules" status-icon ref="addForm">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="addClick">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 分配角色 -->
        <el-dialog
        title="分配角色"
        :visible.sync="assignDialogVisible"
        width="40%">
        <el-form label-width="80px" :model="assignForm">
          <el-form-item label="用户名">
            <el-tag type="info">{{assignForm.username}}</el-tag>
          </el-form-item>
            <el-form-item label="角色列表">
            <el-select v-model="assignForm.rid" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="assignRole">确 定</el-button>
        </span>
      </el-dialog>  
      
    </div>
</template>

<script>
// import axios from 'axios'
export default {
  data() {
    return {
      active: '/user',
      tableData: [],
      query: '',
      pageCurrent: 1,
      pagesize: 2,
      total: 1,
      editDialogVisible: false,
      labelPosition: 'left',
      editForm: {
        name: '',
        email: '',
        mobile: '',
        id: ''
      },
      rules: {
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ],
        username: [
          { required: true, message: '请输入用户名称', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      },
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      assignDialogVisible: false,
      assignForm: {
        id: '',
        username: '',
        rid: ''
      },
      options: []
    }
  },
  created() {
    this.getPage()
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.pageCurrent = 1
      this.getPage()
    },
    handleCurrentChange(val) {
      this.pageCurrent = val
      this.getPage()
    },
    getPage() {
      this.axios({
        url: '/users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.pageCurrent,
          pagesize: this.pagesize
        }
      }).then(res => {
        if (res.data.meta.status === 200) {
          this.tableData = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    search() {
      this.getPage()
    },
    changeStatus(val) {
      let { mg_state, id } = val
      this.axios({
        method: 'put',
        url: `/users/${id}/state/${mg_state}`
      }).then(res => {
        let { meta: { status } } = res.data
        if (status === 200) {
          this.$message.success('恭喜你，修改状态成功')
        } else {
          this.$message.error('修改状态失败')
        }
      })
    },
    edit(row) {
      this.editDialogVisible = true
      this.editForm.name = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    editClick() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.axios
            .put(`users/${this.editForm.id}`, {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            })
            .then(res => {
              //console.log(res.data)
              let { meta: { status } } = res.data
              if (status === 200) {
                this.editDialogVisible = false
                this.getPage()
                this.editForm.name = ''
                this.editForm.email = ''
                this.editForm.mobile = ''
                this.editForm.id = ''
              }
            })
        } else {
          return false
        }
      })
    },
    add() {
      this.addDialogVisible = true
    },
    addClick() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.axios.post('users', this.addForm).then(res => {
            let { meta: { status } } = res.data
            if (status === 201) {
              this.$message.success('恭喜你，添加用户成功了')
              this.$refs.addForm.resetFields()
              this.addDialogVisible = false
              this.total++
              this.pageCurrent = Math.ceil(this.total / this.pagesize)
              this.getPage()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    del(row) {
      this.$confirm('亲，确定要删除这个用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row)
          this.axios.delete(`users/${row.id}`).then(res => {
            this.$message.success('恭喜你删除成功')
            this.getPage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async assign(row) {
      this.assignDialogVisible = true
      this.assignForm.id = row.id
      this.assignForm.username = row.username
      let res = await this.axios.get(`users/${row.id}`)
      let { meta: { status }, data } = res.data
      if (status === 200) {
        if (data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = data.rid
        }
      }
      let res1 = await this.axios.get(`roles`)

      if (res1.data.meta.status === 200) {
        this.options = res1.data.data
      }
    },
    async assignRole() {
      let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      let { meta: { status } } = res.data
      if (status === 200) {
        this.assignDialogVisible = false
        this.$message.success('分配角色成功')
        this.getPage()
      } else {
        this.$message.error('分配角色失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  .search {
    text-align: left;
    margin-bottom: 10px;
    .input-with-select {
      width: 250px;
    }
  }
  .el-table {
    text-align: left;
  }
  .el-pagination {
    text-align: left;
  }
}
</style>
