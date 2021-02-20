<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                   
                    <div class="fr">
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off"  v-model="searchText" @keyup.enter="searchCourse"/>
                            <a class="searchBtn pointer" @click="searchCourse"></a>
                        </div>
                    </div>
                </div>
              
            </div>
 <noData :noDataType="noDataType" :dataMess="dataMess" v-if="!hasData"></noData>
               <template v-if="hasData">
            <div class="tea_list">
               <ul class="tab_box courseList_ul">
                    <li v-for="(item,index) in courseList" :key="index">
                        <div class="pic">
                            <img :src="item.pic_url"/>
                        </div>
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
 </template>


        </div>
        <!--备课弹出框-->
        <el-dialog

                :visible.sync="show_dialog_file"
                width="500px">
            <div slot="title" class="dialog_header">
                备课
            </div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess"><span class="span_icon icon_waring">确认备课吗</span></p>
            </div>
            <div slot="footer" class="dialog-footer ">
                <a class="btnDefault" @click="archiveManagement">确 认</a>
                <a class="btnDefault"   @click="show_dialog_file = false">取 消</a>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {getAdminCourseList,prepareCourse} from '@/API/api';
import noData from '@/components/noData.vue'
export default {
    data(){
       return{
            perPage: 10,//每页条数
            curPage:1, //当前页
            searchText:'',
            totalCourse:0,
            inplaceholder:'请输入课程名称',
            courseList:[
                ],
           show_dialog_file:false,
           id:'',
           noDataType:1,  //没有数据展示的样式
           dataMess:'当前暂无课程',
           hasData:false,
       }
    },
    components:{noData},
    methods:{
        getCourseList(){
          let that = this;
          that.getAdminCourseList(10,1,'')
        },
        searchCourse(){
            let that = this;
            let search = that.searchText;
            that.getAdminCourseList(10,1,search);
        },
        getAdminCourseList(per_page,page,search){
            let that = this;
            let obj = {};
            obj.per_page = per_page;
            obj.page = page;
            obj.search = search;
            console.log(obj)
           
            getAdminCourseList(obj).then(res=> {
                if(res.code==200){
                    that.courseList = res.data.list
                    for (let index = 0; index <  that.courseList.length; index++) {
                        that.courseList[index].pic_url = that.$store.state.pic_Url+ that.courseList[index].pic_url
                    }
                    that.hasData=res.data.list.length==0?false:true
                    that.totalCourse = res.data.total
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
            that.getAdminCourseList(10,val,search);
        },

        archiveManagement(){
            let that = this;
            let obj = {};
            obj.user_id = sessionStorage.getItem("userId");
            obj.course_id = that.id;
            prepareCourse(obj).then(res=> {
                if(res.code==200){
                    that.$toast("备课成功",2000)
                    that.$store.commit("updateNavindex", 1);
                    that.$router.push({path:'/teacher/couseDetail',
                        query:{back:this.$Base64.encode(1), courseId: that.id}
                    }).catch((err)=>{
                        console.log(err)
                    })
                }else{
                    that.$toast("备课失败",3000)
                }
            })
        },

        //点击备课跳转详情
        linkDetail(id){
            let that = this
            this.show_dialog_file = true;
            that.id = id;
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