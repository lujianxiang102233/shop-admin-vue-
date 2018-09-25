<template>
    <el-container>
        <el-header>
            <div class="login"></div>
            <div class="loginout">
                <span>欢迎光临</span>
                <a href="javascript:;" @click="layout">退出</a>
            </div>
            <h2>电商后台管理系统..</h2>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu
                :default-active="$route.path.slice(1).split('-')[0]"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                unique-opened
                router
                active-text-color="#ffd04b">
                    <el-submenu :index="menus.path" v-for="menus in menusList" :key="menus.id">
                        <template slot="title">
                          <i class="el-icon-location"></i>
                          <span>{{menus.authName}}</span>
                        </template>
                        <el-menu-item :index="item.path" v-for="item in menus.children" :key="item.id"><i class="el-icon-menu"></i>{{item.authName}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main><router-view/></el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: []
    }
  },
  methods: {
    layout() {
      this.$confirm('你确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('./login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  async created() {
    console.log(this.$route.path)
    console.log(this.$router)
    let res = await this.axios.get(`menus`)
    let { meta: { status }, data } = res.data
    if (status === 200) {
      this.menusList = data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    .login {
      background: url(../assets/logo.png) no-repeat center center;
      height: 100%;
      float: left;
      width: 180px;
      background-size: contain;
    }
    .loginout {
      float: right;
      height: 100%;
      line-height: 60px;
      a {
        color: orange;
      }
    }
    h2 {
      color: #fff;
      line-height: 60px;
    }
  }
  .el-aside {
    background-color: rgb(84, 92, 100);
    .el-menu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
  }
}
</style>
