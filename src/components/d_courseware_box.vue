<!--课程课件-->
<template>
    <div class="experiment_box">
         <div class="exper_main">
            <courseNav @getData = "getData"></courseNav>
            <div class="right_box">
                <div class="add_btn_box clearfix ">
                    <div class="sel-box">               
                         <el-select v-model="cate" placeholder="请选择课件分类" @change="selectCate">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>               
                    </div>
                     <div class="sel-box">               
                         <el-select v-model="type" placeholder="请选择课件类型" @change="selectType">
                            <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>               
                    </div>
                    <!--学生点击课程详情没有新增课件-->
                    <a class="btnDefault pointer" @click="click_new" v-if="sindex != '' || cindex !=''">新增课件</a>
                </div>
                <div class="list_box">
                    <ul class="list_ul clearfix">
                        <li v-for="(item,index) in experimentList" :key="index">
                            <div class="info">
                                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                   <a class="icon icon_close pointer" @click="click_delete(item)"></a>
                                </el-tooltip>
                                <!--
                                <el-tooltip class="item" effect="dark" content="设置" placement="top">
                                   <a class="icon icon_set pointer"></a>
                                </el-tooltip>
                                -->
                                <div class="icon-box">
                                    <span class="c_icon" :class="{'icon_video':item.type==0,'icon_pdf':item.type==1}"></span>
                                </div>
                                <p class="p-text textline1 p-name">{{item.name}}</p>
                                <div class="line"></div>
                                <p class="p-text textline1">课件大小：{{item.size}}</p>
                                <p class="p-text textline1">视频时长：{{item.duration}}</p>
                                <!---
                                <p class="p-text textline1">文档页数：共16页</p>
                                -->
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="page_box">
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
         <!--删除弹出框-->
        <el-dialog :visible.sync="isDelete" width="600px">
        <div slot="title" class="dialog_header">请注意!</div>
        <div class="confirm_dialog_body">
            <p class="dialog_mess">
            <span class="span_icon icon_waring">确定要删除该课件吗？</span>
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <a class="btnDefault" @click="confirmDelete">确 认</a>
            <a
            class="btnDefault"
            @click="isDelete = false;"
            >取 消</a
            >
        </div>
        </el-dialog>
        <newdialog   ref="newdialog"></newdialog>
        
    </div>
