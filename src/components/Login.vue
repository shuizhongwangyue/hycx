<template>
  <div>
    <div class='login'>
      <h3 class="loginTit"></h3>
      <div class='block'>
        <div class="userLogin">用户登录</div>
        <div class='inputbox'><i></i><input placeholder='请输入用户名' class='username' type='text' @focus="fous" @blur="blur"
                                            v-model="username" autofocus></div>
        <div class='inputbox'><i class='moe'></i><input placeholder='请输入密码' class='password' type='password'
                                                        @focus="fous" @blur="blur" v-model="password"></div>
        <div class='loginBtn' @click="login">登录</div>
        <div class='supplement'>
         <!-- <span class='firstSpan' style="border-radius: 3px">忘记密码</span><i>
          | </i><span>注册新账号</span>-->
        </div>
      </div>
    </div>
    <div class='footer'>
      <span>业务咨询电话：010-62637583</span>
      <span> 技术支持：北京华亿创新信息技术有限公司</span>
    </div>
  </div>

</template>

<script>
  import Clipboard from'clipboard'
  export default {
    name: 'hello',
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      open(a) {
        this.$message(a);
      },
      fous: function (event) {
        if (event) {
          event.target.parentNode.style.borderColor = '#20a0ff'
        }
      },
      blur: function (event) {
        if (event) {
          event.target.parentNode.style.borderColor = '#f1eef2'
        }
      },
      login() {
       
        if (this.username && this.password) {
          this.$axios.post({url:`/api/account/login?username=${this.username}&password=${this.password}`})
            .then((data) => {
              console.log("登录信息", data.data)
              let res = data.data;
              if (res.success) {

                sessionStorage.setItem('username', this.username)
                sessionStorage.setItem('token', res.data.token)
                sessionStorage.setItem('userId', res.data.userInfo.id)
                res.data.userInfo&&res.data.userInfo.role&&sessionStorage.setItem('role', res.data.userInfo.role.type)
                if (res.data.token && res.data.userInfo.id) {
                   this.$axios.get({url:`/api/constants`,token:res.data.token}).then(res=>{
                    console.log(res)
                     if(res.data){
                       localStorage.setItem('config',JSON.stringify(res.data));
                       this.$router.push('/home/roomsTab');
                     }else {

                     }

                   }).catch(err=>{

                   })

                } else {

                }
              } else {
                this.open(res.message)
              }
            }).catch(err=>{
            this.open('请求出错！')
          })

        } else {
          this.open('请输入用户名和密码')
        }

      }

    },
    mounted() {
      document.onkeyup = (e) => {
        if (e.keyCode == 13) {
          this.login()
        }

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style>
  html, body {
    height: 100%;
  }

  .login {
    background: url("../assets/bg.jpg");
    background-size: 100% 100%;
    font-size: 14px;
    padding: 5% 0;
  }

  h3 {
    background: url("../assets/logo.svg");
    background-size: 100% 100%;
    width: 425px;
    height: 75px;
    margin: 0px auto;
  }

  .block {
    width: 410px;
    margin: 20px auto 0;
    border-radius: 8px;
    background: #fff;
    padding-top: 30px;
  }

  .inputbox {
    width: 80%;
    height: 45px;
    line-height: 45px;
    margin: 24px auto;
    border: 1px solid #f1eef2;
    border-radius: 3px;
  }

  .inputbox i {
    display: inline-block;
    margin: 0px 15px;
    width: 15px;
    height: 16px;
    vertical-align: middle;
    background: url("../assets/1-1.png");

  }

  .inputbox .moe {
    background-position: 0px 16px;
  }

  .inputbox input {
    border: none;
    outline: none;
    width: 80%;
    height: 100%;
    line-height: 100%;
  }

  .loginBtn {
    width: 80%;
    margin: 0 auto;
    background: #20a0ff;
    text-align: center;
    height: 50px;
    line-height: 50px;
    border-radius: 3px;
    cursor: pointer;
    color: #fff;
  }

  .supplement {
    height: 70px;
    line-height: 70px;
    color: #666;
  }

  .firstSpan {
    margin-left: 60%;
  }

  .footer {
    width: 460px;
    height: 110px;
    line-height: 110px;
    margin: 0 auto;
    font-size: 12px;
    color: #959595;
  }

  .footer span:nth-child(2) {
    margin-left: 30px;
  }

  .userLogin {
    color: #00b38a;
    text-align: center;
    line-height: 30px;
    height: 30px;
    font-size: 18px;
    font-weight: 600;
  }

</style>
