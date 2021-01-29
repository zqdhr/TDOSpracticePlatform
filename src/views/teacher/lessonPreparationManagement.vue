<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                   
                    <div class="fr">
                       <a class="btnDefault pointer abtn"  @click="show_dialog_file=true;archiveManagementisSuccess=false">归档</a>
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
                                        <span class="s-number">共有{{item.numbers=="null"?0:item.numbers}}人参加该门课程</span>
                                    </div>
                                </div>
                                <div class="cell-fun boxsizing">
                                    <a class="btnDefault btn-fun pointer" @click="linkDetail(item.id)">{{item.status==0?'待开课':'已开课'}}</a>
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
          <!--归档弹出框-->
         <el-dialog
           
            :visible.sync="show_dialog_file"
            width="600px">
            <div slot="title" class="dialog_header">
               请注意!
            </div>
            <div class="confirm_dialog_body">
               <p class="dialog_mess" v-if="!archiveManagementisSuccess"><span class="span_icon icon_waring">确认要归档所有已结束的课程吗</span></p>
               <p class="dialog_mess" v-if="archiveManagementisSuccess"><span class="span_icon icon_success">课程归档成功！</span></p>
            </div>
            <div slot="footer" class="dialog-footer " v-if="!archiveManagementisSuccess">
                <a class="btnDefault" @click="archiveManagement">确 认</a>
                <a class="btnDefault"   @click="show_dialog_file = false">取 消</a>
            </div>
             <div slot="footer" class="dialog-footer " v-if="archiveManagementisSuccess">
                <a class="btnDefault"  @click="successConfirm">确 认</a>
         
            </div>
            </el-dialog>
    </div>
</template>
<script>
import {getCourseListByUserId} from '@/API/api';
export default {
    data(){
       return{
            perPage: 10,//每页条数
            curPage:1, //当前页
            total:1,
            inplaceholder:'请输入课程名称',
            courseList:[
            ],
            show_dialog_file:false,
            archiveManagementisSuccess:false,//归档是否成功
       }
    },
    methods:{
        getCourseListByUserId(){
            let that = this;
            that.courseListByUserId(1,10);
        },
        courseListByUserId(per_page,page){
            let that = this;
            let obj = {};
            obj.user_id = sessionStorage.getItem("userId");
            obj.page = page;
            obj.per_page = per_page;
            getCourseListByUserId(obj).then(res=> {
                if(res.code==200){
                    that.courseList = res.data.list;
                    for(let i = 0;i<res.data.list.length;i++){
                        res.data.list[i].numbers==null?res.data.list[i].numbers = 0:res.data.list[i].numbers
                        res.data.list[i].time = res.data.list[i].start_at.replace('T',' ') +'-'+ res.data.list[i].end_at.replace('T',' ');
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
        linkDetail(id){
            let that = this
            that.$store.commit("updateNavindex", 1);
            that.$router.push({path:'/teacher/couseDetail',query:{back:this.$Base64.encode(2), courseId: id}}).catch((err)=>{
                console.log(err)
            })
        },
        //归档管理弹出框确认
        archiveManagement(){
            let that = this;
            that.archiveManagementisSuccess = true
        },
        //归档成功确认
        successConfirm(){
            let that = this;
            that.show_dialog_file = false
        }
    },
    mounted() {
        let that = this;
        that.getCourseListByUserId();
    }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);

</style>