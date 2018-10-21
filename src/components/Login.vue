<template>
  <div class="login">
    <el-form :model="form" ref="ruleForm" label-width="100px" class="demo-ruleForm" status-icon :rules="rules">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录1</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    login() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.form
          }).then(res => {
            console.log(1234)
            if (res.data.meta.status === 400) {
              this.$message.error('用户名或者密码错误')
            }
            if (res.data.meta.status === 200) {
              this.$message.success('登录成功')
              localStorage.setItem('token', res.data.data.token)
              this.$router.push('/')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.login {
  background-color: #2d434c;
  height: 100%;
  overflow: hidden;
  .el-form {
    margin: 200px auto;
    width: 400px;
    background-color: #fff;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
    img {
      border-radius: 50%;
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      border: 10px solid #fff;
    }
    .el-button + .el-button {
      margin-left: 90px;
    }
  }
}
</style>
