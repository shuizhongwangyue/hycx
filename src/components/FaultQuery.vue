<template>
  <div>
    <el-row class="moveBlock">
      <el-col :span="24">
        <el-row class="topSearch">
          <el-col :span="24">
            <el-form :inline="true" :model="queryParams" class="demo-form-inline">
              <el-form-item label="时间段">
                <el-date-picker
                  v-model="beginDate"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions1">
                </el-date-picker>
                -
                <el-date-picker
                  v-model="endDate"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="故障类型">
                <el-select v-model="queryParams.deviceType" placeholder="请选择">
                  <el-option v-for="deviceType in deviceTypes" :label="deviceType.name" :value="deviceType.code"
                             :key="deviceType.code"></el-option>
                </el-select>
              </el-form-item>
              <br>
              <el-form-item label="房间号">
                <el-input placeholder="请输入房间号" v-model="queryParams.roomCode"></el-input>
              </el-form-item>
              <el-form-item label="故障状态">
                <el-select v-model="queryParams.complete" placeholder="请选择">
                  <el-option label="已消除" value="true"></el-option>
                  <el-option label="未消除" value="false"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="exportServiceQuery" size="small">导出</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table :data="tableData" height="500" border style="width: 100%">
          <el-table-column prop="num" label="序号" width="80"></el-table-column>
          <el-table-column
            prop="roomCode"
            label="房间号"
            width="100">
          </el-table-column>

          <el-table-column
            prop="deviceType"
            label="故障类型"
            width="150">
          </el-table-column>
          <el-table-column
            prop="fixed"
            label="状态"
            width="100">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="请求时间">
          </el-table-column>
          <el-table-column
            prop="fixTime"
            label="消除时间">
          </el-table-column>
        </el-table>
      </el-col>

    </el-row>
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
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now() + 1.64e7;
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        tableData: [],
      }
    },
    methods: {
      /*查询*/
      onSubmit(e){
        e.preventDefault();
        /*时间格式化*/
        function add(c) {
          if (c >= 10) {
            return c
          } else if (c < 10 && c.substr(0, 1) == 0) {
            return c
          } else {
            return '0' + c
          }
        }

        var formatDate = (a) => {
          var ary = new Date(a).toLocaleDateString().split('/');
          ary = ary.map(function (item) {
            return add(item);
          })
          return ary.join('')
        }
        if (this.beginDate) {
          this.queryParams.beginDate = formatDate(this.beginDate);
        }
        if (this.endDate) {
          this.queryParams.endDate = formatDate(this.endDate);
        }

        /*请求*/
        console.log('故障查询参数', this.queryParams)
        this.$axios.get({url:'/api/faults/list',token:this.token}, {...this.queryParams}).then((data) => {
            let _this=this;
          console.log('故障', data)
          this.queryFn = (data) => {
            if (data.data.success) {
              var dataList = data.data.list;
              if (dataList.length) {
                dataList = dataList.map(function (item, i) {
                  let a = null;
                  for (let ii = 0; ii < _this.deviceTypes.length; ii++) {
                      if(_this.deviceTypes[ii].code==item.deviceType){
                        a= _this.deviceTypes[ii].name;
                      }
                  }
                  return {
                    num: i + 1,
                    roomCode: item.roomCode,
                    fixed: item.fixed ? '已完成' : '未完成',
                    deviceType:a,
                    fixTime: item.fixTime ? new Date(item.fixTime).toLocaleString() : '',
                    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : ''
                  }
                  //item.deviceType=='4'?'红外':item.deviceType=='6'?'单联开关':item.deviceType=='11'?'温湿度节点':item.deviceType=='18'?'通断型空调控制器':item.deviceType=='41'?'客房状态控制器':item.deviceType=='43'?'插卡取电控制器':'没有的故障类型'


                })
                this.tableData = dataList;
              } else {
                this.tableData = []
              }

            }
          }
          this.queryFn(data);


        });
      },
      /*以下三个函数全是输出ex表格*/
      exportServiceQuery(){
        if(!this.tableData.length)return this.$message('没有要导出的数据');

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
    beforeCreate(){
      this.token=sessionStorage.getItem('token');


    },
    mounted(){

      let config=JSON.parse(localStorage.getItem('config'));
      this.deviceTypes = config.deviceTypes
    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>

</style>
