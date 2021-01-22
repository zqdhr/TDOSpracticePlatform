<template>
    <div class="pp_main boxsizing detail_main">
        <div class="container">
            <div class="pageTab clearfix">
                <div class="mess">
                    当前位置：<a class="pointer" @click="back">课程管理</a> > <span>{{coursrName}}</span>
                </div>
            </div>
        </div>
        <div class="container container_info">
            <div class="info_box">
               
                
                <!--头部课程详细信息-->
                <div class="top_info ">
                     <div class="c_pic"><img :src="picurl"/></div>
                     <div class="c_info">
                         <div class="right_info">
                             <div class="info_detail_box">
                                <p class="r_name">{{coursrName}}</p>

                                <div class="d-cel">
                                    共有{{chapter_number}}个章节，{{section_number}}个知识点
                                </div>
                                <!--已开课才有这个信息-->
                                <div class="d-cel clearfix">
                                    <div class="fl">{{time}}</div>
                                    <div class="fr">{{numbers}}人学习</div>
                                </div>
                                <div class="line"></div>
                                 <el-scrollbar class="content_el-scrollbar">
                                    <div class="d-cel">
                                        {{introduction}}
                                    </div>
                                 </el-scrollbar>
                                <!--如果状态已开课之后就不可以在修改，按钮不显示-->
                                <div class="btnbox">
                                    <a class="btnDefault pointer btn-course">确认发布</a>
                                </div>
                             </div>
                         </div>
                     </div>
                </div>

                 <div class="detail_nav">
                    <a  :class="{'cur':index==navindex}" v-for="(item,index) in menu" :key="index" @click="linkDetails(item,index)">{{item.name}}</a>
                </div>

                 <!--课程大纲-->
                <chapter :courseId="courseId" v-if="navindex==0"></chapter>

                
               
                
                <!--课程实验-->
                <experiment v-if="navindex==1"></experiment>
                
                <!--课程课件-->
                <courseware v-if="navindex==2"></courseware>

                <coursework v-if="navindex==3"></coursework>
  
                
            </div>

       
        </div>
    </div>
</template>
<script>

import chapter from "@/components/d_chapter_box.vue";//课程大纲
import experiment from "@/components/d_experiment_box.vue";//课程实验
import courseware from "@/components/d_courseware_box.vue";//课程课件
import coursework from "@/components/d_coursework_box.vue";//课程作业
import {getCourseById} from '@/API/api';
export default {
    data(){
        return{
            coursrName:'',//课程名称
            introduction:'',
            time:'',
            chapter_number:'',
            section_number:'',
            numbers:'',

           backNum:1,
           navindex:0,
           menu:[
               {name:'课程大纲'},
      
               {name:'实验库'},
               {name:'课件库'},
               {name:'题库'}
            ],

           picurl:require('../../assets/pic/course.png'),
           
            startTime:'',//课程开始时间
            endTime:'',//课程结束时间
              // 开始日期 :picker-options 中引用
            pickerOptionsStart: {},
            // 结束日期 :picker-options 中引用
            pickerOptionsEnd: {},
            isSetTime:false,//设置时间是否设置(这个根据课程是否是已开课)



            showStudentList:false,//是否显示学生列表

            courseId:''
        }
    },
    components:{chapter,experiment,courseware,coursework},
    created(){
        let that = this;
        that.backNum = that.$route.query.back?that.$Base64.decode(that.$route.query.back):2;
        that.courseId = this.$route.query.courserId
       
    },
    mounted(){
        let that = this;
       that.getCourseById();
    },
    methods:{
        getCourseById(){
            let that = this;
            let obj = {};
            obj.course_id = this.$route.query.courserId

            console.log(that.courseId)
            getCourseById(obj).then(res=> {
                if(res.code==200){
                    that.coursrName = res.data.name;
                    that.chapter_number = res.data.chapter_number
                    that.section_number = res.data.section_number;
                    if(res.data.start_at != null && res.data.end_at != null){
                        that.time = res.data.start_at.replace('T', ' ') + '-' + res.data.end_at.replace('T', ' ');
                    }else{
                        that.time = "---";
                    }
                    that.numbers = res.data.numbers == null ? 0 : res.data.numbers
                    that.introduction = res.data.introduction;

                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        clickStartTime() {
        this.pickerOptionsStart.disabledDate = time => {
          if (this.endTime) {
            if (time.getTime() > new Date(this.endTime).getTime()) {
              return true
            }
            if (time.getTime() < Date.now() - 8.64e7) {
              return true
            }
          } else {
            if (time.getTime() < Date.now() - 8.64e7) {
              return true
            }
          }
        }
      },
      clickEndTime(){
        this.pickerOptionsEnd.disabledDate = time => {
          if (this.startTime) {
            return (
              time.getTime() > Date.now || time.getTime() <= new Date(this.startTime).getTime()
            )
          } else {
            return time.getTime() < Date.now()
          }
        }
      },
        back(){
            //返回课堂管理
            let that = this;
            
            that.$router.push({path:'/admin/courseManagement'}).catch((err)=>{
                console.log(err)
            })
        },

        //页面nav切换
        linkDetails(item,num){
          let that = this;
          that.navindex = num;
          that.showStudentList = false
        },
       

        //学生选择确认
        sureStudent(){
          let that = this;
          that.showStudentList = false
          console.log('选择学生确认')
          
        },
        //学生列表返回班级列表
        backClass(){
          this.showStudentList = false;
       
        },
        //班级选择确认
        sureCheckClass(){
            this.showStudentList = true
        }

    },
    filters: {
  
      }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>