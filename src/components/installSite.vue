<template>
  <div>
    <el-row class="moveBlock">
      <el-col :span="24">
        <el-row class="topSearch">
          <el-col :span="3">
            <el-button class="addUser" @click="dialogVisible = true;">添加</el-button>
          </el-col>
          <el-col :span="5">
            <el-button class="addUser" @click="batchAddFlag=true">批量添加</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" height="500" border style="width: 100%">
          <el-table-column prop="num" label="序号" width="80"/>

          <el-table-column
            prop="code"
            label="位置编号"
            width="100"/>

          <el-table-column
            prop="name"
            label="位置名称"
          >
          </el-table-column>
          <el-table-column
            prop="longPowerName"
            label="是否长供电"
          >
          </el-table-column>

          <el-table-column
            label="操作"
          >
            <template scope="scope">

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

    <el-dialog title="添加位置" :visible.sync="dialogVisible" size="tiny" @close="close">
      <el-row>
        <el-col :span="6">
          位置编号
        </el-col>
        <el-col :span="18">
          <el-input v-model="form.code" auto-complete="off" type="number"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          位置名称
        </el-col>
        <el-col :span="18">
          <el-input v-model="form.name" auto-complete="off" type="text"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          是否长供电
        </el-col>
        <el-col :span="18">
          <template>
            <el-radio v-model="form.longPower" label="1">是</el-radio>
            <el-radio class="radio" v-model="form.longPower" label="2">否</el-radio>
          </template>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPosBtn">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量添加" :visible.sync="batchAddFlag" size="tiny">
      <el-row>
        <el-col :span="25">
          格式：
          每行一个位置，字段按顺序分别为：位置编号、位置名称、是否长供电（是或否），字段间用逗号（，）分隔。每一行用分号(；)结尾
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input v-model="batchAddText" auto-complete="off" type="textarea" :autosize="{ minRows: 4}"/>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="batchAddFlag = false">取 消</el-button>
        <el-button type="primary" @click="batchAddPosBtn">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="centerVisible"
      size="tiny"
      center>
      <span>确定要删除此条数据么？</span>
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
        /*queryParams: {
          roomCode: '',
          deviceType: '',
          complete: '',
          beginDate: '',
          endDate: '',
        },*/
        /*deviceTypes: [],*/
        tableData: [],
        dialogVisible: false,//添加弹窗
        batchAddFlag: false,//批量添加弹窗
        form: {
          code: '',
          name: '',
          longPower: '1'
        },
        batchAddText: '',
        centerVisible: false,//删除按钮弹窗
      }
    },
    methods: {

      close(){
        console.log(1)
        this.form = {
          code:'',
          name: '',
          longPower: '1',
        }
        this.edit=false;
      },
      handleEdit(a, b) {
console.log(b)
        this.edit=true;
        this.form = {
          code:b.code,
          name: b.name,
          longPower: b.longPower?'1':'2',
          id:b.id,
        }
        this.dialogVisible=true;
      },
      handleDelete(a, b) {
        this.id = b.id;
        this.centerVisible = true;

      },

      handleDeleteUser() {
        this.$axios.deleteInfo({
          url: `/api/positions?id=${this.id}`,
          token: this.token
        }).then(res => {
          console.log(res.data);
          if (res.data.success) {
            this.$message('删除成功！')
            this.centerVisible = false;
            this.getPosList()
          } else {
            this.$message('删除失败！')
          }
        })
      },

      addPosBtn() {
        if (!this.form.code) return this.$message('请输入位置编号')
        if (!this.form.name) return this.$message('请再次位置名称')

        if(this.edit){
           this.$axios.put({

             url: `/api/positions?code=${this.form.code}&name=${this.form.name}&longPower=${this.form.longPower==1?true:false}&id=${this.form.id}`,
             token: this.token
           }).then(res => {
             console.log(res.data);
             if (res.data.success) {
               this.$message('修改成功！')
               this.dialogVisible = false;
               this.getPosList()
             } else {
               this.$message('修改失败！')
             }

           })
         }else {
           this.$axios.post({
             url: `/api/positions?code=${this.form.code}&name=${this.form.name}&longPower=${this.form.longPower}`,
             token: this.token
           }).then(res => {
             console.log(res.data);
             if (res.data.success) {
               this.$message('添加成功！')
               this.dialogVisible = false;
               this.getPosList()
             } else {
               this.$message('添加失败！')
             }

           })
         }

      },
      batchAddPosBtn() {
        if (!this.batchAddText) return this.$message('请输入符合格式的文字');

        let ary = this.batchAddText.split(/(\; *)|(\； *)/)

        if (Array.isArray(ary) && ary.length) {
          let PArr = [];
          ary.forEach(item => {
            console.log(2, item)
            if (item) {
              let arr = item.split(/\,|\，/);
              console.log(3, arr)
              if (arr.length == 3) {
                console.log(arr)
                PArr.push(this.$axios.post({
                  url: `/api/positions?code=${arr[0]}&name=${arr[1]}&longPower=${arr[2] == '是' ? true : false}`,
                  token: this.token
                }))
              }
            }

          })

          if (PArr.length) {
            Promise.all(PArr).then(res => {
              let o = res.find(r => {
                return !r.data.success
              })
              if (!o) {
                this.$message('添加成功！')
                this.getPosList()
              }
            }).catch(e => {
              this.$message('添加失败！')
            })
            this.batchAddFlag = false;
          } else {
            this.$message('输入文字不符合格式！')
            this.batchAddFlag = false;
          }

        }

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
      this.getPosList = () => {
        this.$axios.get({url: '/api/positions', token: this.token}).then((res) => {
          console.log('位置列表', res.data)
          if (res.data.success && res.data.data) {
            this.tableData = res.data.data.map((item, i) => {
              return {
                num: i + 1,
                longPowerName: item.longPower ? '是' : '否',
                ...item
              }
            });

          } else {

          }
        })
      }
      this.getPosList();
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

  .addUser {
    margin-bottom: 20px;
  }
</style>
