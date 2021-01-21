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

//修改用户
var modifyUser = function(data){
	return axios.post('/modify_user', data,{headers: {'Content-Type':'application/json'}})
}

//老师获取管理员内置课程（开课管理页面的列表）
var getAdminCourseList = function(data){
	return axios.get('/get_admin_course_list?page='+data.page+'&per_page='+data.per_page)
}

//老师获取自己的课程（备课管理的列表）
var getCourseListByUserId = function(data){
	return axios.get('/get_course_list_by_user_id?user_id='+data.user_id+'&page='+data.page+'&per_page='+data.per_page)
}

//通过id获取课程
var getCourseById = function(data){
	return axios.get('/get_course_by_id?course_id='+data.course_id)
}

//通过id获取课程
var modifyCourseStatus = function(data){
	return axios.post('/modify_course_status?user_id='+data.user_id+'&course_id='+data.course_id+'&start='+data.start+'&end='+data.end+'&class_id='+data.class_id)
}

//通过id获取课程
var getCoursewareBySectionId = function(data){
	return axios.get('/getCoursewareBySectionId?sectionId='+data.sectionId+'&perPage='+data.perPage+'&page='+data.page)
}

//查询管理员没有发布的课程
var getAdminUnpublishedCourseList = function(data){
	return axios.get('/get_admin_unpublished_course_list?user_id='+data.user_id+'&per_page='+data.per_page+'&page='+data.page)
}

export{
	getCity,createToken,login,hardware,online,onlineUsers,searchUser,searchClass,deleteUser,getAdminCourseList,getCourseListByUserId,getCourseById,
	modifyCourseStatus,getCoursewareBySectionId,modifyUser,getAdminUnpublishedCourseList
}

function getJson (data) {
	return qs.stringify(data)
}
