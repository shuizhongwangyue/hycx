<template>
  <div class="roomCon">
    <el-row class="moveBlock">
      <el-col :span="24">
        <div class="marg">房间状况</div>
        <el-row>
          <el-col :span="5">
            房间号:{{roomDetail.code}}
          </el-col>
          <el-col :span="6">
            网关:{{roomDetail.gateCode}}
          </el-col>
          <el-col :span="5">
            当前状态：{{roomDetail.saleState=='1'?'已售':roomDetail.saleState=='2'?'待售':roomDetail.saleState=='3'?'空置':roomDetail.saleState=='4'?'脏房':roomDetail.saleState=='5'?'维修':null}}{{roomDetail.powerOn
            ? '有人' : '无人'}}
          </el-col>
          <el-col :span="5">
            区域：{{roomDetail.areaName}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            空调：{{roomDetail.airConditionState == '1' ? '高风' : roomDetail.airConditionState == '2' ? '中风' :
            roomDetail.airConditionState == '3' ? '低风' : roomDetail.airConditionState == '255' ? '关闭':'识别不到'}}
          </el-col>
          <el-col :span="6">
            温度：{{roomDetail.tempreture}}℃
          </el-col>
          <el-col :span="5">
            湿度：{{roomDetail.humidity}}%
          </el-col>
          <el-col :span="6">

            服务：{{roomDetail.serveClean?'清扫':roomDetail.serveCheckout?'退房':roomDetail.serveSos?'sos':roomDetail.serveWash?'洗衣':roomDetail.serveWater?'送水':'无服务'}}
          </el-col>
        </el-row>

      </el-col>
    </el-row>
    <el-row class="moveBlock">
      <el-col :span="24">
        <div class="marg">统计查询</div>
        <router-link to="/home/serviceQuery">
          <el-button type="primary " size="small">服务查询</el-button>
        </router-link>
        <router-link to="/home/powerQuery">
          <el-button type="primary" size="small">取电查询</el-button>
        </router-link>
        <router-link to="/home/faultQuery">
          <el-button type="primary" size="small">故障查询</el-button>
        </router-link>
      </el-col>
    </el-row>
    <el-row class="moveBlock">
      <el-col :span="24">
        <div class="marg">空调设置</div>
        <!--<el-radio-group v-model="radio5" size="small">
          <el-radio-button label="上海"></el-radio-button>
          <el-radio-button label="北京" disabled ></el-radio-button>
          <el-radio-button label="广州"></el-radio-button>
          <el-radio-button label="深圳"></el-radio-button>
        </el-radio-group>-->
        <el-button :type='typeStr("1")' @click="airConditionStateQuery('1')" size="small">高风</el-button>
        <el-button :type="typeStr('2')" @click="airConditionStateQuery('2')" size="small">中风</el-button>
        <el-button :type="typeStr('3')" @click="airConditionStateQuery('3')" size="small">低风</el-button>
        <el-button :type="typeStr('255')" @click="airConditionStateQuery('255')" size="small">关闭</el-button>
      </el-col>
    </el-row>
    <el-row class="moveBlock">
      <el-col :span="24">
        <div class="marg">房态设置</div>
        <!-- <label for="state">状态</label>-->
        <el-select v-model="roomDetail.saleState" placeholder="请选择" id="state" clearable>
          <el-option v-for="saleState in saleStates" :label="saleState.name" :value="saleState.code"
                     :key="saleState.code"></el-option>
        </el-select>
        <el-button type="primary" @click="changeRoomState" size="small">确定</el-button>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        roomDetail: {},
        saleStates: [],
        typeStr(n) {
          return this.roomDetail.airConditionState == n ? 'primary' : ''
        },

      }
    },
    methods: {
      airConditionStateQuery(n) {
        var gateCode = this.roomDetail.gateCode;
        //gateCode='192.168.2.103';
        //this.id='5bbeb598a79d48585a1c2119',

        this.$axios.put({url: '/api/airCondition', token: this.token}, {
          state: n,
          gateCode,
          roomId: this.id
        }).then((data) => {
          console.log('请求改变空调状态', data)
        }).catch((err) => {
          console.log(err)
        })
      },
      changeRoomState() {
        var roomId = this.id;
        console.log(this.roomDetail);
        if (this.roomDetail.areaName) {
          this.areaList.forEach(item => {
            if (this.roomDetail.areaName == item.name) {
              this.roomDetail.areaId = item.id
            }
          })
        }
        this.$axios.put({url: '/api/room', token: this.token}, {
          roomId,
          saleState: this.roomDetail.saleState,
          roomCode: this.roomDetail.code,
          ip: this.roomDetail.gateCode,
          areaId: this.roomDetail.areaId
        }).then((data) => {
          console.log('设置房屋状态', data.data)
          if (data.data.success) {
            this.$message({
              showClose: false,
              message: '设置成功',
              type: 'success'
            });
          } else {
            this.$message({
              showClose: false,
              message: '设置失败',
            });
          }

        })
      }
    },
    beforeCreate() {
      this.token = sessionStorage.getItem('token');
      /*得到房间号发请求*/
      this.id = localStorage.getItem('id');
      console.log('房间id', this.id)

      this.$axios.get({url: '/api/room/detail?roomId=' + this.id, token: this.token}).then((data) => {
        console.log('房间信息', data.data)
        if (data.data.success) {
          this.roomDetail = data.data.room;

        }

      })
      /*区域列表*/
      this.$axios.get({url: '/api/areas', token: this.token}).then((res) => {
        console.log('区域信息', res.data)
        if (res.data.success) {
          this.areaList = res.data.data;
        }
      });

    },
    mounted() {
      let config = JSON.parse(localStorage.getItem('config'));
      this.saleStates = config.saleStates;
      console.log(this.saleStates)

    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .roomCon {
    min-height: 626px;
  }

  .marg {
    margin: 0px 0 10px 0px;
    font-weight: 600;
  }

</style>
