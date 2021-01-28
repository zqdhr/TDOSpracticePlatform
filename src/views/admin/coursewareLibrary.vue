<template>
<div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
            <div class="sel-box">
                <el-select v-model="customClass" placeholder="自定义分类" @change="selectType" >
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" > </el-option>
                </el-select>
            </div>
            <div class="sel-box" v-if="customClass!=''">
                <el-select v-model="i_customClass" placeholder="自定义分类" @change="selectType1" >
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" > </el-option>
                </el-select>
            </div>

            <div class="sel-box" v-if="i_customClass!=''">
                <el-select v-model="ii_customClass" placeholder="自定义分类" @change="selectType2" >
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" > </el-option>
                </el-select>
            </div>
            <div class="sel-box">               
                <el-select v-model="cate" placeholder="请选择课件分类" @change="selectCourseWareType">
                    <el-option
                    v-for="item in catoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>               
            </div>
            <div class="sel-box">               
                <el-select v-model="type" placeholder="请选择课件类型" @change="selectCate">
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
            <input :placeholder="inplaceholder" type="text" autocomplete="off" v-model="searchText"/>
            <a class="searchBtn pointer" @click="searchCourse"></a>
          </div>
        </div>

      </div>

    </div>

    <div class="coursewareLibrary_box">
        <div class="container">

            <div class="list_box">
                <ul class="list_ul coursewareLibrary_ul  clearfix">
                    <li v-for="(item,index) in experimentList" :key="index">
                        <div class="info padt20 boxShadow">
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



   <newdialog   ref="newdialog"></newdialog>

</div>
</template>
<script>
import { getCoursewareAll} from "@/API/api";
import newdialog from '@/components/admin_dialog_newCourseware'
export default {
    data(){
        return{
           inplaceholder:'请输入课件名',
            catoptions:[
                {value: '0',label: '内置课件'},{value: '1',label: '教师上传'}
            ],
            typeList:[
                {value: '',label: '全部'},{value: '1',label: '文档'},{value: '0',label: '视频'}
            ],
             experimentList:[
            ],
          
            isDelete:false,
            isnewFilter:false,//新增课件选择
            total:1,
            perPage:8, //8个实验一页
            curPage:1,//设备列表
            cate:'',
            type:'',
            searchText:'',
             customClass:'',//自定义分类
            i_customClass:'',//自定义分类,
            ii_customClass:'',//自定义分类
            options:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options1:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options2:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
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
         //自定义分类
        selectType(val){

        },
        //自定义分类
        selectType1(val){

        },
        //自定义分类
        selectType2(val){

        },
        //课件列表
        getCoursewareAll() {
            let that = this;
            that.getCourseAll(10,1,'',0,'');
        },

        getCourseAll(per_page,page,kind,type,name){
            let that = this;
            let obj = {};
            obj.per_page = per_page;
            obj.page = page;
            obj.kind = kind;
            obj.type = type;
            obj.name = name;
            getCoursewareAll(obj).then((res) => {
                if (res.code == 200) {
                    that.experimentList = res.data.list;
                    console.log(that.experimentList)
                    that.total = res.data.total
                } else {
                    that.$toast(res.message, 3000);
                }
            });
        },

        searchCourse(){
            let that = this;
            that.getCourseAll(10,1,that.type,that.cate,that.searchText);
        },

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
            let that = this;
            that.getCourseAll(10,1,that.type,val,that.searchText);
        },

        //选择课件类型
         selectCourseWareType(val){
             let that = this;
             that.getCourseAll(10,1,val,that.cate,that.searchText);
        },
        //删除课件库确认
        confirmDeleteCourseWare(){
            let that = this;
            that.isDelete = false;
        },

        hidedialog(){
            let that = this;
            that.isnewFilter=false;
        },

        //新增题目所属分类
        handleChange(val){
        console.log(val)
        },
       


    },
    mounted() {
        let that = this;
        that.getCoursewareAll();
    },
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);
.sel-box{width:200px}
</style>