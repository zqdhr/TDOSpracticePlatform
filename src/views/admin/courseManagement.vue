<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">

                    <div class="fl">
                        <div class="sel-box">
                          <el-select v-model="coursetype"
                          
                          >
                                <el-option
                                v-for="item in coursetypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                         
                        </div>
                    </div>
                   
                    <div class="fr">
                       <a class="btnDefault pointer abtn"  @click="linkNewCourse">新建课程</a>
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
                            <a class="searchBtn pointer"></a>
                        </div>
                    </div>
                </div>
              
            </div>

            <div class="tea_list">
               <ul class="tab_box courseList_ul lp_courseList_ul">
                    <li v-for="(item,index) in courseList" :key="index">
                        <div class="pic"></div>
                        <div class="course-info boxsizing">
                            <div class="info_box">
                                <div class="cell-info boxsizing">
                                    <p class="p-name textline1">{{item.name}}</p>
                                    <p class="p-text textline1">共有{{item.chapter_number}}个章节，共{{item.section_number}}个知识点</p>
                                    <p class="p-text textline1">{{item.introduction}}</p>
                                    <div class="data-box">
                                        <span class="s-time">{{item.time}}</span>
                                        <span class="s-number">共有{{item.numbers}}人参加该门课程</span>
                                    </div>
                                </div>
                                <div class="cell-fun boxsizing">
                                    <!--点击归档课程状态是已结束-->
                                    <a class="btnDefault btn-fun pointer" v-if="coursetype==0" @click="linkDetail">{{item.state==0?'待发布':'已发布'}}</a>
                                    <a class="btnDefault btn-fun pointer" v-if="coursetype==1" @click="linkDetail">已结束</a>
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
       
    </div>
</template>
<script>
import {getAdminUnpublishedCourseList} from '@/API/api';
export default {
    data(){
       return{
            perPage: 10,//每页条数
            curPage:1, //当前页
            total:1,
            inplaceholder:'请输入课程名称',
            courseList:[
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:0},
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:1},
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:0},
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:1},
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:1}
            ],
            coursetypeList:[{value:0,label:'我的课程'},{value:1,label:'归档课程'}],
            coursetype:'我的课程'
       }
    },
    created(){
	this.coursetype = this.coursetypeList[0].value
       
    },
    methods:{
        getAdminUnpublishedCourseList(){
            let that = this;
            let obj = {};
            obj.user_id = sessionStorage.getItem("userId");
            obj.per_page = 10;
            obj.page = 1;
            getAdminUnpublishedCourseList(obj).then(res=> {
                if(res.code==200){
                    that.courseList = res.data.list;
                    for(let i = 0;i<res.data.list.length;i++){
                        res.data.list[i].numbers==null?res.data.list[i].numbers = 0:res.data.list[i].numbers
                        if(res.data.list[i].start_at !=null && res.data.list[i].end_at !=null) {
                            res.data.list[i].time = res.data.list[i].start_at.replace('T', ' ') + '-' + res.data.list[i].end_at.replace('T', ' ');
                        }
                    }
                    that.total = res.data.list.length;
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        //底部分页
        handleCurrentChange(val) {
           console.log(`当前页: ${val}`);
        },
        //点击备课跳转详情
        linkDetail(){
            let that = this
            that.$store.commit("updateNavindex", 1);
            that.$router.push({path:'/admin/courseDetail',query:{courserId:''}}).catch((err)=>{
                console.log(err)
            })
        },
        //点击新建课程跳转
        linkNewCourse(){
            let that = this;
            that.$router.push({path:'/admin/newCourse',query:{back:this.$Base64.encode(2)}}).catch((err)=>{
                console.log(err)
            })
        }
    },
    mounted() {
        let that = this;
        that.getAdminUnpublishedCourseList();
    }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);

</style>