<template>
    <div class="pp_main boxsizing detail_main">
        <div class="container">
            <div class="pageTab">
                <div class="mess">
                    当前位置：<a class="pointer" @click="back">课程管理</a> > <span>{{courseName}}</span>
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
                                <p class="r_name">{{courseName}}</p>

                                <div class="d-cel">
                                    共有{{chapterNumber}}个章节，{{sectionNumber}}个知识点
                                </div>
                                <!--已开课才有这个信息-->
                                <div class="d-cel clearfix">
                                    <div class="fl">课程时间：{{time}}</div>
                                    <div class="fr">{{numbers}}人学习</div>
                                </div>
                                <div class="line"></div>
                                 <el-scrollbar class="content_el-scrollbar">
                                    <div class="d-cel">{{introduction}}
                                    </div>
                                 </el-scrollbar>
                                <!--如果状态已开课之后就不可以在修改，按钮不显示-->
                                <div class="btnbox">
                                    <a class="btnDefault pointer btn-course">确认开课</a>
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

                
                <!--开课时间-->
                <div v-if="navindex==1" class="courseTime_box">
                   <div class="time_table">
                       <div class="v-middle">
                           <div class="din">  
                               <el-date-picker
                                v-model="startTime"
                                :picker-options="pickerOptionsStart"
                                type="date"
                                placeholder="选择开始时间"
                                @focus="clickStartTime"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :disabled="isSetTime"
                                >
                                </el-date-picker>
                            </div>
                             <div class="din">  
                               <el-date-picker
                                v-model="endTime"
                                :picker-options="pickerOptionsEnd"
                                type="date"
                                placeholder="选择结束时间"
                                @focus="clickEndTime"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                :disabled="isSetTime">
                                </el-date-picker>
                            </div>
                            <div class="btnbox">
                                <a class="btnDefault pointer" @click="modifyCourseTime()">确认</a>
                            </div>
                       </div>
                   </div>
                </div>
                
                <!--班级列表-->
                <classList v-if="navindex==2" @sureCheckClass="sureCheckClass" ></classList>

        
                
                <!--课程实验-->
                <experiment v-if="navindex==3" ></experiment>
                
                <!--课程课件-->
                <courseware v-if="navindex==4"></courseware>

                <coursework v-if="navindex==5"></coursework>
  
                
            </div>

       
        </div>
    </div>
</template>
<script>
import classList from "@/components/d_classList_box.vue";//学生信息-班级列表

import chapter from "@/components/d_chapter_box.vue";//课程大纲
import experiment from "@/components/d_experiment_box.vue";//课程实验
import courseware from "@/components/d_courseware_box.vue";//课程课件
import coursework from "@/components/d_coursework_box.vue";//课程作业
import {getCourseById,modifyCourseStatus} from '@/API/api';
export default {
    inject:['reload'],
    data(){
        return{
           backNum:1,
           navindex:0,
            introduction:'',
            numbers:'',
            chapterNumber:'',
            sectionNumber:'',
            time:'',
            courseName:'',


           menu:[
               {name:'课程大纲'},
               {name:'开课时间'},
               {name:'学生信息'},
               {name:'课程实验'},
               {name:'课程课件'},
               {name:'课程作业'}
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
            courseId:'',
            course:'111'
            
        }
    },
    components:{classList,chapter,experiment,courseware,coursework},
    created(){
        let that = this;
        that.backNum = that.$route.query.back?that.$Base64.decode(that.$route.query.back):2;
        that.courseId = that.$route.query.courseId;
        that.navindex = that.$store.state.teacherNavindex;
        console.log(that.$store.state.teacherNavindex)
    },
    beforeDestroy(){
        let that = this;
        that.$store.commit("updateTeacherNavindex",0);
    }, 
    mounted(){
        let that = this;
        that.getCourseById();

      
    },
    methods:{
        getCourseById(){
            let course_id = this.$route.query.courseId
            let that = this;
            let obj = {};
            obj.course_id = course_id;
            getCourseById(obj).then(res=> {
                if(res.code==200){
                    that.courseName = res.data.name
                    that.introduction = res.data.introduction
                    that.numbers = res.data.numbers==null?that.numbers = 0:res.data.numbers
                    that.chapterNumber = res.data.chapter_number
                    that.sectionNumber = res.data.section_number
              
                    if(res.data.start_at !='' && res.data.end_at != '' && res.data.start_at !=null && res.data.end_at != null){
                        let ipos1 = res.data.start_at.indexOf("T");
                        let ipos2 = res.data.start_at.indexOf("T");
                        that.startTime = res.data.start_at.substring(0,ipos1)
                        that.endTime =  res.data.end_at.substring(0,ipos2)
                        that.time = res.data.time = res.data.start_at.substring(0,ipos1) +' - '+ res.data.end_at.substring(0,ipos2);
                    }else{
                        that.time = '暂无设置时间';
                    }
                    that.course = res.data
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        modifyCourseTime(){
            let that = this;
            let obj = {};
            obj.owner_id = sessionStorage.getItem('userId');
            obj.course_id = that.$route.query.courseId;

            //that.startTime=that.startTime.getFullYear() + '-' + (that.startTime.getMonth() + 1) + '-' + that.startTime.getDate();
           
            obj.start = that.startTime;
            //that.endTime=that.endTime.getFullYear() + '-' + (that.endTime.getMonth() + 1) + '-' + that.endTime.getDate();
           
            obj.end = that.endTime;
            obj.user_id_list = [];
            console.log(JSON.stringify(obj))
            modifyCourseStatus(JSON.stringify(obj)).then(res=> {
                if(res.code==200){
                    that.reload();
                }else{
                    that.$toast(res.message,3000)
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
            
            if(that.backNum==1){
               that.$router.push({path:'/teacher'}).catch((err)=>{
                   console.log(err)
               })
               that.$store.commit("updateNavindex", 0);
            }else{
                that.$router.push({path:'/teacher/lessonPreparationManagement'}).catch((err)=>{
                   console.log(err)
               })
               that.$store.commit("updateNavindex", 1);
            }
        },

        //页面nav切换
        linkDetails(item,num){
          let that = this;
          that.navindex = num;
          that.$store.commit("updateTeacherNavindex",num);
          sessionStorage.setItem("store",JSON.stringify(this.$store.state))
          that.showStudentList = false
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