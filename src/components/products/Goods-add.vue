<template>
  <div class="goods-add">
    <el-steps :active="active">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2"  description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" style="height: 430px;" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="first">
      <el-form  label-width="80px" :model="form">
      <el-form-item label="商品名称">
        <el-input v-model="form.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="form.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品重量">
        <el-input v-model="form.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品数量">
        <el-input v-model="form.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类">
          <el-cascader
            clearable
            :props="props"
            :options="options"
            v-model="form.goods_cat">
          </el-cascader>
      </el-form-item>
      <el-form-item label="是否促销">
        <el-radio v-model="form.is_promote" :label="true">是</el-radio>
        <el-radio v-model="form.is_promote" :label="false">否</el-radio>
      </el-form-item>
    </el-form>
     <el-button type="primary" @click="next(1,'second')">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="second">
      <el-upload
      class="upload-demo"
      action="http://localhost:8888/api/private/v1/upload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :headers="headers"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
     <el-button type="primary" @click="next(2,'three')">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="three">
        <quill-editor v-model="form.goods_introduce"
                ref="myQuillEditor">
        </quill-editor>
       <el-button type="primary" @click="addClick">确定</el-button>
    </el-tab-pane>
  </el-tabs>
     <!-- <el-button type="primary" @click="next">下一步</el-button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'first',
      form: {
        goods_cat: [],
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        is_promote: false,
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: { Authorization: localStorage.getItem('token') }
    }
  },
  methods: {
    next(active, name) {
      this.active = active
      this.activeName = name
    },
    handleClick(tab) {
      this.active = +tab.index
    },
    handleRemove(file) {
      let { meta: { status }, data: { tmp } } = file.response
      if (status === 200) {
        let idx = this.form.pics.findIndex(item => item.tmp_path === tmp)
        this.form.pics.splice(idx, 1)
        this.$message.success('删除图片成功')
      } else {
        this.$message.error('删除图片失败')
      }
    },
    handleSuccess(file) {
      let { meta: { status }, data } = file
      if (status === 200) {
        this.form.pics.push(data)
      }
    },
    async addClick() {
      let res = await this.axios.post(`goods`, {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      let { meta: { status }, data } = res.data
      if (status === 201) {
        this.$router.push('/goods')
        this.$message.success('添加成功')
      } else {
        this.$message.error('添加失败')
      }
    }
  },
  async created() {
    let res = await this.axios.get(`categories?type=3`)
    let { meta: { status }, data } = res.data
    if (status === 200) {
      this.options = data
    } else {
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-top: 10px;
}
.quill-editor {
  background-color: #fff;
  /deep/ .ql-container {
    height: 300px;
  }
}
</style>
