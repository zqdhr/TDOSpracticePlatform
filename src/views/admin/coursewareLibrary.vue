<template>
<div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">

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
        </div>
        
        <div class="fr">
          <a class="btnDefault pointer abtn" @click="click_new">新增课件</a>      
          <div class="d-serach"> 
            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
            <a class="searchBtn pointer"></a>
          </div>
        </div>

      </div>

    </div>

    <div class="coursewareLibrary_box">
        <div class="container">

            <div class="list_box">
                <ul class="list_ul coursewareLibrary_ul  clearfix">
                    <li v-for="(item,index) in experimentList" :key="index">
                        <div class="info padt20">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <a class="icon icon_close pointer" @click="isDelete=true"></a>
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
     <!--删除实验弹出框-->
    <el-dialog :visible.sync="isDelete" width="600px">
      <div slot="title" class="dialog_header">请注意!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前课件吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteCourseWare">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>



   <newdialog  @hidedialog="hidedialog" ref="newdialog"></newdialog>

</div>
</template>
<script>

import newdialog from '@/components/dialog_newCourseware'
export default {
    data(){
        return{
           inplaceholder:'请输入课件名',
            options:[
                {value: '1',label: '内置课件'},{value: '2',label: '教师上传'}
            ],
            typeList:[
                {value: '1',label: '全部'},{value: '2',label: '文档'},{value: '3',label: '视频'}
            ],
             experimentList:[
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
            ],
          
            isDelete:false,
            isnewFilter:false,//新增课件选择
            total:100,
            perPage:8, //8个实验一页
            curPage:1,//设备列表
        }
    },
    components:{
      newdialog
    },
    created(){
        this.cate = this.options[0].value;//默认选中内置课件
        this.type = this.typeList[0].value;//课件类型默认选中全部
    },
    methods:{

        click_new(){
            let that = this;
            that.$refs.newdialog.click_new();
        },
        
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
        //删除课件库确认
        confirmDeleteCourseWare(){
            let that = this;
            that.isDelete = false;
        },

        hidedialog(){
            let that = this;
            that.isnewFilter=false;
        }
       


    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);
</style>