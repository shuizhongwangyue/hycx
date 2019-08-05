
<template>
  <div>
    <el-row class="moveBlock ">
      <el-col :span="24" class="topSearch">
        <el-radio class="radio" v-model="radio" label="1">日</el-radio>
        <el-radio class="radio" v-model="radio" label="2">月</el-radio>

        <el-date-picker
          v-model="date"
          align="right"
          :type="type()"
          :placeholder="str()"
        >
        </el-date-picker>
        <!--  <label>服务类型</label>
          <el-select v-model="queryParams.serveType" placeholder="请选择">
            <el-option v-for="service in serveTypes" :label="service.name" :value="service.code"
                       :key="service.code"></el-option>
          </el-select>-->
        <el-button type="primary" @click="onSubmit" size="small">查询</el-button>

      </el-col>
    </el-row>
    <el-row class="moveBlock">
      <el-col :span="24">
        <div id="faultCountChart"></div>
      </el-col>
    </el-row>

  </div>

</template>

<script>
  export default {
    data() {
      return {
        radio: '1',
        date: new Date(),
        deviceTypes:[],
        str(){
          if (this.radio == 1) {
            return '选择日'
          } else if (this.radio == 2) {
            return '选择月'
          }
        },
        type(){
          if (this.radio == 1) {
            return 'date'
          } else if (this.radio == 2) {
            return 'month'
          }
        },
        queryParams: {
          beginDate: '',
          endDate: ''
        },


        count(){
          let ary = []
          for (let i = 0; i < 24; i++) {
            ary.push(i)
          }
          return ary
        },
        count1(){
          let ary = []
          for (let i = 0; i < 31; i++) {
            ary.push(i + 1)
          }
          return ary
        },
        open8(str) {
          this.$message({
            showClose: true,
            message: str,
            type: 'error'
          });
        }
      }
    },
    methods: {

      /*查询*/
      onSubmit(e){

        /*时间格式化*/
        function add(c) {
          var c = c.toString();
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

        if (this.date) {
          if (this.radio == 1) {

            this.queryParams.beginDate = formatDate(this.date);
            this.queryParams.endDate = formatDate(this.date);

          } else if (this.radio == 2) {

            this.queryParams.beginDate = formatDate(this.date).substr(0,6) + '01';
            this.queryParams.endDate = formatDate(this.date).substr(0,6) + '31';

          }
        }
        /*else {
         let str = new Date().getFullYear() + "" + add(new Date().getMonth() + 1)+add(new Date().getDate());

         if (this.radio == 1) {
         this.queryParams.beginDate = str;
         this.queryParams.endDate = str;

         } else if (this.radio == 2) {

         this.queryParams.beginDate = str.substr(0,6) + '01';
         this.queryParams.endDate = str.substr(0,6) + '31';

         }


         }*/


        /*请求*/
        console.log('服务统计参数', this.queryParams)

        this.$axios.get({url:'/api/faults/stastics',token:this.token}, {...this.queryParams}).then((data) => {

          console.log('故障统计', data)
          if (data.data) {
            //console.log(data.data);

            var legend = this.deviceTypes.map((item) => {
              return item.name;
            })
            if (this.radio == 2) {
              var aryData = data.data.map((item) => {
                var obj = {};
                obj.name = item.deviceName;
                obj.type = 'line';
                obj.data = [];
                for (let i = 0; i < 31; i++) {
                  if (item.list.length) {
                    for (let n = 0; n < item.list.length; n++) {

                      if (item.list[n].name.substr(6, 2) == i + 1) {
                        obj.data.push(item.list[n].count)
                      } else {
                        obj.data.push(0)
                      }
                    }
                  } else {
                    obj.data.push(0)
                  }

                }
                return obj;

              })

              this.drawLine(this.count1(), aryData, legend, '号');
            } else {
              var aryData = data.data.map((item) => {
                var obj = {};
                obj.name = item.deviceName;
                obj.type = 'line';
                obj.data = [];
                for (let i = 0; i < 24; i++) {
                  if (item.list.length) {
                    for (let n = 0; n < item.list.length; n++) {
                      if (item.list[n].name.substr(8, 2) == i + 1) {
                        obj.data.push(item.list[n].count)
                      } else {
                        obj.data.push(0)
                      }
                    }
                  } else {
                    obj.data.push(0)
                  }

                }
                return obj;

              })
              //console.log('日', aryData)
              this.drawLine(this.count(), aryData, legend, '点');
            }


          }else {
              this.open8('没有得到故障信息')
          }


        });

      },
      /*
       *折线图
       * xData x轴data
       * objData series
       * */

      drawLine(xData, objData, legend, str){
        var lineOption1 = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legend,
            x: 'left',
            itemWidth:10,
            itemHeight:10,
            type:'scroll'
            //backgroundColor:'#ccc'
          },

          xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#d9dcde'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                color: '#333'
              },
              formatter: '{value}' + str
            },
            axisLine: {
              lineStyle: {
                color: '#d9dcde',
                width: 2
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: false,
            },
            data: xData
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f6f7f8'
              }
            },
            /* minInterval: 0.25,*/
            axisTick: {
              show: false,
              alignWithLabel: true,

            },
            /* max: 100,
             min: 0,*/
            interval: 1,
            axisLabel: {
              margin: 10,
              textStyle: {
                color: '#333'
              },
              formatter: '{value}次'
            },
            axisLine: {
              lineStyle: {
                color: '#d9dcde',
                width: 2
              }

            }

          },
          /*dataZoom: [{
           type: 'inside',
           start: 1,
           end: 31
           }, ],*/
          series: objData,
          /*[
           {
           name: '请求数',
           type: 'line',
           data: [130, 26, 6, 6, 66, 62, 1]
           }, {
           name: '数',
           type: 'line',
           data: [130, 233, 4, 6, 66, 62, 1]
           }, {
           name: '数',
           type: 'line',
           data: [1, 33],
           },
           ]*/
          /* color: ['#23a7f1', '#fad733', '#7266ba']*/
        };
        var myLine1 = this.$echarts.init(document.getElementById('faultCountChart'));
        myLine1.setOption(lineOption1);
      }
    },
    beforeCreate(){
      this.token=sessionStorage.getItem('token');

    },
    mounted(){

      let config=JSON.parse(localStorage.getItem('config'));
      this.deviceTypes = config.deviceTypes
      this.onSubmit();
      //console.log(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), new Date().getDate())

    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
  #faultCountChart {
    height: 600px;
  }

  .moveBlock:nth-child(2) {
    margin-top: -11px;
  }

  .topSearch {
    padding-bottom: 10px;
  }
</style>

