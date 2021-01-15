import axios from './http'
import qs from 'qs'

var getCity = function (data) {
	return axios.post('/area/get-province-list', getJson(data))
}

//创建token
var createToken = function (data) {
	return axios.post('/createToken', getJson(data))
}

//用户登录
var login = function (data) {
	return axios.post('/login', getJson(data))
}

//获取服务器硬件信息
var hardware = function(data){
	return axios.get('/hardware', getJson(data))
}

//用户在线人数
var online = function(data){
	return axios.get('/online', getJson(data))
}

//在线用户列表
var onlineUsers = function(data){
	return axios.get('/online_user?page='+data.page+'&per_page='+data.per_page)
}

//查询学生，教师信息
var searchUser = function(data){
	return axios.get(encodeURI('/search_user?search='+data.search+'&type='+data.type+'&classes='+data.classes+'&page='+data.page+'&per_page='+data.per_page))
}

//班级列表
var searchClass = function(data){
	return axios.get('/search_class', getJson(data))
}

//删除用户
var deleteUser = function(params){
	return axios.delete('/delete_user', {data:params})
}

//老师获取管理员内置课程（开课管理页面的列表）
var getAdminCourseList = function(params){
	return axios.get('/get_admin_course_list', {data:params})
}

export{
	getCity,createToken,login,hardware,online,onlineUsers,searchUser,searchClass,deleteUser,getAdminCourseList
}

function getJson (data) {
	return qs.stringify(data)
}
