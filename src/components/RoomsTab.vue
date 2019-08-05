<template>
  <div>
    <el-row class="moveBlock">
      <el-col :span="18">
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
              <el-form-item label="有无人">
                <el-select v-model="queryParams.inRoom" placeholder="请选择" clearable>
                  <el-option label="有人" value="true"/>
                  <el-option label="无人" value="false"/>
                </el-select>
              </el-form-item>
              <el-form-item label="服务">
                <el-select v-model="queryParams.serveType" placeholder="请选择" clearable>
                  <el-option v-for="service in serveTypes" :label="service.name" :value="service.code"
                             :key="service.code"/>
                </el-select>
              </el-form-item>
              <el-form-item label="房间状态">
                <el-select v-model="queryParams.saleState" placeholder="请选择" clearable>
                  <el-option v-for="saleState in saleStates" :label="saleState.name" :value="saleState.code"
                             :key="saleState.code"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryRooms" size="small" :loading="loading">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!--主体部分-->
        <el-row>
          <el-col :span="24" class="mainContent">
            <h4>房间状态</h4>
            <div class="mainCon">

              <ul>
                <li v-for="(item,i) in tableData" class="item" @click="queryRoomDetail(item)"
                    :class="returnClass(item)">
                  <div class="codeLine"><i>{{item.code}} </i><i class="el-icon-my-next"></i></div>
                  <div class="iconBox">
                    <i :class="returnClass1(item)"></i>
                  </div>
                  <div class="serveTypeLine">{{item.serveType}}</div>
                  <div class="powerOnLine">
                    <b style="background-color: #00bef6" class="dot" v-if="item.powerOn.match(/有人/)"></b>
                    <b style="background-color: #f00" class="dot" v-else></b>{{item.powerOn}}
                  </div>
                </li>

              </ul>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="fontSize">
            图例 <span class="color color1">待售</span><span class="color color2">已售</span><span
            class="color color3">空置</span><span class="color color4">脏房</span><span class="color color5">维修</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <!--右侧-->
        <ul class="right-block">
          <li class="count">
            <div class="title">事件</div>

            <ul class="evs">
              <li class="titleLine">
                <span>房号</span><span>时间</span><span>事件</span>
              </li>

              <li v-for="list in eventsList" class="titleLine ">
                <span :title='list.roomCode'>{{list.roomCode}}</span><span :title='list.desc'>{{list.desc}}</span><span
                :title="new Date(list.datetime).toLocaleString()">{{new Date(list.datetime).toLocaleString()}}</span>
              </li>

              <div v-if="!eventsList.length" style="text-align: center;margin-top: 10px;color: #666">暂无事件</div>

            </ul>
          </li>
          <li class="count">
            <div class="title">常规</div>
            <div class="content">
              <div class="leftBox  MT">
                <i class="el-icon-my-naoling "></i>
              </div>
              <ul class="rightBox">
                <li>取电数量：<span @click="handleClick(counts.powerOnCount)">{{counts.powerOnCount}}</span></li>
                <li>空调开启：<span>{{counts.airConditionOnCount}}</span></li>
                <li>服务请求：<span>{{counts.serveOnCount}}</span></li>
              </ul>
            </div>

          </li>
          <li class="count">
            <div class="title">故障</div>
            <div class="content">
              <div class="leftBox bg">
                <i class="el-icon-my-banshou101"></i>
              </div>
              <ul class="rightBox">
                <li>客房脱机：<span>{{counts.offlineCount}}</span></li>
                <li>设备故障：<span>{{counts.faultCount}}</span></li>
              </ul>
            </div>
          </li>

        </ul>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        queryParams: {
          areaId:'',
          roomCode: '',
          saleState: '',
          inRoom: '',
          serveType: ''
        },
        serveTypes: [],
        saleStates: [],
        tableData: [],
        eventsList: [],
        areaList: [],
        counts: {},
        loading:false,
        returnClass(item){
          if (item.saleState == '已售') {
            return 'color2'
          } else if (item.saleState == '空置') {
            return 'color3'
          } else if (item.saleState == '脏房') {
            return 'color4'
          } else if (item.saleState == '维修') {
            return 'color5'
          }
        },
        returnClass1(item){
          if (item.serveType == '清扫') {
            return 'el-icon-my-saoba2'
          } else if (item.serveType == '送水') {
            return 'el-icon-my-wode'
          } else if (item.serveType == '洗衣') {
            return 'el-icon-my-xiyifuwu'
          } else if (item.serveType == 'sos') {
            return 'el-icon-my-sos'
          } else if (item.serveType == '退房') {
            return ''
          } else {
            return 'el-icon-my-chuang'
          }

        }

      }
    },
    methods: {
      /*右侧点击统计后的过滤*/
      error(str){
        this.$message({
          showClose: true,
          message: str,
          type: 'error'
        });
      },
      handleClick(){

      },
      /*点击房间号*/
      queryRoomDetail(item){
        console.log('item', item)
        var id = item.id;
        localStorage.setItem('id', id);
        this.$router.push('/home/roomDetail');

      },
      /*点击查询后*/
      queryRooms(e){
        e.preventDefault();
        //console.log(this.queryParams,this.token)
        let obj=this.queryParams;
        for(let key in obj){
          if(!obj[key]){
            delete obj[key]
          }
        }
        let str=''
        if(Object.keys(obj).length){
          for (let key in obj) {
            str+=`&${key}=${obj[key]}`;
          }
          str='?'+str.substr(1);
        }

          this.loading=true;
          this.$axios.get({url:'/api/main/rooms'+str,token:this.token}).then((data) => {
            this.queryFn(data)
          })


      },
      /*每隔10秒刷新页面*/
      queryData(n){
        this.time = setInterval(() => {
          this.$axios.get({url:'/api/main/rooms',token:this.token}).then((data) => {
            this.queryFn(data);
            console.log('启动。。。')
          })
        }, n)

      }
    },
    beforeCreate(){
      this.token=sessionStorage.getItem('token');

      /*所有房间状态*/
      this.$axios.get({url:'/api/main/rooms',token:this.token}).then((data) => {
        console.log('所有房间状态', data.data)
        //let res=data.data;

        this.queryFn = (data) => {
          if (data.data.success) {
            var dataList = data.data.list;
            if (dataList.length) {
              dataList = dataList.map((item, i) => {
                var saleState = '';
                var serveType = '无服务';
                var powerOn = '';

                for (let n = 0; n < this.saleStates.length; n++) {
                  item.saleState == this.saleStates[n].code ? saleState = this.saleStates[n].name : null;
                }
                if (item.serveCheckout) {
                  serveType = '退房'
                }
                if (item.serveClean) {
                  serveType = '清扫'
                }
                if (item.serveSos) {
                  serveType = 'sos'
                }
                if (item.serveWash) {
                  serveType = '洗衣'
                }
                if (item.serveWater) {
                  serveType = '送水'
                }


                if (item.powerOn) {
                  powerOn = '有人';

                } else {
                  powerOn = '无人';
                }
                if (item.noDisturb) {
                  powerOn += '(请勿打扰)'
                }
                if (item.waiting) {
                  powerOn += '(请稍后)'
                }

                return {
                  num: i + 1,
                  code: item.code,
                  saleState,
                  powerOn,
                  serveType,
                  id: item.id,
                }
              })
              dataList.sort((a, b) => {
                return a.serveType.localeCompare(b.serveType, "zh");
                /*排序*/
              })

              this.tableData = dataList;
              this.loading=false
              console.log('过滤过的数据tabledata', this.tableData)
            }else {
              this.loading=false
                this.error('没有查询到相关房间信息')
            }

          }
        }
        this.queryFn(data);
      });
      /*首页事件*/
      this.$axios.get({url:'/api/main/events',token:this.token}).then((data) => {
        console.log('首页事件信息', data.data)
        if (data.data.success) {
          if (data.data.list.length) {
            if (data.data.list.length > 8) {
              this.eventsList = data.data.list.slice(data.data.list.length - 8);
            } else {
              this.eventsList = data.data.list;
            }
          }

        }

      })
      /*首页统计*/
      this.$axios.get({url:'/api/main/statistics',token:this.token}).then((res) => {
        console.log('统计信息', res.data)
        if (res.data.success) {

          this.counts = res.data;

        }

      });
      /*区域列表*/
      this.$axios.get({url:'/api/areas',token:this.token}).then((res) => {
        console.log('区域信息', res)
        if (res.data.success) {
          this.areaList = res.data.data;
        }

      });
    },
    created(){
      /*this.queryData(10000);*/
    },
    mounted(){
      /*查询的选项*/
      let config=JSON.parse(localStorage.getItem('config'));

      this.serveTypes = config.serveTypes;
      this.saleStates = config.saleStates
      console.log(this.serveTypes,this.saleStates)
    },
    brforeDestroyed(){
      /* clearInterval(this.time);*/
    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .el-input, .el-select {
    width: 117px;
  }

  /*主体*/
  .mainContent {
    border: 1px solid #dfe6ec;
    border-radius: 0px;

  }

  .mainContent > h4, .title {
    border-bottom: 1px solid #dfe6ec;
    height: 30px;
    line-height: 30px;
    background-color: #f5f5f5;
    padding-left: 10px;
    /* padding-left: 20px;*/
  }

  .mainContent .mainCon {
    padding: 10px ;
    min-height: 525px;

  }

  .mainCon ul {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
  }
  /*.mainCon ul:after{
    content: "";
   !* flex: auto;*!
   !* display: block;
    width: 130px;
    height: 118px;*!
  }*/
 /* .mainCon ul>li:empty{
    border: none;
    height: 0;
  }*/



  .item {

    width: 118px;
    height: 118px;
    border: 1px solid #dfe6ec;
    cursor: pointer;
    margin: 10px;
    padding: 10px;
    color: #666;
  }
  .codeLine {
    display: flex;
    justify-content: space-between;
  }
  .content {
    overflow: hidden;
    padding: 10px;
  }

  .count {
    border: 1px solid #dfe6ec;
    margin-bottom: 25px;
  }

  .leftBox {
    float: left;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: #ff9700;
    margin: 10px 15px 10px 10px;

  }

  .leftBox > i {
    font-size: 20px;
    color: #fff;
    margin: 10px;
  }

  .MT {

    margin-top: 25px;

  }

  .leftBox .el-icon-my-banshou101 {
    font-size: 14px;
    margin: 13px;

  }

  .bg {
    background-color: #00bef6;

  }

  .rightBox {
    float: left;
    color: #666;
  }

  .rightBox li {
    height: 30px;
    line-height: 30px;

  }



  .titleLine, .serveTypeLine {
    height: 25px;
    line-height: 25px;

  }

  .iconBox {
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .titleLine span {
    display: inline-block;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .titleLine :nth-child(1) {
    width: 17%;
  }

  .titleLine :nth-child(2) {
    width: 55%;
  }

  .titleLine :nth-child(3) {
    width: 28%;
  }

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }



  .iconBox i {
    font-size: 50px;
    color: #00bef6;
  }

  /*调整图标大小*/
  .iconBox i.el-icon-my-chuang {

    font-size: 40px;

  }

  .serveTypeLine {
    text-align: center;
  }

  .powerOnLine {
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    margin-top: 10px;
  }

  i.el-icon-my-next {
    font-size: 16px;
  }

  .evs {
    height: 234px;
    overflow: hidden;
    /*overflow-y: scroll;*/
  }

  .evs li {
    color: #666;
    border-bottom: 1px solid #dfe6ec;
  }

  .evs li:nth-child(2n) {
    background-color: #f9f9f9;

  }

  .fontSize {
    font-size: 12px;
  }

  .color {
    display: inline-block;
    border: 1px solid #dfe6ec;
    width: 38px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    margin: 15px 0px 20px 15px;
    color: #666;

  }

  .color2 {
    background-color: #ecffef;
  }

  .color3 {
    background-color: #fff4ea;
  }

  .color4 {
    background-color: #e7f4ff;
  }

  .color5 {
    background-color: #ffe3e3;
  }
</style>