</template>
<script>
import courseNav from "@/components/left_courseNav.vue";
import newdialog from '@/components/dialog_newCourseware';
import {getCoursewareByCourseId,getCoursewareByChapterId,getCoursewareBySectionId} from '@/API/api';
export default {
    data(){
        return{
            options:[
                {value: '0',label: '内置课件'},{value: '1',label: '教师上传'}
            ],
            typeList:[
                {value: '',label: '全部'},{value: '0',label: '文档'},{value: '1',label: '视频'}
            ],
            cate:'内置课件',//课件分类默认内置课件
            type:'全部',//课件类型默认全部
            experimentList:[
            ],
            perPage:8, //8个实验一页
            curPage:1,//设备列表
            isDelete:false,//是否删除弹出框是否显示
            total:1,
            kind:0,
            typeware:'',
            cindex:'',
            sindex:''
        }
    },
    props:{
        role:{
            default:0, //默认是0传过来3表示是学生点击课程详情
        }
    },
    components:{
        courseNav,newdialog
    },
     created(){
        this.cate = this.options[0].value;//默认选中内置课件
        this.type = this.typeList[0].value;//课件类型默认选中全部
    },
    mounted(){
        let that = this;
        that.getAllCoursewareByCourseId();
    },
    methods:{
        getCoursewareByCourseId(perPage,page,kind,type){
            let that = this;
            let obj = {};
            obj.courseId = this.$route.query.courserId
            obj.kind = kind;
            obj.type = type;
            obj.perPage = perPage;
            obj.page = page;
            getCoursewareByCourseId(obj).then(res=> {
                if(res.code==200){
                    that.total = res.data.total;
                    that.experimentList = res.data.list;
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        getAllCoursewareByCourseId(){
            let that = this;
            that.getCoursewareByCourseId(10,1,0,'');
        },
        getCoursewareByChapterId(chapterId,kind,type,perPage,page){
            let that = this;
            let obj = {};
            obj.chapterId = chapterId
            obj.kind = kind;
            obj.type = type;
            obj.perPage = perPage;
            obj.page = page;
            getCoursewareByChapterId(obj).then(res=> {
                if(res.code==200){
                    that.total = res.data.total;
                    that.experimentList = res.data.list;
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        getCoursewareBySectionId (sectionId,kind,type,perPage,page){
            let that = this;
            let obj = {};
            obj.sectionId = sectionId
            obj.kind = kind;
            obj.type = type;
            obj.perPage = perPage;
            obj.page = page;
            getCoursewareBySectionId(obj).then(res=> {
                if(res.code==200){
                    that.total = res.data.total;
                    that.experimentList = res.data.list;
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        getData(data){
            let that = this;
            console.log(data.cindex)
            console.log(data.sindex)
            that.cindex = data.cindex;
            that.sindex = data.sindex;
            if(data.sindex == ""){
                that.getCoursewareByChapterId(data.cindex,0,'',10,1)
            }else{
                that.getCoursewareBySectionId(data.sindex,0,'',10,1)
            }
        },
         //底部分页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },

        //选择分类
        selectCate(val){
            console.log(val)
            let that = this;
            that.kind = val
            if(that.sindex == "" && that.cindex == ""){
                that.getCoursewareByCourseId(10,1,val,that.typeware);
            }else if (that.sindex == "" && that.cindex != ""){
                that.getCoursewareByChapterId(that.cindex,val,that.typeware,10,1)
            }else{
                that.getCoursewareByChapterId(that.sindex,val,that.typeware,10,1)
            }
        },

        //选择课件类型
         selectType(val){
            console.log(val)
             let that = this;
            that.typeware = val;
             if(that.sindex == "" && that.cindex == ""){
                 that.getCoursewareByCourseId(10,1,that.kind,val);
             }else if (that.sindex == "" && that.cindex != ""){
                 that.getCoursewareByChapterId(that.cindex,that.kind,val,10,1)
             }else{
                 that.getCoursewareByChapterId(that.sindex,that.kind,val,10,1)
             }
        },

        //是否删除
        click_delete(){
            let that = this;
            that.isDelete = true;
        },
        //删除弹出确认
        confirmDelete(){
            let that = this;
            that.isDelete = false;
        },
         click_new(){
            let that = this;
            that.$refs.newdialog.click_new();
        },
    }
}
</script>
<style lang="less" scoped>
.experiment_box{
    margin-top: 30px;min-height: 600px;
    .exper_main{width:100%;height: 100%; position: relative;;}
    .right_box{ margin-left: 330px;}
}

.page_box{text-align:right;}
.add_btn_box{padding-bottom:15px; text-align:right;}

.sel-box{float: left; margin-right: 30px;}
/*列表*/
.list_box{ overflow: hidden; min-height:450px;
    .list_ul{ margin-left: -10px; margin-right: -10px;
        li{width:25%;min-height: 40px;float: left; margin-bottom: 20px; }    
      
        .info{margin: 0 10px; min-height: 30px;background: @background; padding: 40px 0 20px 0; position:relative;}
        .p-text{font-size: 16px;color:@fontColor; text-align: center; padding: 2px 8px;}
        .icon{width: 20px;height: 20px;display: block; position:absolute;top:10px;user-select: none;}
        .icon_close{background: url(../assets/img/n_close.png) center no-repeat;right:15px}
        .icon_set{background: url(../assets/img/n_set.png) center no-repeat;right:28px}
        .p-name{padding:12px 0;}
        .c_icon{width:58px;height: 58px;margin:0 auto; display: block;}
        .icon_video{background: url(../assets/img/courseware_video.png) center no-repeat;}
        .icon_pdf{background: url(../assets/img/courseware_pdf.png) center no-repeat;}

        .line{margin: 0 30px; height: 2px; background: @linecoloe; margin-bottom: 10px;}
    }
}

@media screen and (max-width:1440px) {
    .experiment_box{
        .right_box{ margin-left:290px;}
    }
}
</style>