<!--课程实验-->
<template>
    <div class="experiment_box">
         <div class="exper_main">
            <courseNav @getData = "getData"></courseNav>
            <div class="right_box">
                <div class="add_btn_box">
                    <a class="btnDefault pointer" @click="click_new" v-if="sindex!=''">新增实验</a>
                </div>
                <div class="list_box">
                    <ul class="list_ul clearfix " :class="{'student_list_ul':role==3}">
                        <li v-for="(item,index) in experimentList" :key="index">
                            <div class="info pointer"  @click="link_Detail">
                                <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="role!=3">
                                   <a class="icon icon_close pointer" :class="{'admin_icon_close':role==1}" @click.stop="isDelete=true"></a>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="设置" placement="top" v-if="role!=3 && role!=1">
                                   <a class="icon icon_set pointer" @click.stop="isSet=true"></a>
                                </el-tooltip>
                                 <div class="pic">
                                    <div class="pic_box"><img src="../assets/pic/course.png"/></div>
                                </div>
                                <p class="p-text textline1">{{item.name}}</p>
                                <p class="p-text textline1">实验时长：{{item.duration}}</p>
                                <p class="p-text textline1">截止时间：{{item.endtime}}</p>
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
                        :total="150"
                    >
                    </el-pagination>
                </div>
            </div>
         </div>
         <newdialog   ref="newdialog"></newdialog>
         <experimentDetail ref="experimentDetail"></experimentDetail>
        
         <!--是否删除-->
        <el-dialog :visible.sync="isDelete" width="600px">
            <div slot="title" class="dialog_header">请注意!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <span class="span_icon icon_waring">确定要删除当前实验吗？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault">确 认</a>
                <a class="btnDefault" @click="isDelete = false">取 消</a>
            </div>
        </el-dialog>

        <!--设置时间-->
        <el-dialog :visible.sync="isSet" width="500px">
            <div slot="title" class="dialog_header">请设置时间!</div>
            <div class="setform">
                
                <div class="set-col">
                    <p class="ptitle">课程时间：</p>
                    <div class="dselect">
                        <el-select v-model="time" placeholder="请选择" style="width:100%">
                            <el-option
                            v-for="item in timeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                 <div class="set-col">
                    <p class="ptitle">报告要求：</p>
                    <div class="dselect">
                        <el-input type="textarea" :rows="5" resize="none"/>
                    </div>
                </div>
                 <div class="set-col">
                    <p class="ptitle">实验报告截止时间：</p>
                    <div class="dselect">
                        <el-date-picker style="width:100%" :picker-options="pickerOptions"
                            v-model="endTime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault">确 认</a>
                <a class="btnDefault" @click="isSet = false">取 消</a>
            </div>
        </el-dialog>
        

    </div>
</template>
<script>
import courseNav from "@/components/left_courseNav.vue";
import newdialog from "@/components/teacher_new_experiment.vue";
import experimentDetail from '@/components/experimentDetail'
import {getCoursewareByCourseId,getCoursewareByChapterId,getCoursewareBySectionId} from '@/API/api';
export default {
    data(){
        return{
            experimentList:[
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
            ],
            perPage:8, //8个实验一页
            curPage:1,//设备列表
            isDelete:false,//是否删除
            isSet:false,//设置
            time:'',
            timeOptions: [{
                value: '30分钟',
                label: '30分钟'
                }, {
                value: '45分钟',
                label: '45分钟'
                }, {
                value: '60分钟',
                label: '60分钟'
                }, {
                value: '75分钟',
                label: '75分钟'
                }, {
                value: '90分钟',
                label: '90分钟'
                },{
                value: '105分钟',
                label: '105分钟'
                },{
                value: '120分钟',
                label: '120分钟'
                }
            ],
             pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            } ,
            endTime:'',
            sindex:''
        }
    },
    props:{
        role:{
            default:0, //默认是0传过来3表示是学生点击课程详情
        }
    },
    created(){
        let that = this;
        that.time = that.timeOptions[1].value
    },
    components:{
        courseNav,newdialog,experimentDetail
    },
    methods:{
         //底部分页
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        click_new(){
            let that = this;
            that.$refs.newdialog.click_new();
        },
         //查看实验详情
        link_Detail(){
          let that = this;
          that.isNewExperiment = true;
          that.$refs.experimentDetail.click_Detail();

        },
        getData(data){
            let that = this;
            //console.log(data.cindex)
            //console.log(data.sindex)
            that.sindex = data.sindex;
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

/*列表*/
.list_box{ overflow: hidden; min-height:500px;
    .list_ul{ margin-left: -10px; margin-right: -10px;
        li{width:25%;min-height: 40px;float: left; margin-bottom: 20px; }    
        .pic{width:100%; margin-bottom: 10px;
          .pic_box{padding-bottom:50%; background:blanchedalmond;.borderRadius(5px,5px,0,0); position: relative;}
          img{width:100%;height:100%;position: absolute;}
        }  
        /*.trans{position: absolute;width:100%;height: 100%;left:0px;top:0px; background: rgba(0,0,0,.1);} */
        .info{margin: 0 10px; min-height: 30px;background: @background; padding: 40px 0 20px 0; position:relative;}
        .p-text{font-size: 16px;color:@fontColor; text-align: center; padding: 2px 8px;}
        .icon{width: 20px;height: 20px;display: block; position:absolute;top:10px}
        .icon_close{background: url(../assets/img/n_close.png) center no-repeat;right:28px}
        .icon_set{background: url(../assets/img/n_set.png) center no-repeat;right:5px}
        .admin_icon_close{right: 15px;}
    }
    .student_list_ul{
        .info{padding-top: 0px;}
    }
}

.setform{margin: 0 30px;
  .ptitle{font-size: 16px; padding:10px 0;}
}
.dselect{width:100%;}

@media screen and (max-width:1440px) {
    .experiment_box{
        .right_box{ margin-left:290px;}
    }
}
</style>