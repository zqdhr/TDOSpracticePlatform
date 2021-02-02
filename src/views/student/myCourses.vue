<template>

    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">

                    <div class="fl">
                        <el-date-picker
                            v-model="value2"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                             @change="changeDate"
                             value-format=" yyyy-MM-dd" format="yyyy-MM-dd"
                            >
                        </el-date-picker>
                    </div>
                   
                    <div class="fr">
                       
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" v-model="searchText" maxlength="25" v-emoji
                            />
                            <a class="searchBtn pointer"  @click="click_search"></a>
                        </div>
                    </div>
                </div>
              
            </div>
            <noData :noDataType="noDataType" :dataMess="dataMess" v-if="!hasData"></noData>
            <template v-if="hasData">
            <div class="tea_list">
               <ul class="tab_box courseList_ul lp_courseList_ul">
                    <li v-for="(item,index) in courseList" :key="index">
                        <div class="pic"></div>
                        <div class="course-info boxsizing">
                            <div class="info_box">
                                <div class="cell-info boxsizing">
                                    <p class="p-name textline1">{{item.name}}</p>
                                    <p class="p-text textline1">共有{{item.chapter_number}}个章节，共{{item.section_number}}个知识点</p>
                                    <p class="p-text textline1">课程简介：{{item.introduction}}</p>
                                    <div class="data-box">
                                        <span class="s-time">课程时间：{{item.start_at!=null && item.end_at!=null? item.start_at.replace('T', ' ') + '-' + item.end_at.replace('T', ' '):'暂未设置时间'}}</span>
                                        <span class="s-number">参与人数：共有{{item.numbers==null?'0':item.numbers}}人参加该门课程</span>
                                    </div>
                                </div>
                                <div class="cell-fun boxsizing">                             
                                    <a class="btnDefault btn-fun pointer"  @click="linkDetail(item.id)">查看详情</a>
                                  
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

            
            </template>

        </div>
       
    </div>
</template>
<script>
import noData from '@/components/noData.vue'
import {student_getCourseList} from '@/API/api';

export default {
    data(){
        return{
           
            inplaceholder:'请输入课程名称',
            courseList:[
            
            ],
         
            searchText:'',
            pickerOptions: {
          
            },

            value2: '',
            noDataType:1,  //没有数据展示的样式
            dataMess:'当前暂无课程列表',
            hasData:true,
            perPage: 10,//每页条数
            curPage:1, //当前页
            total:1,

            start:'',
            end:'',

        }
    },
    components:{noData},
    created(){
        let that = this;
        that.userId=sessionStorage.getItem("userId")
        let obj = {}
     
          // obj.name = ''
        that.getDataList(obj)   
    },
    methods:{
          //底部分页
        handleCurrentChange(val) {
            let that = this;       
            console.log(`当前页: ${val}`);
        },
        //查看详情
        linkDetail(id){
            let that = this;
            that.$router.push({path:'/student/courseDetail',query:{courseId:id}}).catch((err)=>{
            })
        },
        changeDate(val){
            let that = this;
            let obj = {}
            that.start = val[0];
            that.end = val[1];
            obj.start = val[0];
            obj.end = val[1];

            that.getDataList(obj)  
        },
        //搜索
        click_search(){
           let that = this;
           let obj = {};
          
           if(that.searchText == ''){
               that.$toast('请先输入课程名称')
               return false;
           }
           obj.name = that.searchText;
           obj.start =  that.start
           obj.end = that.end
           that.getDataList(obj)  
        },
        //获取我的课程列表
        getDataList(obj){
            let that = this;  
            obj.user_id = that.userId
            obj.per_page = that.perPage
            obj.page = that.curPage  
            student_getCourseList(obj).then(res=>{   
                if(res.code==200){

                    that.courseList = res.data.list
                    if(res.data.list.length==0){
                        
                        that.hasData = false
                    }
                }else{
                     this.$toast(res.message, 3000);
                }
            })
        }
    }

}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);

</style>
