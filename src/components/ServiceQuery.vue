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
              <el-form-item label="服务">
                <el-select v-model="queryParams.serveType" placeholder="请选择">
                  <el-option v-for="service in serveTypes" :label="service.name" :value="service.code"
                             :key="service.code"></el-option>
                </el-select>
              </el-form-item>
              <br>
              <el-form-item label="房间号">
                <el-input placeholder="请输入房间号" v-model="queryParams.roomCode"></el-input>
              </el-form-item>
              <el-form-item label="完成状态">
                <el-select v-model="queryParams.complete" placeholder="请选择">
                  <el-option label="已完成" value="1"></el-option>
                  <el-option label="未完成" value="0"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit"  size="small">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="exportServiceQuery"  size="small">导出</el-button>
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
            prop="serveType"
            label="服务类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="complete"
            label="状态"
            width="100">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="请求时间">
          </el-table-column>
          <el-table-column
            prop="completeTime"
            label="完成时间">
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
          serveType: '',
          complete: '',
          beginDate: '',
          endDate: '',
        },
        beginDate: '',
        endDate: '',
        serveTypes: [],
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
        /*格式化时间*/
        var formatDate = (a) => {
          function add(c) {
            if (c >= 10) {
              return c
            } else if (c < 10 && c.substr(0, 1) == 0) {
              return c
            } else {
              return '0' + c
            }
          }

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

        /*查询请求*/
        this.$axios.get({url:'/api/serves/list',token:this.token}, {...this.queryParams}).then((data) => {
          console.log('服务查询数据', data)
          this.queryFn = (data) => {
            if (data.data.success) {
              var dataList = data.data.list;
              if (dataList.length) {
                dataList = dataList.map(function (item, i) {
//                  var saleState='';
//                  for (let n = 0; n < this.saleStates.length; n++) {
//                    item.saleState==this.saleStates[n].code?saleState=this.saleStates[n].name:null;
//                  }
                  return {
                    num: i + 1,
                    roomCode: item.roomCode,
                    complete: item.complete? '已完成' : '未完成',
                    serveType: item.serveType == '2' ? '清扫' : '送水',
                    completeTime: new Date(item.completeTime).toLocaleString(),
                    createTime: new Date(item.createTime).toLocaleString()
                  }
                })
                this.tableData = dataList;
              } else {
                this.tableData = [];
              }
              this.$message({
                showClose: true,
                message: `查询到${dataList.length}条数据`,
                type: 'success'
              });
            }else {
              this.$message({
                showClose: true,
                message: '查询失败',
                type: 'error'
              });
            }
          }
          this.queryFn(data);
          console.log(this.tableData)
        });
      },

      exportServiceQuery(){
        if(!this.tableData.length)return this.$message('没有要导出的数据');
        this.export2Excel()
      },
      export2Excel() {
        require.ensure([], () => {
          const {export_json_to_excel} = require('../vendor/Export2Excel');
          const tHeader = ['序号', '房间号', '服务类型', '状态', '请求时间', '完成时间'];
          const filterVal = ['num', 'roomCode', 'serveType', 'complete', 'createTime', 'completeTime'];
          const list = this.tableData;
          /*表格内容*/
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '服务查询excel');
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
      /*得到服务类型*/
      let config=JSON.parse(localStorage.getItem('config'));
      this.serveTypes = config.serveTypes

    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>

</style>
