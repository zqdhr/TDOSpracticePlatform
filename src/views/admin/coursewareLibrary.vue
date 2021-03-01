<template>
<div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
            <div class="sel-box">
                <el-select v-model="paramData.category_id" placeholder="自定义分类" @change="selectType" >
                <el-option v-for="item in customClass" :key="item.id" :label="item.name" :value="item.id" > </el-option>
                </el-select>
            </div>
            <div class="sel-box" v-if="i_customClass.length>0">
                <el-select v-model="paramData.c_category_id" placeholder="自定义分类"  @change="child_selectType">
                <el-option v-for="item in i_customClass" :key="item.id" :label="item.name" :value="item.id" > </el-option>
                </el-select>
            </div>
            <div class="sel-box">
                <el-select v-model="paramData.type" placeholder="请选择课件分类" @change="selectCourseWareType">
                    <el-option
                    v-for="item in catoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="sel-box">
                <el-select v-model="paramData.kind" placeholder="请选择课件类型" @change="selectCate">
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
            <input :placeholder="inplaceholder" type="text" autocomplete="off" v-model="paramData.name"/>
            <a class="searchBtn pointer" @click="searchCourse"></a>
          </div>
        </div>

      </div>

    </div>

    <div class="coursewareLibrary_box">
        <div class="container">
            <template v-if="isHasData">
            <div class="list_box">
                <ul class="list_ul coursewareLibrary_ul  clearfix">
                    <li v-for="(item,index) in experimentList" :key="index">
                        <div class="info padt20 boxShadow pointer" @click="click_showDetail(item.kind,item)">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <a class="icon icon_close pointer" @click.stop="isDeleteWare(item.id)"></a>
                            </el-tooltip>
                            <!--
                            <el-tooltip class="item" effect="dark" content="设置" placement="top">
                                <a class="icon icon_set pointer"></a>
                            </el-tooltip>
                            -->
                            <div class="icon-box">
                                <span class="c_icon" :class="{'icon_video':item.kind==0,'icon_pdf':item.kind==1}"></span>
                            </div>
                            <p class="p-text textline1 p-name">{{item.name}}</p>
                            <div class="line"></div>
                            <p class="p-text textline1">课件大小：{{item.size}}</p>
                            <!--<p class="p-text textline1">视频时长：{{item.duration}}</p>-->
                        </div>
                    </li>
                </ul>
            </div>

             <div class="tab-pagination">
                <el-pagination
                    background
                    :current-page="paramData.page"
                    :page-size="paramData.perPage"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next,jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
            </template>

             <nodata dataMess="课件库暂无内容" noDataType='1' v-if="!isHasData"></nodata>

        </div>
    </div>
     <!--删除实验弹出框-->
    <el-dialog :visible.sync="isDelete" width="500px">
      <div slot="title" class="dialog_header">警告!</div>
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

           <!--视频弹出-->
       <div class="studetTrans" v-if="showvideo">
           <div class="studentMain">
                <div class="dis-table-cell">
                <div class="video_box" v-if="detailType==0">
                        <video-player
                            @touchstart.passive="passive"
                            class="video-player vjs-custom-skin"
                            ref="videoPlayer"
                            :playsinline="true"
                            :x5-playsinline="true"
                            :webkit-playsinline="true"
                            :options="playerOptions"

                        >
                        </video-player>
                    <div class="name_box">
                        <div class="name textline1">{{show_name}}</div>
                        <a class="a_close pointer" @click="click_Hidevideo"></a>
                    </div>

                </div>
                <div class="video_box pdf_box" v-if="detailType==1">
                    <div class="pdf_name">
                        {{show_name}}
                        <a class="a_close pointer" @click="click_Hidevideo"></a>
                    </div>
                    <div class="pdf-main">
                        <div class="p-main">
                            <pdf ref="pdf"  :src="url" v-if="url" @loaded="loadPdfHandler" :page="pdf_currentPage"
                                @num-pages="pageCount=$event"
                                @page-loaded="pdf_currentPage=$event"
                            > </pdf>
                            <div class="pdf_info">
                                <div class="btn_box">
                                <a  @click="changePdfPage(0)" class="pointer preve" :class="{grey: pdf_currentPage==1}"></a>
                                <a  @click="changePdfPage(1)" class="pointer next" :class="{grey: pdf_currentPage==pageCount}"></a>
                                </div>

                                <p>{{pdf_currentPage}} / {{pageCount}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
           </div>
       </div>

   <newdialog   ref="newdialog" @getCourseAll="getCourseAll"></newdialog>

</div>
</template>
<script>
import { getCoursewareAll,findParentCategory,findChildCategory,deleteCoursewareById} from "@/API/api";
import newdialog from '@/components/admin_dialog_newCourseware'
import nodata from '@/components/noData'

//视频
import { videoPlayer } from "vue-video-player";

import "videojs-flash"; // 如果是直播或者是视频流，注意需要引入这个模块
import 'video.js/dist/video.js'

//pdf
import pdf from 'vue-pdf'

export default {
    data(){
        return{
           inplaceholder:'请输入课件名称',
            catoptions:[
              {value: '',label: '全部'},  {value: '0',label: '内置课件'},{value: '1',label: '教师上传'}
            ],
            typeList:[
                {value: '',label: '全部'},{value: '1',label: '文档'},{value: '0',label: '视频'}
            ],
             experimentList:[
            ],
            coueseWareId:'',
            isDelete:false,
            isnewFilter:false,//新增课件选择
            total:1,




            category_id:'',

            customClass: [], //自定义分类
            i_customClass: [ ], //自定义分类子

            options:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options1:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options2:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],

            isHasData:false,

            paramData:{
                perPage:15,
                page:1,
                kind:'', //种类 0视频 1pdf
                type:'' ,//0内置课件 1教师上传
                category_id:'',//自定义种类
                c_category_id:'', //自定义子种类
                name:'', //搜索的关键词
                chapter_id:'',
                section_id:''
            },
            showvideo:false, //是否显示详情
            show_name:'',
             detailType:2,
             passive:true,
             playerOptions: {
                playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
                autoplay: true, // 如果为true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 是否视频一结束就重新开始。
                preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: "zh-CN",
                aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [
                {
                    type: "video/mp4", // 类型
                    src:'', //require("../../assets/video.mp4"), // url地址

                },
                ],
                poster: "", // 封面地址
                notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                timeDivider: true, // 当前时间和持续时间的分隔符
                durationDisplay: true, // 显示持续时间
                remainingTimeDisplay: false, // 是否显示剩余时间功能
                fullscreenToggle: true, // 是否显示全屏按钮
                },
            },
            pdf_currentPage:1,
            pageCount: 0, // pdf文件总页数
            url:''
        }
    },
    components:{
      newdialog,nodata,videoPlayer ,pdf
    },
    created(){
        this.paramData.type = this.catoptions[0].value;//默认选中内置课件
        this.paramData.kind = this.typeList[0].value;//课件类型默认选中全部

        //获取课件列表
        this.getCourseAll();

        //获取父级分类
        this.findParentCategory();
    },
    methods:{

        //自定义父级分类获取数据
        findParentCategory(){
            let that = this;
            findParentCategory().then(res=> {
                if(res.code==200){
                    that.customClass = res.data;

                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
         //自定义分类父级分类点击事件
        selectType(val){
            let that = this;
            let obj = {}
            obj.parent_category_id = val
            that.i_customClass = []
            that.paramData.c_category_id = '';
            findChildCategory(obj).then(res=> {
                if(res.code==200){
                    that.i_customClass = res.data;
                }else{
                    this.$toast(res.message,2000)
                }
            })
            that.getCourseAll();
        },
        child_selectType(val){
            let that = this
            that.getCourseAll();
        },
        //获取课件列表方法
        getCourseAll(){
            let that = this;

            getCoursewareAll(that.paramData).then((res) => {
                if (res.code == 200) {
                    for(let i = 0;i<res.data.list.length;i++){
                        res.data.list[i].size = (res.data.list[i].size/(1024 * 1024)).toFixed(2) + "MB"
                    }
                    that.experimentList = res.data.list;
                    res.data.total==0 ? that.isHasData = false :that.isHasData = true
                    that.total = res.data.total

                    //alert(that.total)

                } else {
                    that.$toast(res.message, 3000);
                }
            });
        },

        searchCourse(){
            let that = this;
            that.getCourseAll();
        },

        click_new(){
            let that = this;
            that.$refs.newdialog.click_new();
        },

        //底部分页
        handleCurrentChange(val) {
            let that = this;
            that.paramData.page =val
            this.getCourseAll();
        },

        //选择分类
        selectCate(val){
            let that = this;
            that.getCourseAll();
        },

        //选择课件类型
         selectCourseWareType(val){
             let that = this;

             that.getCourseAll();
        },
        isDeleteWare(id){
          let that = this;
          that.coueseWareId = id;
          that.isDelete = true;
        },
        //删除课件库确认
        confirmDeleteCourseWare(){
            let that = this;
            that.isDelete = false;
            let obj = {};
            let list = [];
            list.push(that.coueseWareId)
            obj.courseware_id_list = list;
            deleteCoursewareById(obj).then((res) => {
                that.coueseWareId = '';
                if (res.code == 200) {
                    if(res.data.reason){

                        that.$toast(res.data.reason+'无法删除', 3000);

                    }else{
                       if(that.paramData.page!=1){
                             if(list.length == that.total){
                                that.paramData.page = that.paramData.page - 1
                            }
                        }
                        that.$toast('课件已删除', 2000);
                        that.getCourseAll();
                    }
                } else {
                    that.$toast(res.message, 3000);
                }
            });
        },

        hidedialog(){
            let that = this;
            that.isnewFilter=false;
        },

        //新增题目所属分类
        handleChange(val){
         console.log(val)
        },

         //视频播放
         videoPlay() {
            this.$refs.videoPlayer.player.play();
        },

        //pdf加载
        loadPdfHandler(e) {
        this.pdf_currentPage = 1; // 加载的时候先加载第一页
        },

        //点击查看视频
        click_showDetail(num,item){

          let that = this
        //   alert(that.$store.state.pic_Url + item.url);
          that.showvideo = true
          that.detailType = num;
          that.show_name = item.name
          console.log(item)
          var mo=function(e){e.preventDefault();};
          document.body.style.overflow='hidden';
          document.addEventListener("touchmove",mo,false);//禁止页面滑动
          if(num==0){

            that.$nextTick(function(){
                that.playerOptions.sources[0].src= that.$store.state.pic_Url + item.url
                that.videoPlay();
            })

          }else{
              that.$nextTick(function(){
                 that.url =  that.$store.state.pic_Url + item.url
                 that.loadPdfHandler()
              })
          }

        },

        //视频关闭
        click_Hidevideo(){
           let that = this
           that.showvideo = false
           var mo=function(e){e.preventDefault();};
           document.body.style.overflow='';//出现滚动条
           document.removeEventListener("touchmove",mo,false);
        },

        // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
        changePdfPage(val) {
        // console.log(val)
        if (val === 0 && this.pdf_currentPage > 1) {
            this.pdf_currentPage--;
            // console.log(this.currentPage)
        }
        if (val === 1 && this.pdf_currentPage < this.pageCount) {
            this.pdf_currentPage++;
            // console.log(this.currentPage)
        }
        },



    },
    mounted() {
        let that = this;


    },
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);
.sel-box{width:200px}
.list_box .list_ul .p-name{padding: 12px 10px;}
@import url(../../assets/less/attachment.less);
</style>
