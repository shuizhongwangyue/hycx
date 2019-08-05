<template>
  <div>
    <el-row class="moveBlock">
      <el-col :span="24">
        <el-row class="topSearch">
          <el-col :span="24">
            <el-button class="addUser" @click="clickAddUser">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" height="500" border style="width: 100%">
          <el-table-column prop="num" label="序号" width="80"></el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            width="100">
          </el-table-column>

          <el-table-column
            prop="roleName"
            label="角色"
            width="100">
          </el-table-column>
          <el-table-column
            prop="realname"
            label="姓名"
            width="100">
          </el-table-column>

          <el-table-column
            prop="telephone"
            label="手机">
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门">
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
          >
            <template scope="scope">
              <el-button
                size="small"
                @click="changePassword(scope.$index, scope.row)">修改密码
              </el-button>
              <el-button
                size="small"
                type=""
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="修改密码" :visible.sync="dialogVisible"  size="tiny">

      <el-row>
        <el-col :span="6">
          新密码
        </el-col>
        <el-col :span="18">
          <el-input v-model="form.password" auto-complete="off" type="password"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          确认新密码
        </el-col>
        <el-col :span="18">
          <el-input v-model="form.password1" auto-complete="off" type="password"/>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickChangePasswordBtn">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="centerVisible"
      size="tiny"
      center>
      <span>确定要删除此用户么？</span>
      <span slot="footer" class="dialog-footer">
         <el-button @click="centerVisible = false">取 消</el-button>
         <el-button type="primary" @click="handleDeleteUser">确 定</el-button>
       </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {

    data() {
      return {
        queryParams: {
          roomCode: '',
          deviceType: '',
          complete: '',
          beginDate: '',
          endDate: '',
        },
        beginDate: '',
        endDate: '',
        deviceTypes: [],
        tableData: [],
        dialogVisible: false,//弹窗
        form: {},
        centerVisible: false,//删除按钮弹窗
      }
    },
    methods: {
      clickAddUser(){
        this.$router.push('/home/user')
      },
      handleEdit(a, b) {
        console.log(this.$route, this.$router)
        console.log(a, b)
        sessionStorage.setItem('userInfo',JSON.stringify(b));
        this.$router.push('/home/user#fromList')
      },
      handleDelete(a, b) {
        this.userId = b.id;
        this.centerVisible = true;

      },
      handleDeleteUser(){
        this.$axios.deleteInfo({
          url: `/api/users?userId=${this.userId}`,
          token: this.token
        }).then(res => {
          console.log(res.data);
          if (res.data.success) {
            this.$message('删除成功！')
            this.centerVisible = false;
            this.getUser();
          } else {
            this.$message('删除失败！')
          }
        })
      },
      changePassword(a, b) {
        console.log(a, b)
        this.id = b.id;
        this.dialogVisible = true;

      },
      clickChangePasswordBtn() {
        if (!this.form.password) return this.$message('请输入新密码')
        if (!this.form.password1) return this.$message('请再次新密码')
        if (this.form.password1 != this.form.password) return this.$message('两次输入的密码不一样');
        this.$axios.put({
          url: `/api/users/password?userId=${this.id}&password=${this.form.password}`,
          token: this.token
        }).then(res => {
          console.log(res.data);
          if (res.data.success) {
            this.$message('修改成功！')
            this.dialogVisible = false;
          } else {
            this.$message('修改失败！')
          }

        })
      },
      /*以下三个函数全是输出ex表格*/
      exportServiceQuery() {
        this.export2Excel()
      },
      export2Excel() {
        require.ensure([], () => {
          const {export_json_to_excel} = require('../vendor/Export2Excel');
          const tHeader = ['序号', '房间号', '故障类型', '状态', '请求时间', '消除时间'];
          const filterVal = ['num', 'roomCode', 'deviceType', 'fixed', 'createTime', 'fixTime'];
          const list = this.tableData;
          /*表格内容*/
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '故障查询excel');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    },


    beforeCreate() {
      this.token = sessionStorage.getItem('token');
      this.getUser=()=>{
        this.$axios.get({url: '/api/users', token: this.token}).then((res) => {
          console.log('用户列表', res.data)
          if (res.data.success) {
            this.tableData = res.data.data.map((item, i) => {
              return {
                num: i + 1,

                roleName: item.role ? item.role.name : '',
                /*username: item.username,
                realname: item.realname,
                department: item.department,
                telephone: item.telephone,
                id: item.id,*/
                ...item
              }
            });
          }
        })
      }
      this.getUser();
    },
    mounted() {
      /*得到类型*/
      let config = JSON.parse(localStorage.getItem('config'));
      this.saleStates = config.saleStates;
      this.deviceTypes = config.deviceTypes
      console.log(config)
    },

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .moveBlock {
    min-height: 646px;
  }
  .el-row {
    margin-top: 10px;
  }
  .addUser{
    margin-bottom: 20px;
  }
</style>
