import axios from 'axios';
import r from'../router/index';
/*import Vue from 'vue'
console.log(111,r)*/
let publicFn=(method)=>{
  return ({url, token}, params,context) => {
    return axios({
      method: method,
      url,
      headers: {
        'x-access-token': token
      },
      params
    }).then(res=>{
        return res
    }).catch(e=>{
      console.log(111,e.response)
      if(e.response.status=='401'){
        r.push('/')
      }else {

      }

    });
  }

}
let get =publicFn('get');
let put =publicFn('put');
let deleteInfo =publicFn('delete');
let post =publicFn('post');

/*let get = ({url, token}, params) => {
  return axios({
    method: 'get',
    url,
    headers: {
      'x-access-token': token
    },
    params
  });
}*/
/*let put = ({url, token}, params) => {
  return axios({
    method: 'put',
    url,
    headers: {
      'x-access-token': token
    },
    params
  });
}*/
/*let deleteInfo = ({url, token}, params) => {
  return axios({
    method: 'delete',
    url,
    headers: {
      'x-access-token': token
    },
    params
  });
}*/
let postBody = ({url, token, data}) => {
  return axios({
    method: 'post',
    url,
    data,
    headers: {
      'x-access-token': token
    }
  });
}

export default {get, post, postBody, put, deleteInfo}
