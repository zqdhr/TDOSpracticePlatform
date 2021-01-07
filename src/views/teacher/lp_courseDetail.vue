<template>
    <div class="pp_main boxsizing detail_main">
        <div class="container">
            <div class="pageTab">
                <div class="mess">
                    当前位置：<a class="pointer" @click="back">课程管理</a> > <span>区块链密码学（待发布）</span>
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
                                <p class="r_name">课程名称课程名称课程名称课程名称课程名称课程名称</p>

                                <div class="d-cel">
                                    共有10个章节，20个知识点
                                </div>
                                <!--已开课才有这个信息-->
                                <div class="d-cel clearfix">
                                    <div class="fl">课程时间：2020.9.12-2020.10.12</div>
                                    <div class="fr">60人学习</div>
                                </div>
                                <div class="line"></div>
                                 <el-scrollbar class="content_el-scrollbar">
                                    <div class="d-cel">

                                        包含内容：内容描述内容描述内容描述内容描述内容描述内容描述内容 
                                        描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内 
                                        容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述 
                                        内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描 
                                        述内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容
                                        内容描述内容描述内容描述。
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
                <div v-if="navindex==0" class="chapter_box">
                    <ul class="chapter_ul">                         
                         <li class="chapter_li" v-for="(item,index) in chapters" :key="index" :class="{'li_focus':item.show}">
                             <div class="textline1 cha_title " :class="{'arrow':!item.show,'arrow_up':item.show}" @click="showSection(item,item.show)">
                                 <span class="s_name">章节{{index+1}}：{{item.name}}</span>
                                 <span class="s_intro">{{item.introduction}}</span>
                             </div>
                             <div class="section_box" v-show="item.show">
                                 <ul class="section_ul">
                                     <li class="section_li" v-for="(iitem,iindex) in item.sections" :key="iindex">
                                         <div class="sec_name textline1">
                                            <p class="textline1">第{{iindex+1}}节：{{iitem.name}}</p>
                                         </div>
                                         <div class="sec_enclosure">
                                             <div>附件包含：
                                                 <span 
                                                  v-for="(i_item,index) in iitem.enclosure.split(',')" :key="index" class="icon" 
                                                  :class="{'s-video':i_item==1,'s-pdf':i_item==2,'s-exper':i_item==3,'s-job':i_item==4}">

                                                 </span>
                                             </div>
                                         </div>
                                     </li>

                                 </ul>
                                 <div class="add-btn-box">
                                    <a class="btnDefault add-btn pointer">+ 新建小节</a>
                                </div>
                             </div>
                         </li>
                    </ul>
                    <div class="add-btn-box">
                        <a class="btnDefault add-btn pointer">+ 新建章节</a>
                    </div>
                </div>
                
                <!--开课时间-->
                <div v-show="navindex==1" class="courseTime_box">
                   <div class="time_table">
                       <div class="v-middle">
                           <div class="din">  
                               <el-date-picker
                                v-model="startTime"
                                :picker-options="pickerOptionsStart"
                                type="date"
                                placeholder="选择开始时间"
                                @focus="clickStartTime"
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
                                :disabled="isSetTime">
                                </el-date-picker>
                            </div>
                            <div class="btnbox">
                                <a class="btnDefault pointer">确认</a>
                            </div>
                       </div>
                   </div>
                </div>

                <div v-show="navindex==2" class="classList_box">
                    <div class="classList_div">
                        <div class="classList_intro">
                            <span class="s1">为已选择班级</span><span class="s2">为未选择班级</span><span class="s3">为已编辑班级</span>
                        </div>
                        <ul class="classList_ul clearfix">
                            <li v-for="(item,index) in classList" :key="index">                               
                                <div class="class_info">
                                    <span class="s-radion"></span>
                                    <p class="p_name">{{item.name}}</p>
                                    <div class="line"></div>
                                    <p class="p_number">(共有{{item.number}}名学员)</p>
                                </div>
                            </li>
                        </ul>  
                    </div>
                    <!--已开课班级列表不可编辑-->
                    <div class="btnbox">
                        <a class="btnDefault">确认选择</a>
                    </div>
                </div>

                <div v-show="navindex==3">课程实验</div>

                <div v-show="navindex==4">课程课件</div>

                <div v-show="navindex==5">课程作业</div>
  
                
            </div>

       
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           backNum:1,
           navindex:2,
           menu:[
               {name:'课程大纲'},
               {name:'开课时间'},
               {name:'学生信息'},
               {name:'课程实验'},
               {name:'课程课件'},
               {name:'课程作业'}
            ],

           picurl:require('../../assets/pic/course.png'),
           chapters:[
                {
                    name:'标题内容标题内容标题内容',
                    introduction:'简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
                    sections:[
                        {
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4' //包含视频，pdf,实验，作业
                        },
                        {
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        }
                    ],
                },
                {
                    name:'标题内容标题内容标题内容',
                    introduction:'简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
                    sections:[
                        {
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        },
                        {
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        }
                    ]
                }
            ],
            startTime:'',//课程开始时间
            endTime:'',//课程结束时间
              // 开始日期 :picker-options 中引用
            pickerOptionsStart: {},
            // 结束日期 :picker-options 中引用
            pickerOptionsEnd: {},
            isSetTime:false,//设置时间是否设置(这个根据课程是否是已开课)

            classList:[//班级列表
                {id:'20100101',name:'四年级六班',number:60}, {id:'20100101',name:'四年级六班',number:60}, {id:'20100101',name:'四年级六班',number:60},
                {id:'20100101',name:'四年级六班',number:60}, {id:'20100101',name:'四年级六班',number:60}, {id:'20100101',name:'四年级六班',number:60}
            ],
            
        }
    },
    created(){
        let that = this;
        that.backNum = that.$route.query.back?that.$Base64.decode(that.$route.query.back):2
       
    },
    mounted(){
        let that = this;
        //章节下拉添加子元素是否显示参数show
        that.chapters.forEach(item => {
           this.$set(item, 'show', false)
        })

        //班级列表添加班级是否被选中状态参数，type 0未选中 1全部选中 2部分选中
      
    },
    methods:{
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
      
        },
        //显示章节
        showSection(item,show){
            let that = this;
            let tmp = that.chapters
            for(var i = 0;i<tmp.length;i++){
               that.$set(that.chapters[i],'show',false)
               
            }

            that.$set(item,'show',!show)
            
            
        }

    },
    filters: {
  
      }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>