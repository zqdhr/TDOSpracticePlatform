import axios from 'axios'

//自定义配置新建一个axios实例
const http = axios.create({
	baseURL: 'http://live.jjjmb.com',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	},
	timeout: 5000
})

//添加请求拦截器
http.interceptors.request.use(function (config) {
	//console.log(config)
	//对响应数据做点什么\
	return config;
	
},)

//添加响应拦截器
http.interceptors.response.use(function (response) {
	return response.data;
},function (error) {
	return Promise.reject(error)
})

export default http;
