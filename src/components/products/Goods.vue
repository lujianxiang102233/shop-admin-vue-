<template>
  <div class="goods">
     <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
      <el-table
        :data="goodData"
        style="width: 100%">
        <el-table-column
          type="index"
          :index="indexMethod"
          width="50">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="180">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量">
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | time}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodData: [],
      query: '',
      current: 1,
      pagesize: 10,
      total: 1
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.current = 1
      this.getGoods()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getGoods()
    },
    async getGoods() {
      let res = await this.axios.get(`goods`, {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      //console.log(res.data)
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.goodData = data.goods
        this.total = data.total
      }
    },
    indexMethod(index) {
      return (this.current - 1) * this.pagesize + index + 1
    }
  },
  created() {
    this.getGoods()
  }
}
</script>

<style>
</style>
