<!--课程课件-->
<template>
    <div class="experiment_box">
         <div class="exper_main">
            <courseNav></courseNav>
            <div class="right_box">
                <div class="add_btn_box">
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
                         <el-select v-model="type" placeholder="请选择课件类型" @click="selectType">
                            <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>               
                    </div>
                    <a class="btnDefault pointer">新增课件</a>
                </div>
                <div class="list_box">
                    <ul class="list_ul clearfix">
                        <li v-for="(item,index) in experimentList" :key="index">
                            <div class="info">
                                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                   <a class="icon icon_close pointer"></a>
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
                        :total="150"
                    >
                    </el-pagination>
                </div>
            </div>
         </div>
    </div>
</template>
<script>
import courseNav from "@/components/left_courseNav.vue";
export default {
    data(){
        return{
            options:[
                {value: '1',label: '内置课件'},{value: '2',label: '教师上传'}
            ],
            typeList:[
                {value: '1',label: '全部'},{value: '2',label: '文档'},{value: '3',label: '视频'}
            ],
            cate:'内置课件',//课件分类默认内置课件
            type:'全部',//课件类型默认全部
            experimentList:[
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0,},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
            ],
            perPage:8, //8个实验一页
            curPage:1//设备列表
        }
    },
    components:{
        courseNav
    },
     created(){
        this.cate = this.options[0].value;//默认选中内置课件
        this.type = this.typeList[0].value;//课件类型默认选中全部
    },
    methods:{
         //底部分页
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },

        //选择分类
        selectCate(val){
            console.log(val)
        },

        //选择课件类型
         selectType(val){
            console.log(val)
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
.list_box{ overflow: hidden;
    .list_ul{ margin-left: -10px; margin-right: -10px;
        li{width:25%;min-height: 40px;float: left; margin-bottom: 20px; }    
      
        .info{margin: 0 10px; min-height: 30px;background: @background; padding: 40px 0 20px 0; position:relative;}
        .p-text{font-size: 16px;color:@fontColor; text-align: center; padding: 2px 8px;}
        .icon{width: 20px;height: 20px;display: block; position:absolute;top:10px}
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