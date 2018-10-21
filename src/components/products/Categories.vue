<template>
  <div class="categories">
    <el-button type="success" plain @click="showAdd">增加分类</el-button>
    <template>
      <el-table
        v-loading="loading"
        :data="proList"
        style="width: 100%">
        <el-table-tree-column
         tree-key="cat_id"
         level-key="cat_level"
         parent-key="cat_pid"
         :indent-size="20"
          prop="cat_name"
          :expand-all="true"
          label="分类名称">
        </el-table-tree-column>
        <el-table-column
          prop="cat_deleted"
          label="是否删除">
          <template slot-scope="scope">
            {{scope.row.cat_deleted?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_level"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" plain ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" plain ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
    </el-pagination>

    <!-- 添加分类 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form ref="addForm" :model="addForm"  label-width="80px" :rules="rules" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            :options="options"
            :props="props"
            v-model="addForm.cat_pid"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPro">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let ElTreeGrid = require('element-tree-grid')
export default {
  data() {
    return {
      proList: [],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      loading: true,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.loading = true
      this.pageSize = val
      this.currentPage = 1
      this.getProList()
    },
    handleCurrentChange(val) {
      this.loading = true
      this.currentPage = val
      this.getProList()
    },
    async getProList() {
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.total = data.total
        this.proList = data.result
        this.loading = false
        console.log(this.proList)
      }
    },
    async showAdd() {
      this.addDialogVisible = true
      let res = await this.axios.get(`categories`, {
        params: {
          type: 2
        }
      })
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    addPro() {
      this.$refs.addForm.validate(async valid => {
        let { cat_name: catName, cat_pid: catPid } = this.addForm
        if (valid) {
          let res = await this.axios.post(`categories`, {
            cat_pid: catPid[catPid.length - 1],
            cat_name: catName,
            cat_level: catPid.length
          })
          let { meta: { status } } = res.data
          if (status === 201) {
            this.addDialogVisible = false
            this.getProList()
            this.$refs.addForm.resetFields()
            this.$message.success('添加分类成功')
          } else {
            this.$message.error('添加分类失败')
          }
        } else {
          return false
        }
      })
    }
  },
  components: {
    'el-table-tree-column': ElTreeGrid
  },
  created() {
    this.getProList()
  }
}
</script>

<style>
</style>
