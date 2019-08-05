<template>
  <div class="moveBlock">
    <el-row>
      <el-col :span="2">
        区域
      </el-col>
      <el-col :span="4">
        <el-select v-model="area" placeholder="请选择区域" clearable>
          <el-option v-for="area in areaList" :label="area.name" :value="area.id"
                     :key="area.id"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        房号
      </el-col>
      <el-col :span="4">
        <el-input v-model="roomNum" placeholder="请输入房号" type="text"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        网关
      </el-col>
      <el-col :span="4">
        <el-input v-model="gateway" placeholder="请输入网关" type="text"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        状态
      </el-col>
      <el-col :span="4">

        <el-select v-model="saleState" placeholder="请选择" clearable>
          <el-option v-for="saleState in saleStates" :label="saleState.name" :value="saleState.code"
                     :key="saleState.code"></el-option>
        </el-select>

      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2">
        <el-button>取消</el-button>
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
        roomNum: '',
        gateway: '',
        saleState: '',
        saleStates: [],
        area:'',
        areaList:[],
        count() {
          let ary = []
          for (let i = 0; i < 24; i++) {
            ary.push(i)
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
      onSubmit() {
       // console.log(111,this.roomNum,this.gateway,this.saleState,this.area,);

        if (!this.roomNum) return this.open8('请输入房间号')
        if (!this.gateway) return this.open8('请输入网关')
        if (!this.saleState) return this.open8('请选择房间状态')
        if (!this.area) return this.open8('请选择区域')
        let fn=this.$axios.post;
        let url=`/api/room?roomCode=${this.roomNum}&ip=${this.gateway}&saleState=${this.saleState}&areaId=${this.area}`;

        if(this.query&&JSON.stringify(this.query)!='{}'){
          fn=this.$axios.put;
          url=`/api/room?roomCode=${this.roomNum}&ip=${this.gateway}&saleState=${this.saleState}&areaId=${this.area}&roomId=${this.query.id}`;
        }
        fn({
          url,
          token: this.token
        }).then((data) => {
          console.log('结果',data.data)
          if (data.data.success) {
            this.$message('操作成功！');

          }else {
            this.open8(data.data.message)
          }
        }).catch(err => {
          console.log('错误',err);
          this.open8('出现错误')
        })


      }
    },
    beforeCreate() {
      this.token = sessionStorage.getItem('token');
      console.log(this.$router.history.current.query);
      let query=this.$router.history.current.query;
      this.query=query;
      console.log(333, query)
      /*区域列表*/

      this.$axios.get({url:'/api/areas',token:this.token}).then((res) => {
        console.log('区域信息', res)
        if (res.data.success) {
          this.areaList = res.data.data;
          if(query&&JSON.stringify(this.query)!='{}'){
            let obj=this.areaList.find(it=>{
              return it.name==query.areaName;
            })
            if(obj){
              this.area=obj.id;
            }
            this.roomNum=query.code;
            this.gateway=query.gateCode;
            this.saleState=parseFloat(query.saleState);
          }

        }
      });

    },
    mounted() {

      /*得到类型*/
      let config = JSON.parse(localStorage.getItem('config'));
      this.saleStates = config.saleStates;

    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .moveBlock {
    min-height: 626px;

  }
  .el-row {
    margin-top: 10px;
  }
</style>
