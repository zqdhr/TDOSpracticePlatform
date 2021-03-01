<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">

                    <div class="fl">
                        <div class="sel-box">
                          <el-select v-model="coursetype"
                                     @change="selectCourse"
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
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" v-model="paramData.name"  @keyup.enter="onEnterPress(paramData.name)" v-emoji/>
                            <a class="searchBtn pointer" @click="searchCourse" ></a>
                        </div>
                    </div>
                </div>

            </div>
            <template v-if="isHasData">
            <div class="tea_list">
               <ul class="tab_box courseList_ul lp_courseList_ul">
                    <li v-for="(item,index) in courseList" :key="index">
                        <div class="pic"><img :src="$store.state.pic_Url+item.pic_url"></div>
                        <div class="course-info boxsizing">
                            <div class="info_box">
                                <div class="cell-info boxsizing">
                                    <p class="p-name textline1">{{item.name}}</p>
                                    <p class="p-text textline1">共有{{item.chapter_number}}个章节，共{{item.small_section_number}}个知识点</p>
                                    <p class="p-text textline1">{{item.introduction}}</p>
                                    <div class="data-box">
                                        <span class="s-time">
                                            {{
                                                item.start_at != null && item.end_at != null
                                                    ? item.start_at.replace("T", " ") +
                                                    "-" +
                                                    item.end_at.replace("T", " ")
                                                    : "暂未设置时间"
                                                }}
                                        </span>
                                        <span class="s-number">共有{{item.numbers==null?0:item.numbers}}人参加该门课程</span>
                                    </div>
                                </div>
                                <div class="cell-fun boxsizing">
                                    <!--点击归档课程状态是已结束-->
                                    <a class="btnDefault btn-fun pointer" v-if="coursetype==0" @click="linkDetail(item.id)">{{item.status==0?'待发布':'已发布'}}</a>
                                    <a class="btnDefault btn-fun pointer" v-if="coursetype==1" @click="linkDetail(item.id)">已结束</a>
                                </div>
                            </div>
                        </div>
                        <a class="icon_delete pointer" @click="isDeleteCourse(item)" v-if="item.status==0"></a>
                    </li>
               </ul>

            </div>
            <div class="tab-pagination">
                <el-pagination
                        background
                        :current-page="paramData.page"
                        :page-size="paramData.per_page"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next,jumper"
                        :total="total"
                    >
                </el-pagination>
            </div>

            </template>

            <nodata :dataMess="dataMess" noDataType='1' v-if="!isHasData"></nodata>

        </div>

         <!--删除人员弹出框-->
       <el-dialog :visible.sync="isDelete" width="560px">
      <div slot="title" class="dialog_header">警告!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前课程吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">

        <a class="btnDefault" @click="isDelete = false">取 消</a>
        <a class="btnDefault" @click="confirmDeleterCourse">确 认</a>
      </div>
    </el-dialog>

    </div>
</template>
<script>
import {getAdminUnpublishedCourseList,getExpirCourseList,removeCourseById,getChangedCourseList} from '@/API/api';
import nodata from '@/components/noData'
export default {
    data(){
       return{
            perPage: 8,//每页条数
            curPage:1, //当前页
            total:1,
            inplaceholder:'请输入课程名称',
            courseList:[

            ],
            coursetypeList:[{value:0,label:'我的课程'},{value:1,label:'归档课程'}],
            coursetype:'我的课程',
            searchText:'',
            isDelete:false,
            dataMess:'暂无课程列表',
            isHasData:true,//是否有数据 默认有数据
            courseId:'',

            paramData:{ //查询数据的参数
               user_id:'',
               per_page:6,
               page:1,
               name:'',
               status:'',
            }
       }
    },
    components:{nodata},
    created(){
      this.coursetype = this.coursetypeList[0].value
       this.paramData.user_id=sessionStorage.getItem("userId")

    },
    methods:{
        getAdminUnpublishedCourseList(){
            let that = this;
            that.getAdminCourseList();
        },

        //获取管理员未发布课程
        getAdminCourseList(){
            let that = this;

            getAdminUnpublishedCourseList(that.paramData).then(res=> {
                if(res.code==200){
                    that.courseList = res.data.list;
                    res.data.total==0 ? that.isHasData = false :that.isHasData = true
                    for(let i = 0;i<res.data.list.length;i++){
                        res.data.list[i].numbers==null?res.data.list[i].numbers = 0:res.data.list[i].numbers
                        if(res.data.list[i].start_at !=null && res.data.list[i].end_at !=null) {
                            res.data.list[i].time = res.data.list[i].start_at.replace('T', ' ') + '-' + res.data.list[i].end_at.replace('T', ' ');
                        }
                    }

                    that.total = res.data.total;


                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        //删除课程
        isDeleteCourse(item){
            let that = this;
            that.isDelete = true;
            that.courseId = item;
        },
        getExpirCourseList(){
            let that = this;
            let obj = {};
            obj.per_page = that.paramData.per_page;
            obj.page = that.paramData.page;
            obj.name = that.searchText;
            getChangedCourseList(obj).then(res=> {
                if(res.code==200){
                    that.courseList = res.data.list;
                    res.data.total==0 ? that.isHasData = false :that.isHasData = true
                    that.total = res.data.total;
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        selectCourse(){
            let that = this;
            that.coursetype ==0 ? that.getAdminUnpublishedCourseList() : that.getExpirCourseList();that.dataMess = '暂无归档课程'
        },
        onEnterPress(searchKeyword){
            this.getAdminCourseList(searchKeyword)
        },
        searchCourse(){
            let that = this;
            that.getAdminCourseList();
        },
        //底部分页
        handleCurrentChange(val) {
            let that = this;
            that.paramData.page = val
           that.coursetype ==0 ? that.getAdminCourseList() : that.getExpirCourseList();

        },
        //点击备课跳转详情
        linkDetail(id){
            let that = this
            that.$store.commit("updateNavindex", 1);
            that.$router.push({path:'/admin/courseDetail',query:{courseId:id}}).catch((err)=>{
                console.log(err)
            })
        },
        //点击新建课程跳转
        linkNewCourse(){
            let that = this;
            that.$router.push({path:'/admin/newCourse',query:{back:this.$Base64.encode(2)}}).catch((err)=>{
                console.log(err)
            })
        },

        //课程确认删除
        confirmDeleterCourse(){
            let that = this;
            console.log(that.courseId)
            let obj = {};
            obj.course_id  = that.courseId.id
            obj.owner_id = that.courseId.owner_id
            removeCourseById(JSON.stringify(obj)).then(res=> {
                if(res.code==200){
                    that.isDelete = false;
                    if(that.paramData.page!=1){
                        if(that.total == 1){
                            that.paramData.page = that.paramData.page-1;
                        }

                    }

                    that.getAdminCourseList();
                }else{
                    this.$toast(res.message,2000)
                }
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
.lp_courseList_ul li{position:relative;}
.icon_delete{width:20px;height: 20px;display: block; background: url(../../assets/img/blue_close.png) center no-repeat; position: absolute; right:20px;top:20px}
</style>
