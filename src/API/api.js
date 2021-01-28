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

//查询管理员没有发布的课程
var getAdminUnpublishedCourseList = function(data){
	return axios.get('/get_admin_unpublished_course_list?user_id='+data.user_id+'&per_page='+data.per_page+'&page='+data.page+'&name='+data.name)
}

//管理员查询已归档的课程
var getExpirCourseList = function(data){
	return axios.get('/get_expired_course_list?per_page='+data.per_page+'&page='+data.page)
}

//管理员新建课程
var insertCourse = function(data){
	return axios.post('/insert_course', data,{headers: {'Content-Type':'application/json'}})
}

//管理员新增课程章
var insertCourseChapterCompleted = function(data){
	return axios.post('/insert_course_chapter_completed', data,{headers: {'Content-Type':'application/json'}})
}

//管理员查询课程章下的课件
var getCoursewareByChapterId = function(data){
	return axios.get('/getCoursewareByChapterId?chapterId='+data.chapterId+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询课程节下的课件
var getCoursewareBySectionId = function(data){
	return axios.get('/getCoursewareBySectionId?sectionId='+data.sectionId+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询课程章下的作业
var getAssignmentByChapterId = function(data){
	return axios.get('/getAssignmentByChapterId?chapterId='+data.chapterId+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询课程下的所有课件
var getCoursewareByCourseId = function(data){
	return axios.get('/getCoursewareByCourseId?courseId='+data.courseId+'&kind='+data.kind+'&type='+data.type+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询课程节下的作业
var getAssignmentBySectionId = function(data){
	return axios.get('/getAssignmentBySectionId?sectionId='+data.sectionId+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员查询父级分类
var findParentCategory = function(data){
	return axios.get('/findParentCategory',data)
}

//管理员查询子级分类
var findChildCategory = function(data){
	return axios.get('/findChildCategory?parent_category_id='+data.parent_category_id)
}

// //管理员查询课程下的所有实验
// var findChildCategory = function(data){
// 	return axios.get('/findChildCategory?parent_category_id='+data.parent_category_id)
// }

//管理员查询课件库所有的课件
var getCoursewareAll = function(data){
	return axios.get('/getCoursewareAll?perPage='+data.per_page+'&page='+data.page+'&kind='+data.kind+'&type='+data.type+'&name='+data.name)
}

//管理员查询所有的镜像
var getImagequoteList = function(data){
	return axios.get('/getImagequoteList?kind='+data.kind+'&imageName='+data.imageName+'&page='+data.page+'&perPage='+data.perPage)
}

//管理员删除所选的镜像
var deleteImages = function(data){
	return axios.post('/deleteImages?imagesID='+data.imagesID)
}
//根据班级id获取课程
var getAdminCourseByClassId = function(data){
	return axios.get('get_admin_course_list_by_class_id?class_id='+data.class_id+'&page='+data.page+'&per_page='+data.perPage)
}


//管理员新增镜像
var addImage = function(data){
	return axios.get('/addImage?imageName='+data.imageName+'&introduction='+data.introduction)
}


//管理员新增实验
var insertExperiment = function(data){
	return axios.post('/insertExperiment', data,{headers: {'Content-Type':'application/json'}})
}

//管理员查询所有的题库
var getQuestionBackAll = function(data){
	return axios.get('/getQuestionBackAll?type='+data.type+'&content='+data.content+'&category_id='+data.category_id+'&perPage='+data.perPage+'&page='+data.page)
}

//管理员删除所选题目
var deleteQuestionBackById = function(data){
	return axios.post('/deleteQuestionBackById', data,{headers: {'Content-Type':'application/json'}})
}

//查询实验库列表 
var findExperiment = function(data){
	return axios.get('/findExperimentByCategory?category_id='+data.category_id+'&name='+data.name+'&perPage='+data.perPage+'&page='+data.page)
}

//教师获取作业列表
var getStudentJobList = function (data) {
	return axios.get('/getAssignmentAll?classId=' + data.classId + '&page=' + data.page + '&perPage=' + data.perPage+ '&name=' + data.name+ '&courseId=' + data.courseId+ '&status=' + data.status+ '&chapterId=' + data.chapterId+ '&sectionId=' + data.sectionId)
}

//教师获取作业详情
var getStudentJobDetail = function (data) {
	return axios.get('/getStudentAnswerByAssignmentUserId?userId=' + data.userId + '&page=' + data.page + '&perPage=' + data.perPage+ '&assignmentId=' + data.assignmentId)
}

//教师批改作业
var submitCorrectJob = function (data) {
	return axios.post('/addStudentScore', data, { headers: { 'Content-Type': 'application/json' } })
}
//管理员删除实验
var deleteExperiment =function(data){
	return axios.post('/deleteExperiment?id='+data.id)
} 

export{
	getCity,createToken,login,hardware,online,onlineUsers,searchUser,searchClass,deleteUser,getAdminCourseList,getCourseListByUserId,getCourseById,
	modifyCourseStatus,getCoursewareBySectionId,modifyUser,getAdminUnpublishedCourseList,getCoursewareAll,insertCourse,getExpirCourseList,
	getImagequoteList,deleteImages,addImage,insertExperiment,getAdminCourseByClassId,getQuestionBackAll,deleteQuestionBackById,insertCourseChapterCompleted,
	getCoursewareByChapterId,getAssignmentByChapterId,getAssignmentBySectionId,getCoursewareByCourseId,findParentCategory,findChildCategory,
	getStudentJobList,getStudentJobDetail,submitCorrectJob,findExperiment,deleteExperiment
}

function getJson (data) {
	return qs.stringify(data)
}
