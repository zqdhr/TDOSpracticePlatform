<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                    <div class="fl">
                       <div class="sel-box">
                          <el-select v-model="className" placeholder="课程名称" 
                          @change="changeClass"
                          >
                                <el-option
                                v-for="item in classList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                         
                       </div>
                     
                       <div class="sel-box">
                          <el-select v-model="level1Name" placeholder="课程" 
                          @change="changeLevel1"
                          >
                                <el-option
                                v-for="item in level1List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                        <div class="sel-box" v-if="level2List.length>0">
                          <el-select v-model="level2Name" placeholder="章" 
                          @change="changeLevel2"
                          >
                                <el-option
                                v-for="item in level2List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                       <div class="sel-box" v-if="level3List.length>0">
                          <el-select v-model="level3Name" placeholder="节" 
                          @change="changeLevel3"
                          >
                                <el-option
                                v-for="item in level3List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                      
                    </div>
                    <div class="fr">
                         <a class="btnDefault pointer abtn"  @click=" click_delete">删除</a>  
                          <a class="btnDefault pointer abtn" @click="click_export">导出</a>  
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
                            <a class="searchBtn pointer"></a>
                        </div>
                    </div>
                </div>
              
            </div>
        </div>
        <div class="container">
           <div class="notes_list">
              <ul class="ul-notes">
                 <li v-for="(item,index) in notesList" :key="index">
                    <span class="check" v-if="isShowCheck" @click="click_check(item.id)" :class="{'checkh':selectNotes.indexOf(item.id)!=-1}"></span>
                    <div class="name-box">
                        <div class="d-name textline1">{{item.name}}</div>
                        <div class="d-time">{{item.time}}</div>
                    </div>
                    <p class="intro">{{item.text}}</p> 
                    <div class="link-courseware">
                        <a class="pointer" v-if="item.courseType==1"  @click="click_showDetail(1)">--&lt;{{item.coursewarename}}&gt;--&lt;第{{item.coursepage}}页&gt;</a>
                        <a class="pointer" v-if="item.courseType==2" @click="click_showDetail(2)">--&lt;{{item.coursewarename}}&gt;--&lt;观看时间：{{item.coursepage}}&gt;</a>
                    </div>
                 </li>
              </ul>
              <div class="tab-pagination">
                    <el-pagination
                        background
                        :current-page="curPage"
                        :page-size="perPage"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next,jumper"
                        :total="100"
                    >
                    </el-pagination>
               </div>
           </div>
        </div>

        <!--是否要删除-->
        <el-dialog :visible.sync="isDelete" width="600px">
            <div slot="title" class="dialog_header">请注意!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <span class="span_icon icon_waring">{{mess}}</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault">确 认</a>
                <a class="btnDefault" @click="isDelete = false;isShowCheck=false">取 消</a>
            </div>
        </el-dialog>
       
       <!--视频弹出-->
       <div class="studetTrans" v-if="showvideo">
           <div class="studentMain">
                <div class="dis-table-cell">
                <div class="video_box" v-if="detailType==2">
                        <video-player 
                            @touchstart.passive="passive"
                            class="video-player vjs-custom-skin"
                            ref="videoPlayer" 
                            :playsinline="true"
                            :x5-playsinline="true"
                            :webkit-playsinline="true"
                            :options="playerOptions"
                            @play="onPlayerPlay($event)"
                            @pause="onPlayerPause($event)"
                            @ended="onPlayerEnded($event)"
                            @waiting="onPlayerWaiting($event)"
                            @playing="onPlayerPlaying($event)"
                            @loadeddata="onPlayerLoadeddata($event)"
                            @timeupdate="onPlayerTimeupdate($event)"
                            @canplay="onPlayerCanplay($event)"
                            @canplaythrough="onPlayerCanplaythrough($event)"
                            @statechanged="playerStateChanged($event)"
                            @ready="playerReadied"
                        >
                        </video-player>
                    <div class="name_box">
                        <div class="name textline1">区块链的基础信息.MP4</div>
                        <a class="a_close pointer" @click="click_Hidevideo"></a>
                    </div>
                    <a class="a-record" @click.stop="click_record">
                        <i></i>
                        <span>记录笔记</span>
                    </a>
                </div>
                <div class="video_box pdf_box" v-if="detailType==1"> 
                    <div class="pdf_name">
                        区块链的基础信息.PDF
                        <a class="a_close pointer" @click="click_Hidevideo"></a>
                    </div>
                    <div class="pdf-main">
                        <div class="p-main">
                            <pdf ref="pdf"  :src="url" v-if="url" @loaded="loadPdfHandler" :page="currentPage"
                                @num-pages="pageCount=$event" 
                                @page-loaded="currentPage=$event" 
                            > </pdf>
                            <div class="pdf_info">
                                <a  @click="changePdfPage(0)" class="pointer" :class="{grey: currentPage==1}">Preview</a>
                                <a  @click="changePdfPage(1)" class="pointer" :class="{grey: currentPage==pageCount}">Next</a>
                                <a class="pointer" @click="isRecordNotes=true">记录笔记</a>
                                <p>{{currentPage}} / {{pageCount}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
           </div>
       </div>
      
        <!--记录笔记-->
        <el-dialog :visible.sync="isRecordNotes" width="500px" class="dialog_record" @close="click_hideRecord">
            <div slot="title" class="dialog_header">保存笔记</div>
             <div class="record_main">
                 <p class="location" v-if="detailType==1">已保存当前页数：{{currentPage}}</p>
                 <p class="location" v-if="detailType==2">已保存当前视频时间：{{location}}</p>
                 
                 <el-form>
                     <el-form-item>
                         <el-input type="text" placeholder="请输入笔记标题"/>
                     </el-form-item>
                      <el-form-item>
                         <el-input type="textarea" :rows="5" placeholder="请输入该段笔记的简介..."/>
                     </el-form-item>
                 </el-form>
             </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault">确 认</a>
               
            </div>
        </el-dialog>

      
    </div>
</template>
<script>
//视频
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import "videojs-flash"; // 如果是直播或者是视频流，注意需要引入这个模块
import 'video.js/dist/video.js'

//pdf
import pdf from 'vue-pdf'

export default {
    data(){
      return{
        userList:'张三，李四，王龙，李明',
        perPage: 10,//用户列表每页条数
        curPage:1, 

        classList:[//班级选择列表
            {label:'课程1',value:'1004'},{label:'课程2',value:'1005'}
        ],
        className:'',//选择的课程名称

     

        level1List:[
            {label:'区块链的发展史',value:'1'},
            {label:'原理篇',value:'2',
             children:[{label:'数据结构原理',value:'1'},{label:'节点共识模拟',value:'2'},{label:'智能合约部署与调用',value:'3'},
               {label:'区块链密码学',value:'4',
               children:[{label:'哈希算法',value:'1'},{label:'椭圆线密码算法',value:'2'},{label:'对称密钥算法',value:'3'},{label:'keystore',value:'4'}]
               }
             ]
            }
        ],
        level1Name:'',//选中课程名称

        level2List:[],//章节列表
        level2Name:'',//章节名称
        
        level3List:[],//小节列表
        level3Name:'',//小节名称

        inplaceholder:'请输入笔记标题',

        notesList:[
            {id:'2055ddd',name:'<笔记标题笔记标题笔记标题>',time:'2020-09-15 16:32:45',
             text:'过程记录的比较会统一汇聚在课程的我的笔记栏目中，在这里可以通过章节进行过滤查询所记录的笔记。'+
            '在课程学习过程记录的比较会统一汇聚在课程的汇聚在课程的汇聚汇聚在课 我的笔记栏目中，在这里可以通过章节进行过滤查询所记录的笔记。'+
            '在课程学习过程记录的比较会统一汇聚在课程的我的笔记栏目中，在这里可以通过章汇聚在课程的汇聚在课程的 节进行过滤查询所记录的笔记。',
            courseType:1,
            coursewarename:'XXXXXXXXXXXX课件.pdf',
            coursepage:'6'
            },
             {id:'2055xdd',name:'<笔记标题笔记标题笔记标题>',time:'2020-09-15 16:32:45',
             text:'过程记录的比较会统一汇聚在课程的我的笔记栏目中，在这里可以通过章节进行过滤查询所记录的笔记。'+
            '在课程学习过程记录的比较会统一汇聚在课程的汇聚在课程的汇聚汇聚在课 我的笔记栏目中，在这里可以通过章节进行过滤查询所记录的笔记。'+
            '在课程学习过程记录的比较会统一汇聚在课程的我的笔记栏目中，在这里可以通过章汇聚在课程的汇聚在课程的 节进行过滤查询所记录的笔记。',
            courseType:2,
            coursewarename:'XXXXXXXXXXXX.mp3',
            coursepage:'20.00'
            }
        ],
        isShowCheck:false,
        isDelete:false,
        selectNotes:[],//选中的笔记id列表
        mess:'',
        
        showvideo:false,
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
                src: require("../../assets/video.mp4"), // url地址
               
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
        isRecordNotes:false,//记录笔记 
        location:'',
        url: "/Vue.pdf",//"/Vue.pdf",
        currentPage:0, // pdf文件页码
        pageCount: 0, // pdf文件总页数
        detailType:1,
     
      
      }
    },
    components:{videoPlayer,pdf},
    filters:{
        catIndex: function (val) {
            let str = ''
            let value = val
            if(value<9){
                str='0'+value
            }else{
                str=value
            }
            return str
        }
    },
    created() {
        this.url = pdf.createLoadingTask(this.url)
    },
    
    methods:{
        //底部分页
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        //选择班级 
        changeClass(val){
          console.log('选择班级')
        },
   
        //选择课程
        changeLevel1(val){
            let that = this
            let tmp = that.level1List
            that.level2List = []
            that.level3List = []
            for(var i=0;i<tmp.length;i++){
                if(val == tmp[i].value){
                    if(tmp[i].children){
                       that.level2List = tmp[i].children || [];
                    }else{
                         that.level2List = []
                    }
                    
                }
            }
            
        },
        //选择章节
        changeLevel2(val){
           let that = this
            let tmp = that.level2List
            that.level3List = []
            for(var i=0;i<tmp.length;i++){
                if(val == tmp[i].value){
                    if(tmp[i].children){
                       that.level3List = tmp[i].children || [];
                    }else{
                         that.level3List = []
                    }
                    
                }
            }
        },
        //选择节
        changeLevel3(val){
            console.log('选择节')
        },
        //点击删除
        click_delete(){
          let that = this;
          if(!that.isShowCheck){
            that.isShowCheck =true
            that.selectNotes = [];
          }else{
             if(that.selectNotes.length==0){
                that.isShowCheck =false
             }else{
                 that.isDelete = true
                 that.mess = '确定要删除当前选中的笔记吗？'
             }
             
          }
          console.log(that.isShowCheck)
        },
        //点击导出
        click_export(){
          let that = this;
          if(!that.isShowCheck){
            that.isShowCheck =true
            that.selectNotes = [];
          }else{
             if(that.selectNotes.length==0){
                that.isShowCheck =false
             }else{
                 that.isDelete = true
                 that.mess = '确定要导出当前选中的笔记吗？'
             }
          }
        },
        //点击选中     
        click_check(id){
          let that = this;
        
            if(that.selectNotes.length==0){
                that.selectNotes.push(id);    
            }else{
                if(that.selectNotes.indexOf(id)!=-1){
                    let index = that.selectNotes.indexOf(id)
                    that.selectNotes.splice(index,1)    
                }else{
                    that.selectNotes.push(id)
                }
            }
        },

        //点击查看视频
        click_showDetail(num){
          let that = this
          that.showvideo = true
          that.detailType = num;
          var mo=function(e){e.preventDefault();};
          document.body.style.overflow='hidden';
          document.addEventListener("touchmove",mo,false);//禁止页面滑动
          if(num==2){
            that.$nextTick(function(){
                that.videoPlay();
                that.playerOptions.sources.src='require("../../assets/video.mp4")'
            })
          
          }else{
              that.loadPdfHandler()
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


        
        //视频播放
         videoPlay() {
            this.$refs.videoPlayer.player.play();
        },


        //笔记记录
        click_record(){
          let that = this;
          that.isRecordNotes = true;
          this.$refs.videoPlayer.player.pause();
        },

        //关闭记录弹出框
        click_hideRecord(){
          let that = this;
          if(that.detailType==2){ //表示当前记录的笔记是视频
            that.videoPlay();
          }
          
        },

        // 播放回调
        onPlayerPlay(player) {
           //console.log("player play!", player);
        },

        // 暂停回调
        onPlayerPause(player) {
            let that = this;
            that.location =  player.currentTime();
            //console.log("player pause!", player); 
        },

        // 视频播完回调
        onPlayerEnded(player) {
          //console.log(player);
        },

        // DOM元素上的readyState更改导致播放停止
        onPlayerWaiting(player) {
        // console.log(player)
        },

        // 已开始播放回调
        onPlayerPlaying(player) {
        // console.log(player)
        },

        // 当播放器在当前播放位置下载数据时触发
        onPlayerLoadeddata(player) {
           player.currentTime("20.18638");
           //console.log(player)
        },

        // 当前播放位置发生变化时触发。
        onPlayerTimeupdate(player) {
        //console.log(player)
        },

        //媒体的readyState为HAVE_FUTURE_DATA或更高
        onPlayerCanplay(player) {
        // console.log('player Canplay!', player)
        },

        //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
        onPlayerCanplaythrough(player) {
        // console.log('player Canplaythrough!', player)
        },

        //播放状态改变回调
        playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
        },

        //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
        playerReadied(player) {
           player.currentTime("20.18638");
        },

         // pdf加载时
        loadPdfHandler(e) {
        this.currentPage = 3; // 加载的时候先加载第一页
        },
       
       // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
        changePdfPage(val) {
        // console.log(val)
        if (val === 0 && this.currentPage > 1) {
            this.currentPage--;
            // console.log(this.currentPage)
        }
        if (val === 1 && this.currentPage < this.pageCount) {
            this.currentPage++;
            // console.log(this.currentPage)
        }
        },
        
       
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/student.less);
@import url(../../assets/less/attachment.less);
</style>