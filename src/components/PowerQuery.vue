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
                  placeholder="选择开始日期"
                  :picker-options="pickerOptions1">
                </el-date-picker>
                -
                <el-date-picker
                  v-model="endDate"
                  align="right"
                  type="date"
                  placeholder="选择结束日期"
                  :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>

              <el-form-item label="房间号">
                <el-input placeholder="请输入房间号" v-model="queryParams.roomCode"></el-input>
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
            prop="powerOn"
            label="状态"
            width="100">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="时间">
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
          beginDate: '',
          endDate: '',
        },
        beginDate: '',
        endDate: '',
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
        if(this.beginDate){
          this.queryParams.beginDate = formatDate(this.beginDate);
        }
       if(this.endDate){
         this.queryParams.endDate = formatDate(this.endDate);
       }

        /*查询请求*/
        this.$axios.get({url:'/api/powers/list',token:this.token}, {...this.queryParams}).then((data) => {
          console.log('q䒑',data);
          this.queryFn = (data) => {
            if (data.data.success) {
              var dataList = data.data.list;
              if (dataList.length) {
                dataList = dataList.map(function (item, i) {
                  return {
                    num: i + 1,
                    roomCode: item.roomCode,
                    powerOn:item.powerOn?'取电':'断电',
                    createTime:new Date(item.createTime).toLocaleString()
                  }
                })
                this.tableData = dataList;
              }else {
                this.tableData = [];
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
          const { export_json_to_excel } = require('../vendor/Export2Excel');
          const tHeader = ['序号', '房间号', '状态', '时间'];
          const filterVal = ['num', 'roomCode', 'powerOn', 'createTime'];
          const list = this.tableData;/*表格内容*/
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '取电查询excel');
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
