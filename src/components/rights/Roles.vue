<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-button type="success" plain @click="addDialogVisible=true">添加角色</el-button>
    <!-- 表格 -->
      <template>
        <el-table
        :data="rolesList"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row v-if="scope.row.children.length === 0"><span>没有权限</span></el-row>
              <!-- 一级权限 -->
              <el-row v-for="level1 in scope.row.children" :key="level1.id" class="level1">
               <el-col :span="4"><el-tag closable @close="handleClose(scope.row,level1.id)">{{level1.authName}}</el-tag><i class="el-icon-arrow-right"></i></el-col>
               <el-col :span="20">
                 <!-- 二级权限 -->
                 <el-row v-for="level2 in level1.children" :key="level2.id" class="level2">
                   <el-col :span="4"><el-tag type="success" closable>{{level2.authName}}</el-tag><i class="el-icon-arrow-right"></i></el-col>
                   <el-col :span="20">
                     <!-- 三级权限 -->
                    <el-tag v-for="level3 in level2.children" :key="level3.id" type="warning" class="level3" closable>{{level3.authName}}</el-tag>
                   </el-col>
                 </el-row>
               </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="角色名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="roleDesc"
            label="描述"
            width="180">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" plain @click="edit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" plain @click="del(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-check" size="small" plain @click="fproles(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
        </el-table>
    </template>


    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
      >
      <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="addForm" ref="addForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色 -->
      <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%"
      >
      <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="editForm" ref="editForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
      <el-dialog
      title="修改角色"
      :visible.sync="fpDialogVisible"
      width="40%"
      @closed="clearRight"
      >
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fpDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      labelPosition: 'left',
      addForm: {},
      rules: {
        roleName: [
          { required: true, message: '请输入角色的名称', trigger: 'change' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      fpDialogVisible: false,
      roleId: ''
    }
  },
  methods: {
    async getList() {
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.rolesList = res.data.data
      }
    },
    async del(row) {
      //console.log(row)
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${row.id}`)
        let { meta: { status } } = res.data
        if (status === 200) {
          this.$message.success('恭喜你，删除成功')
          this.getList()
        } else {
          this.$message.error('删除角色失败')
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    },
    addRoles() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          await this.axios.post(`roles`, this.addForm)
          // console.log(res.data)
          this.getList()
          this.$message.success('恭喜你，添加用户成功')
          this.$refs.addForm.resetFields()
          // this.addForm = {}
          this.addDialogVisible = false
        } else {
          return false
        }
      })
    },
    edit(row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    async editRoles() {
      let res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
      //console.log(res)
      let { meta: { status } } = res.data
      if (status === 200) {
        this.editDialogVisible = false
        this.getList()
        this.$refs.editForm.resetFields()
        this.$message.success('修改角色成功')
      } else {
        this.$message.error('修改角色失败')
      }
    },
    async fproles(row) {
      this.roleId = row.id
      this.fpDialogVisible = true
      let res = await this.axios.get(`rights/tree`)
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.rightList = data
      }
      let temp = []
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            temp.push(level3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(temp)
    },
    clearRight() {
      this.$refs.tree.setCheckedKeys([])
    },
    async handleClose(row, id) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${id}`)
      let { meta: { status }, data } = res.data
      if (status === 200) {
        row.children = data
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败')
      }
    },
    async assignRight() {
      let keys = this.$refs.tree.getCheckedKeys()
      let halfKeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = keys.concat(halfKeys).join()
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      console.log(res.data)
      let { meta: { status } } = res.data
      if (status === 200) {
        this.fpDialogVisible = false
        this.$message.success('修改权限成功')
        this.getList()
      } else {
        this.message.error('修改权限失败')
      }
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style  lang="less" scoped>
.level1 {
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
}
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin: 0px 5px;
}
</style>
