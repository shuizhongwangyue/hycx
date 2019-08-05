import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import RoomsTab from '@/components/RoomsTab'
import ServiceQuery from '@/components/ServiceQuery'
import FaultQuery from '@/components/FaultQuery'
import PowerQuery from '@/components/PowerQuery'
import ServerCount from '@/components/ServerCount'
import FaultCount from '@/components/FaultCount'
import RoomDetail from '@/components/RoomDetail';
import Password from '@/components/Password';
import User from '@/components/User';
import RoomInput from '@/components/RoomInput';
import UserList from '@/components/UserList';
import InstallSite from '@/components/installSite';
import AreaList from '@/components/areaList.vue';
import RoomList from '@/components/RoomList.vue';

Vue.use(Router)
//http://sales-dev.ihxlife.com/HuNanActivity/hx-sbz/index.html?timestamp=1539831219742&nonce=e24c3a8a-b3c9-4f4c-9bd1-0917809e2ea9&trade_source=HXQYH&signature=517265EE5CE7B77472CD05896C88DD6D&userid=xuyunqi&attach=null#/

//http://sales-dev.ihxlife.com/HuNanActivity/hx-sbz/index.html?timestamp=1539831219742&nonce=e24c3a8a-b3c9-4f4c-9bd1-0917809e2ea9&trade_source=HXQYH&signature=517265EE5CE7B77472CD05896C88DD6D&userid=xuyunqi&attach=null#/info?userid=xuyunqi
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children:[
        {path:'',redirect: RoomsTab},
        { path: 'roomsTab', component: RoomsTab,name: 'RoomsTab',},
        { path: 'serviceQuery', component: ServiceQuery,name: 'ServiceQuery'},
        { path: 'faultQuery', component: FaultQuery,name: 'faultQuery'},
        { path: 'powerQuery', component: PowerQuery,name: 'powerQuery'},
        { path: 'serverCount', component: ServerCount,},
        { path: 'faultCount', component: FaultCount,},
        { path: 'roomDetail', component: RoomDetail,},
        { path: 'password', component: Password,},
        { path: 'user', component: User,},
        { path: 'roomInput', component: RoomInput,},
        { path: 'userList', component: UserList,},
        { path: 'installSite', component: InstallSite,},
        { path: 'areaList', component: AreaList,},
        { path: 'roomList', component: RoomList,},
      ]
    },

  ]
})
