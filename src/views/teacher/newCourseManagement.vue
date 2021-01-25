<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                   
                    <div class="fr">
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off"  v-model="searchText" />
                            <a class="searchBtn pointer" @click="searchCourse"></a>
                        </div>
                    </div>
                </div>
              
            </div>

            <div class="tea_list">
               <ul class="tab_box courseList_ul">
                    <li v-for="(item,index) in courseList" :key="index">
                        <div class="pic"></div>
                        <div class="course-info boxsizing">
                            <div class="info_box">
                                <div class="cell-info boxsizing">
                                    <p class="p-name textline1">{{item.name}}</p>
                                    <p class="p-text textline1">共有{{item.chapter_number}}个章节，共{{item.section_number}}个知识点</p>
                                    <p class="p-text textline1">{{item.introduction}}</p>
                                </div>
                                <div class="cell-fun boxsizing">
                                    <a class="btnDefault btn-fun pointer" @click="linkDetail(item.id)">备课</a>
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
                        :total="totalCourse"
                    >
                </el-pagination>
            </div>

        </div>
    </div>
</template>
<script>
import {getAdminCourseList} from '@/API/api';
export default {
    data(){
       return{
            perPage: 10,//每页条数
            curPage:1, //当前页
            searchText:'',
            totalCourse:0,
            inplaceholder:'请输入课程名称',
            courseList:[
                ]
       }
    },
    methods:{
        getCourseList(){
          let that = this;
          that.getAdminCourseList(10,0,'')
        },
        searchCourse(){
            let that = this;
            let search = that.searchText;
            getAdminCourseList(10,0,search);
        },
        getAdminCourseList(per_page,page,search){
            let that = this;
            let obj = {};
            obj.per_page = per_page;
            obj.page = page;
            obj.search = search;
            getAdminCourseList(obj).then(res=> {
                if(res.code==200){
                    that.courseList = res.data.list
                    that.totalCourse = res.data.size
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        //底部分页
        handleCurrentChange(val) {
           console.log(`当前页: ${val}`);
            let that = this;
            let search = that.searchText;
            getAdminCourseList(10,val-1,search);
        },

        //点击备课跳转详情
        linkDetail(id){
            let that = this
            that.$store.commit("updateNavindex", 1);
            that.$router.push({path:'/teacher/couseDetail',
                query:{back:this.$Base64.encode(1), course_id: id}
            }).catch((err)=>{
                console.log(err)
            })
        }
    },
    mounted() {
        let that = this;
        that.jwt = sessionStorage.getItem('jwt')
        that.getCourseList();
    },
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>