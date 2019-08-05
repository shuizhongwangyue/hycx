<template>
  <div>
    <!--头部-->
    <header>
      <el-row>
        <el-col :span="9" :offset="1" style="height: 50px">
          <h1 class="logo"><i class="el-icon-my-jiudian"></i>君兰酒店客房数据管理系统</h1>
        </el-col>
        <el-col :span="3" :offset="11" class="loginInfo">
          <span>{{username()?username():"无昵称"}}</span><b>|</b><i @click="logoutFlag=true">退出</i>
        </el-col>
      </el-row>
    </header>
    <!--左导航-->
    <el-row style="background-color: #e6e8ea;overflow: hidden;min-height: 600px">
      <el-col :span="4" class="left-block">
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" theme="dark" router>
          <el-menu-item index="/home/roomsTab"><i class="el-icon-message"></i>主界面</el-menu-item>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-my-xinxichaxun xinxi"></i>信息查询</template>
            <el-menu-item index="/home/serviceQuery"><b style="display: inline-block;width: 20px"></b>服务查询
            </el-menu-item>
            <el-menu-item index="/home/powerQuery"><b style="display: inline-block;width: 20px"></b>取电查询</el-menu-item>
            <el-menu-item index="/home/faultQuery"><b style="display: inline-block;width: 20px"></b>故障查询</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-my-tongji"></i>统计</template>
            <el-menu-item index="/home/serverCount"><b style="display: inline-block;width: 20px"></b>服务统计</el-menu-item>
            <el-menu-item index="/home/faultCount"><b style="display: inline-block;width: 20px"></b>故障统计</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-my-banshou101"></i>系统管理</template>
            <el-menu-item index="/home/roomList"><b style="display: inline-block;width: 20px"></b>客房列表
            </el-menu-item>
           <!-- <el-menu-item index="/home/installSite"><b style="display: inline-block;width: 20px"></b>安装位置列表
            </el-menu-item>-->
            <el-menu-item index="/home/areaList"><b style="display: inline-block;width: 20px"></b>区域列表
            </el-menu-item>
           <!-- <el-submenu index="4-1">
              <template slot="title"><b style="display: inline-block;width: 20px"></b>客房管理</template>

              <el-menu-item index="/home/roomInput"><b style="display: inline-block;width: 20px"></b>客房信息录入
              </el-menu-item>
            </el-submenu>-->

           <!-- <el-submenu index="4-3">
              <template slot="title"><b style="display: inline-block;width: 20px"></b>安装位置配置</template>

            </el-submenu>
            <el-submenu index="4-4">
              <template slot="title"><b style="display: inline-block;width: 20px"></b>区域管理</template>

            </el-submenu>-->
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-my-banshou101"></i>用户管理</template>
            <el-menu-item index="/home/userList"><b style="display: inline-block;width: 20px"></b>用户列表</el-menu-item>
            <el-menu-item index="/home/user"><b style="display: inline-block;width: 20px"></b>添加用户</el-menu-item>
            <el-menu-item index="/home/password"><b style="display: inline-block;width: 20px"></b>修改密码</el-menu-item>
          </el-submenu>
        </el-menu>

      </el-col>
      <!--右侧主体-->
      <el-col :span="20" style="background-color: #e6e8ea;padding-bottom: 30px">
        <router-view></router-view>
      </el-col>
    </el-row>
    <!--提示框-->
    <el-dialog
      title="提示"
      :visible.sync="logoutFlag"
      size="tiny"
      center>
      <span>确定要退出么？</span>
      <span slot="footer" class="dialog-footer">
         <el-button @click="logoutFlag = false">取 消</el-button>
         <el-button type="primary" @click="logout">确 定</el-button>
       </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        username() {
          return sessionStorage.getItem('username');
        },
        logoutFlag:false
      }
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();

      },
      /* open(key, keyPath){
         console.log(key, keyPath)
       },*/
      logout() {
        //this.logoutFlag=true;
        this.$router.push('/')
      }
    },

    mounted() {
      /*
       document.getElementsByClassName('left-block')[0].style.height=document.body.clientHeight+'px';
       window.onresize=function () {
       document.getElementsByClassName('left-block')[0].style.height=document.body.clientHeight+'px';
       }*/
      /* this.$axios.get('/api/api/main/rooms').then((data) => {
       console.log(data)
       })*/
      /* console.log(this.$route)*/
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>

  .el-row:after, .el-row:before {
    height: auto;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #16232d;
  }

  .grid-content {
    min-height: 36px;
  }

  .right-block {
    margin: 0px 0 0 10px;
  }

  .left-block {
    height: 100%;
    background-color: #324157;
    border-radius: 0;
    padding-bottom: 2000px;
    margin-bottom: -2000px

  }

  /*.left-block >.el-menu {
    height: 100%;
    position: absolute;
  }*/

  header {
    height: 50px;
    background-color: #00b38a;
    box-shadow: 0 1px 4px 4px #00b38a;
  }

  header .logo {
    color: #fff;
    font-size: 20px;

    margin-top: 3px;
    letter-spacing: 1px;
    /*height: 53px;
    width: 400px;*/

  }

  header .logo > i {
    font-size: 44px;
    vertical-align: middle;
  }

  .topSearch {
    padding-top: 10px;
  }

  .moveBlock {
    border: 1px solid #dfe6ec;
    margin: 10px 10px 0 10px;
    padding: 10px;
    background-color: #fff;
  }

  .loginInfo > span, .loginInfo i, .loginInfo b {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    margin-left: 15px;
    color: antiquewhite;
  }

  .loginInfo i {
    cursor: pointer;
  }

  i.el-icon-my-xinxichaxun.xinxi {
    font-size: 18px;
  }

  i.el-icon-my-tongji {
    font-size: 16px;
  }

  h1, h4, h2, h3, h5, h6 {
    font-weight: 500;
  }

  .el-input__inner, .el-form-item__content {
    height: 30px;

  }

  .el-button--small {
    font-size: 14px;
  }

  /*图标库*/
  html [class^="el-icon-my"], html [class*=" el-icon-my"] {
    font-family: "iconfont" !important;

    /* 以下内容参照第三方图标库本身的规则 */
    font-size: inherit;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /*图标库的代码*/
  /*------------------------*/
  @font-face {
    font-family: "iconfont";
    src: url('../fontFile/iconfont.eot?t=1508206299336'); /* IE9*/
    src: url('../fontFile/iconfont.eot?t=1508206299336#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
    url('../fontFile/iconfont.ttf?t=1508206299336') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ url('../fontFile/iconfont.svg?t=1508206299336#iconfont') format('svg'); /* iOS 4.1- */
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .el-icon-my-saoba2:before {
    content: "\e63a";
  }

  .el-icon-my-chuang:before {
    content: "\ec3f";
  }

  .el-icon-my-sos:before {
    content: "\e709";
  }

  .el-icon-my-xinxichaxun:before {
    content: "\e63c";
  }

  .el-icon-my-tongji:before {
    content: "\e620";
  }

  .el-icon-my-xiyifuwu:before {
    content: "\e73b";
  }

  .el-icon-my-banshou101:before {
    content: "\e605";
  }

  .el-icon-my-next:before {
    content: "\e701";
  }

  .el-icon-my-jiudian:before {
    content: "\e611";
  }

  .el-icon-my-naoling:before {
    content: "\e649";
  }

  .el-icon-my-xinxichaxun1:before {
    content: "\e602";
  }

  .el-icon-my-wode:before {
    content: "\e62e";
  }


</style>
