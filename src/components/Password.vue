<template>
  <div class="moveBlock">
    <el-row v-if="flag()">
      <el-col :span="2">
        用户名
      </el-col>
      <el-col :span="4">
        <el-input v-model="password.username" placeholder="请输入新密码" type="password"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        原密码
      </el-col>
      <el-col :span="4">
        <el-input v-model="password.oldPsd" placeholder="请输入新密码" type="password"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        新密码
      </el-col>
      <el-col :span="4">
        <el-input v-model="password.newPsd" placeholder="请输入新密码" type="password"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        确认密码
      </el-col>
      <el-col :span="4">
        <el-input v-model="password.psd" placeholder="请确认新密码" type="password"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-button @click="onCancel">取消</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-col>

    </el-row>
  </div>

</template>

<script>
  //import ElRow from "element-ui/packages/row/src/row";
  export default {
    //components: {ElRow},
    data() {
      return {
        password: {
          newPsd: '',
          pad: '',
          oldPsd: '',
          username: ''
        },
        flag() {
          if (sessionStorage.getItem('username')) {
            return false
          } else {
            return true
          }
        },

      }
    },
    methods: {
      open(a) {
        this.$message(a);
      },
      onSubmit() {
        console.log(sessionStorage.getItem('userId'))
        if (this.password.oldPsd) {
          if (this.password.psd === this.password.newPsd) {
            this.$axios.put({
              url: `/api/account/password?userId=${sessionStorage.getItem('userId')}&password=${this.password.oldPsd}&newPassword=${this.password.newPsd}`,
              token: this.token
            })
              .then((data) => {
                if (data.data.success) {
                  this.open('修改成功')
                }
              })
          } else {
            this.open('两次输入的密码不一致')
          }
        } else {
          this.open('请输入原密码')
        }

      },
      onCancel() {
        this.password = {
          newPsd: '',
          psd: '',
          oldPsd: '',
        }
      },

      /* logout(){
         this.$router.push('/')
       }*/
    },
    beforeCreate() {
      this.token = sessionStorage.getItem('token');

    },
    mounted() {
      /*
       document.getElementsByClassName('left-block')[0].style.height=document.body.clientHeight+'px';
       window.onresize=function () {
       document.getElementsByClassName('left-block')[0].style.height=document.body.clientHeight+'px';
       }*/
      /* this.$axios.get('/api/api/main/rooms').then((data) => {
       console.log(data)
       })*/
      /* console.log(this.$route)*/
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .moveBlock {
    min-height: 626px;
  }

  .el-row {
    margin-top: 10px;
  }

</style>
