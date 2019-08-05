<template>
  <div class="moveBlock">

    <el-row v-if="flag()">
      <el-col :span="2">
        用户名
      </el-col>
      <el-col :span="4">
        <el-input v-model="info.username" placeholder="请输入用户名" ></el-input>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="2">
        密码
      </el-col>
      <el-col :span="4">
        <el-input v-model="info.password" placeholder="请输入密码" type="password"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        姓名
      </el-col>
      <el-col :span="4">
        <el-input v-model="info.name" placeholder="请输入姓名"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        手机
      </el-col>
      <el-col :span="4">
        <el-input v-model="info.phone" placeholder="请输入手机号"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        部门
      </el-col>
      <el-col :span="4">
        <el-input v-model="info.department" placeholder="请输入部门"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        角色
      </el-col>
      <el-col :span="4">
        <el-select v-model="info.role" placeholder="请选择角色">
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-button @click="cancel">取消</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-col>

    </el-row>
  </div>

</template>

<script>

  export default {

    data() {
      return {

        info: {
          username: '',
          password: '',
          phone: '',
          role: '',
          department: '',
          name: ''

        },
        options: [],
        flag(){
          if (sessionStorage.getItem('username')) {
            return true
          } else {
            return false
          }
        },

      }
    },
    beforeCreate(){
      this.token=sessionStorage.getItem('token');

      /*得到服务类型*/
      this.$axios.get({url:'/api/roles',token:this.token}).then((data) => {
        console.log('角色列表', data.data)
        if (data.data.success) {
          this.options = data.data.data;
        }
      })

      //console.log(this.$route,this.$router,)
    },
    methods: {
      open(a){
        this.$message(a);
      },
      cancel(){
        var info= {
          username: '',
            password: '',
            phone: '',
            role: '',
            department: '',
            name: ''

        }
        this.info=info;
      },
      onSubmit(e){
        e.preventDefault();
        if (!this.info.username) return this.$message('请输入用户名');
        if (!this.info.password) return this.$message('请输入密码');
        if (!this.info.name) return this.$message('请输入姓名');
        if (!this.info.role) return this.$message('请选择角色');
        /*if (!this.info.department) return this.$message('请输入部门');
        if (!this.info.phone) return this.$message('请输入手机');*/
        if(this.$route.hash=='#fromList'){
          this.$axios.put({url:`/api/users?username=${this.info.username}&roleId=${this.info.role}&password=${this.info.password}&realname=${this.info.name}&telephone=${this.info.phone}&department=${this.info.department}`,token:this.token}).then((res) => {
            console.log(this.info);
            console.log('用户', res.data);
            if (res.data.success) {
              this.open('修改成功')
            } else {
              this.open(res.data.errorMessage);
            }
          })

        }else {
          this.$axios.post({url:`/api/users?username=${this.info.username}&roleId=${this.info.role}&password=${this.info.password}&realname=${this.info.name}&telephone=${this.info.phone}&department=${this.info.department}`,token:this.token}).then((res) => {
            console.log(this.info);
            console.log('用户', res.data);
            if (res.data.success) {
              this.open('添加成功')
            } else {
              this.open(res.data.errorMessage);
            }
          })
        }


      },

    },

    mounted(){

      if(this.$route.hash=='#fromList'){
        let userInfo=JSON.parse(sessionStorage.getItem('userInfo'));
        console.log(userInfo)
        this.info= {
          ...userInfo,
          role:userInfo.role.type

        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .moveBlock {
    height: 626px;
  }
  .el-row{
    margin-top: 10px;
  }


</style>
