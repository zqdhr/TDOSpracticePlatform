<template>
     <div class="pp_main boxsizing">
        <div class="container course_container">
            <div class="pageTab">
                <div class="clearfix">
                    <div class="fl">
                       <div class="sel-box">
                          <el-select v-model="className" placeholder="请选择课程" 
                          @change="changeClass"
                          >
                                <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                         
                       </div>
                    </div>
                    <div class="fr">
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" v-emoji autocomplete="off" v-model="searchContent"  @keyup.enter="doSearch(1)"/>
                            <a class="searchBtn pointer" @click="doSearch(1)"></a>
                        </div>
                    </div>
                </div>
              
            </div>
            <noData :noDataType="noDataType" :dataMess="dataMess" v-if="!hasData"></noData>
              <template v-if="hasData">
            <div class="tablex_box list_box">
                <div class="l_box">
                <ul class="default_List">
                    <li v-for="(item,index) in machineList" :key="index">
                        <div class="info-box">
                        
                            <div class="d-icon"></div>
                            <p class="p_id textline1">学号：{{item.user_id}}</p>
                            <p class="p_id p_name textline1">用户名称：{{item.user_name}}</p>
                            <p class="p_id p_name textline1">实验名称：{{item.experiment_name}}</p>
                            <div class="btnbox">
                                <div class="course_mana_btnbox">
                                    <a class="pointer btn btn-see" @click="startExperiment(item)"><span>查看</span></a>
                                    <a class="pointer btn btn-end" @click="closeStudent(item)"><span>结束</span></a>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                </div>
                <div class="tab-pagination">
                <el-pagination
                    background
                    :current-page="curPage"
                    :page-size="perPage"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next,jumper"
                    :total="total"
                >
                </el-pagination>
                </div>
           
           
            </div>
             </template>
            <!--结束当前学生的实验-->
            <el-dialog :visible.sync="isClose" width="600px">
            <div slot="title" class="dialog_header">请注意!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <!--成功span的class为icon_success-->
                <span class="span_icon icon_waring">是否结束学生{{student.name}}当前实验？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="commitClose">确 认</a>
                <a class="btnDefault" @click="isClose=false">取 消</a>
            </div>
            </el-dialog>
        </div>
      
    </div>
</template>
<script>
import {searchClass,getRunContainerByTeacher,getCourseListByUserId,execContainer} from "@/API/api";
import noData from '@/components/noData.vue'
export default {
    data(){
        return{
           classList:[//班级选择列表
              {label:'班级1',value:'1004'},{label:'班级2',value:'1005'}
           ],
            className:'',//选择的班级名称
            inplaceholder:'请输入用户名称和学号',
            machineList:[
     
            ],
            perPage:24, //虚拟机每页
            curPage:1,//设备列表
            total:0,
            isClose:false,
            student:{//点击关闭学生实验需要的参数
                userid:'',
                name:'',
                containerId:''
            },
            searchContent:'',
            noDataType:1,  //没有数据展示的样式
            dataMess:'当前暂无学生做实验',
            hasData:false,

        }
    },
    created(){
        this.getCourseListByUserId()
        this.getRunContainerByTeacher(1)
    },
    components:{noData},
    methods:{
        //选择班级 
        changeClass(val){
            let that = this
            
            that.getRunContainerByTeacher(1)
            console.log('选择班级'+val)
        },
        //底部分页
        handleCurrentChange(val) {
        let that = this;
        that.getRunContainerByTeacher(val)
        console.log(`当前页: ${val}`);
        },
        //关闭学生实验
        closeStudent(item){
            let that=this
            that.student.userid = item.user_id
            that.student.name = item.user_name
            that.student.containerId = item.container_id
            that.isClose=true
            console.log('当前学生：'+that.student.name+',学号：'+that.student.userid)
        },
        //提交关闭课程请求
        commitClose(){
            let that = this
            let obj = {}
            let containerId = []
            containerId.push(that.student.containerId)
            obj.containerId = containerId
            obj.type = 1
            console.log(obj)
            execContainer(obj).then(res=>{
                if (res.code==200) {
                    that.isClose=false
                    that.getRunContainerByTeacher(1)
                } else {
                    that.isClose=false
                    that.$toast(res.message,3000) 
                    console.log(res.message)
                }       
            })
          
        },
        //点击查看实验
        startExperiment(item){
            let that = this;
            //权限
            let  level = sessionStorage.getItem('p_p-authority')
            that.$router.push({path:'/experiment',query:{
                authority:this.$Base64.encode(level),
                userid:item.user_id,
                experimentId: item.experiment_id,
                courseId:item.course_id
                }}).catch((err) => {
              console.log( err);
           });
        },
      
        //获取班级列表
        getClassList(){
            let that = this;
            searchClass().then(res=> {
                if(res.code==200){
                    that.classList = res.data
                    if(that.classList.length>0){
                        that.className = that.classList[0].id
                        that.getRunContainerByTeacher(1)
                    }
              
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        //获取老师的课程列表
        getCourseListByUserId(){
            let that = this;
            let obj={};
            obj.user_id = sessionStorage.getItem("userId");
            obj.page=1;
            obj.per_page=100;
            obj.search = ''
             getCourseListByUserId(obj).then(res=> {
                if(res.code==200){
                    console.log(res.data)
                    that.classList = res.data.list
                    //  if(that.classList.length>0){
                    //     that.className = that.classList[0].id
                       
                    // }
                    
                }else{
                   
                    that.$toast(res.message,3000)
                }
            })   
        
        },
        //获取课堂列表
        getRunContainerByTeacher(page){
            let that = this
            that.curPage=page
            let obj = {}
            obj.courseId=that.className
            obj.filter = that.searchContent
            obj.page=page
            obj.perPage=that.perPage
            obj.teacherId=obj.user_id = sessionStorage.getItem("userId")
            getRunContainerByTeacher(obj).then(res=> {
                if (res.code==200) {
                    console.log(res.data)
                    that.total = res.data.total
                    that.machineList = res.data.list
                    if(res.data.list.length==0){
                        that.hasData = false
                    }else {
                        that.hasData = true
                    }
                } else {
                    
                     that.$toast(res.message,3000)
                }
            })
        },
        doSearch(page){
            let that = this
            that.getRunContainerByTeacher(page)
        },
       
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>