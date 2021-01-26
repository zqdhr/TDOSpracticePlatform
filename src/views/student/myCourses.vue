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
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                   
                    <div class="fr">
                       
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" v-model="searchText"/>
                            <a class="searchBtn pointer" ></a>
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
                                    <p class="p-text textline1">课程简介{{item.introduction}}</p>
                                    <div class="data-box">
                                        <span class="s-time">课程时间：{{item.time}}</span>
                                        <span class="s-number">参与人数：共有{{item.numbers}}人参加该门课程</span>
                                    </div>
                                </div>
                                <div class="cell-fun boxsizing">
                               
                                    <a class="btnDefault btn-fun pointer"  @click="linkDetail">查看详情</a>
                                  
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
export default {
    data(){
        return{
           perPage: 10,//每页条数
            curPage:1, //当前页
            total:1,
            inplaceholder:'请输入课程名称',
            courseList:[
              {name:'课程名称课程名称课程名称课程名称课程名称',introduction:'描述内容描述内容描述内容描述内容',chapter_number:10,section_number:20,time:'2020.9.12-2020.10.12',numbers:20}
            ],
         
            searchText:'',
            pickerOptions: {
          
            },

        value2: ''
        }
    },
    methods:{
          //底部分页
        handleCurrentChange(val) {
            let that = this;
            that.getAdminCourseList(sessionStorage.getItem("userId"),10,val,that.searchText);
             console.log(`当前页: ${val}`);
        },
        //查看详情
        linkDetail(){
            let that = this;
            that.$router.push({path:'/student/courseDetail'})
        }
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);

</style>
