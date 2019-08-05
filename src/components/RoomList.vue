<template>
  <div>
    <el-row class="moveBlock">
      <el-col :span="24">
        <el-row class="topSearch">
          <el-col :span="24">
            <el-form :inline="true" :model="queryParams" class="demo-form-inline">
              <el-form-item label="区域">
                <el-select v-model="queryParams.areaId" placeholder="请选择区域" clearable>
                  <el-option v-for="area in areaList" :label="area.name" :value="area.id"
                             :key="area.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="房间号">
                <el-input v-model="queryParams.roomCode" placeholder="请输入房间号"></el-input>
              </el-form-item>
              <el-form-item label="网关状态">
                <el-select v-model="queryParams.online" placeholder="请选择" clearable>
                  <el-option label="联机" :value="true"/>
                  <el-option label="脱机" :value="false"/>
                </el-select>
              </el-form-item>
              <el-form-item label="网关">
                <el-input v-model="queryParams.gateCode" placeholder="请输入网关"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="query" size="small" :loading="loading">查询</el-button>
              </el-form-item>

            </el-form>
            <el-button class="addUser" @click="addRoom" v-if="showAddRoom">添加客房</el-button>
          </el-col>
        </el-row>
        <!-- <el-row class="topSearch">
           <el-col :span="3">
             <el-button class="addUser" @click="dialogVisible = true;">添加</el-button>
           </el-col>
           <el-col :span="5">
             <el-button class="addUser" @click="batchAddFlag=true">批量添加</el-button>
           </el-col>
         </el-row>-->
        <el-table :data="tableData" height="500" border style="width: 100%">
          <el-table-column prop="num" label="序号" width="80"/>

          <el-table-column
            prop="areaName"
            label="区域"
          />

          <el-table-column
            prop="code"
            label="房号"
            width="100"
          />

          <el-table-column
            prop="gateCode"
            label="网关"
          />
          <el-table-column
            prop="gateWayReachableName"
            label="网关状态"
          />


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

    <!--<el-dialog title="添加位置" :visible.sync="dialogVisible" size="tiny" @close="close">
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
    </el-dialog>-->


    <el-dialog
      title="提示"
      :visible.sync="centerVisible"
      size="tiny"
      center>
      <span>确定要删除此条数据么？</span>
      <span slot="footer" class="dialog-footer">
         <el-button @click="centerVisible = false">取 消</el-button>
         <el-button type="primary" @click="deleteRoom">确 定</el-button>
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
          gateCode: '',
          areaId: '',
          online: '',
        },
        areaList: [],
        tableData: [],

        /* form: {
           code: '',
           name: '',
           longPower: '1'
         },
         batchAddText: '',*/
        loading: false,
        centerVisible: false,//删除按钮弹窗
        showAddRoom:false,
        /* dialogVisible: false,//添加弹窗
         batchAddFlag: false,//批量添加弹窗*/
      }
    },
    methods: {
      query() {
        console.log(this.queryParams);
        let url = `/api/rooms`;
        let fn = (url) => {
          if (url.includes('?')) {
            url += '&'
          } else {
            url += '?'
          }
          return url
        }
        if (this.queryParams.roomCode) {
          url = fn(url) + 'roomCode=' + this.queryParams.roomCode
        }
        if (this.queryParams.online===true||this.queryParams.online===false) {
          url = fn(url) + 'online=' + this.queryParams.online
        }
        if (this.queryParams.gateCode) {
          url = fn(url) + 'gateCode=' + this.queryParams.gateCode
        }
        if (this.queryParams.areaId) {
          url = fn(url) + 'areaId=' + this.queryParams.areaId
        }
        this.loading=true;
        this.getRoomList(url)
      },
      addRoom() {
        this.$router.push('/home/roomInput');
      },

      handleEdit(a, b) {
        for (let key in b) {
          if (b[key] == undefined || b[key] == null) {
            b[key] = ''
          }
        }
        this.$router.push({
          path: '/home/roomInput',
          query: {
            id: b.id,
            saleState: b.saleState,
            gateCode: b.gateCode,
            areaName: b.areaName,
            gateWayReachable: b.gateWayReachable,
            code: b.code
          }
        });
      },
      handleDelete(a, b) {
        this.id = b.id;
        this.centerVisible = true;
      },

      deleteRoom() {
        this.$axios.deleteInfo({
          url: `/api/room?id=${this.id}`,
          token: this.token
        }).then(res => {
          console.log(res.data);
          if (res.data.success) {
            this.$message('删除成功！')
            this.centerVisible = false;
            this.getRoomList('/api/rooms')
          } else {
            this.$message('删除失败！')
          }
        })
      },

      /*addPosBtn() {
        if (!this.form.code) return this.$message('请输入位置编号')
        if (!this.form.name) return this.$message('请再次位置名称')

        if (this.edit) {
          this.$axios.put({

            url: `/api/positions?code=${this.form.code}&name=${this.form.name}&longPower=${this.form.longPower == 1 ? true : false}&id=${this.form.id}`,
            token: this.token
          }).then(res => {
            console.log(res.data);
            if (res.data.success) {
              this.$message('修改成功！')
              this.dialogVisible = false;
              this.getRoomList()
            } else {
              this.$message('修改失败！')
            }

          })
        } else {
          this.$axios.post({
            url: `/api/positions?code=${this.form.code}&name=${this.form.name}&longPower=${this.form.longPower}`,
            token: this.token
          }).then(res => {
            console.log(res.data);
            if (res.data.success) {
              this.$message('添加成功！')
              this.dialogVisible = false;
              this.getRoomList()
            } else {
              this.$message('添加失败！')
            }

          })
        }

      },*/
      /* batchAddPosBtn() {
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
                 this.getRoomList()
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

       },*/

    },


    beforeCreate() {
      this.token = sessionStorage.getItem('token');
      let url = '/api/rooms'
      this.getRoomList = (url) => {
        this.$axios.get({url, token: this.token}).then((res) => {
          console.log('房间列表', res.data.list)
          this.loading=false;
          if (res.data.success && res.data.list) {
            this.tableData = res.data.list.map((item, i) => {
              return {
                num: i + 1,
                ...item,
                gateWayReachableName: item.gateWayReachable ? '联机' : '脱机'

              }
            });

          } else {
            this.$message('')
          }
        }).catch(err=>{
          this.loading=false;
        })
      }
      this.getRoomList(url);
      /*区域列表*/
      this.$axios.get({url: '/api/areas', token: this.token}).then((res) => {
        console.log('区域信息', res)
        if (res.data.success) {
          this.areaList = res.data.data;

        }

      });
    },
    mounted() {
      /*得到类型*/
      let config = JSON.parse(localStorage.getItem('config'));
      this.saleStates = config.saleStates;
      this.deviceTypes = config.deviceTypes
      // console.log(config)
      if(sessionStorage.getItem('role')=='admin'){
        this.showAddRoom=true;
      }
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
