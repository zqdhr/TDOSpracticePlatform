<!--课程实验-->
<template>
    <div class="experiment_box">
         <div class="exper_main">
            <courseNav></courseNav>
            <div class="right_box">
                <div class="add_btn_box">
                    <a class="btnDefault pointer" @click="click_new">新增实验</a>
                </div>
                <div class="list_box">
                    <ul class="list_ul clearfix">
                        <li v-for="(item,index) in experimentList" :key="index">
                            <div class="info">
                                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                   <a class="icon icon_close pointer"></a>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="设置" placement="top">
                                   <a class="icon icon_set pointer"></a>
                                </el-tooltip>
                                <div class="pic">
                                    <div class="pic_box"></div>
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
    </div>
</template>
<script>
import courseNav from "@/components/left_courseNav.vue";
import newdialog from "@/components/teacher_new_experiment.vue";
export default {
    data(){
        return{
            experimentList:[
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
               {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
            ],
            perPage:8, //8个实验一页
            curPage:1//设备列表
        }
    },
    components:{
        courseNav,newdialog
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
.list_box{ overflow: hidden;
    .list_ul{ margin-left: -10px; margin-right: -10px;
        li{width:25%;min-height: 40px;float: left; margin-bottom: 20px; }    
        .pic{width:100%; margin-bottom: 10px;
          .pic_box{padding-bottom:50%; background:blanchedalmond;.borderRadius(5px,5px,0,0);}
        }   
        .info{margin: 0 10px; min-height: 30px;background: @background; padding: 40px 0 20px 0; position:relative;}
        .p-text{font-size: 16px;color:@fontColor; text-align: center; padding: 2px 8px;}
        .icon{width: 20px;height: 20px;display: block; position:absolute;top:10px}
        .icon_close{background: url(../assets/img/n_close.png) center no-repeat;right:28px}
        .icon_set{background: url(../assets/img/n_set.png) center no-repeat;right:0px}
    }
}

@media screen and (max-width:1440px) {
    .experiment_box{
        .right_box{ margin-left:290px;}
    }
}
</style>