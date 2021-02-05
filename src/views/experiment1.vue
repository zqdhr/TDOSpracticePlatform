<template>
    <div class="experiment_pagewrap boxsizing">
        <div class="e-header">
           
            <div class="name textline1">正在进行的实验：{{experiment.name}}</div>
           
            <div class="timeBox">{{time}}</div>

            <div class="operationBox">
            
                <a class="a-opera pointer"  @click="makeImg">
                    <i><img src="../assets/img/exper_screen.png"/></i>
                    <span>一键截屏</span>
                </a>
                <a class="a-opera pointer" v-if="isOpen">
                     <i><img src="../assets/img/exper_download.png"/></i>
                    <span>下载代码</span>
                </a>
                <a class="a-opera pointer" @click="click_back" v-if="!isOpen">
                    <i><img src="../assets/img/exper_back.png"/></i>
                    <span>返回</span>
                </a>
                 <a class="a-opera pointer" v-if="isOpen" @click="isClose=true,type=1">
                    <i><img src="../assets/img/exper_end.png"/></i>
                    <span>结束</span>
                </a>
                <a class="a-opera pointer" v-if="isOpen" @click="isClose=true,type=2">
                    <i><img src="../assets/img/exper_restart.png"/></i>
                    <span>重新开始</span>
                </a>
                
        
            </div>
            
        </div>
        <div class="experiment_container clearfix boxsizing">
            <div class="left-noVNc boxsizing " :class="{'changeWidth':isHide}">
                <div class="l-nav" >
                  <span class="pointer" :class="{'active':virtualMachine==index}" v-for="(item,index) in containers" :key="index">虚拟机{{index+1}}{{item.status==0?'(已创建)':'(运行中)'}}</span>

                  <a class="icon_jm pointer" @click="isHide=!isHide" v-if="isHide"></a>
                </div>
                <div class="operation_box" id="screen" v-if="1==1"  ref="imageWrapper" >
                    <!--@click="connectVnc()"-->
                    <!--<a class="btn-open pointer" v-if="!isOpen" @click="isOpen=true">点击开启全部虚拟机</a>-->
                   <a class="btn-open pointer" v-if="!isOpen" @click="connectVnc()">点击开启全部虚拟机</a>
                   <!--<iframe src="http://192.168.1.133:6080/" ref="frameWrapper"/>-->
                </div>
                <xterm :socketURI="socketURI" v-if="1==0"></xterm> 
                <!--
                <div  class="operation_box" ref="imageWrapper" id="imageWrapper" >
                    
                    <iframe src="http://192.168.1.54:2222/ssh/host/192.168.1.54/5001"  style="width:100%;height:100%"></iframe>
                </div>
                -->
            
                  
                <!--
                <div class="operation_box" ref="imageWrapper" id="imageWrapper">
              
                  
                     <iframe src="http://192.168.1.228:2222/ssh/host/192.168.1.228/5001?username=''&userpassword=''" frameborder="0" ></iframe>
    

                
                    
                </div>
                -->
              
            </div>
            <div class="right_main" :class="{'changeWidth':isHide}">
                <el-scrollbar style="height:100%">
                    <div class="nav">
                        <a class="pointer" :class="{'active_index':curIndex==1}" @click="curIndex=1">实验步骤</a>
                        <a class="pointer" :class="{'active_index':curIndex==2}" @click="curIndex=2" v-if="authority==0">实验报告</a>
                        <!--<a class="icon_jm pointer" @click="isHide=!isHide"></a>-->
                    </div>
                    <div v-if="curIndex==1">
                        <h3 class="htitle">实验步骤说明</h3>
                        <ul class="step-ul">
                           <li>
                               <!-- <p class="pt">1、实验步骤</p> -->
                               <p class="ptext" v-html="experiment.step">步骤内容步骤内容步骤内容步骤内容步骤内容步骤内容步骤内容步骤内容步骤内容</p>
                           </li>
                        </ul>
                    </div>
                    <!--&& authority==0 v-if="curIndex==2"-->
                    <template >
                    <h3 class="htitle">填写实验报告</h3>
                    <div class="labReport_box"  >
                        <quill-editor 
                                v-model="yourContent" 
                                ref="myQuillEditor"  
                                :options="editorOption" 
                                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                            >
                         </quill-editor>
                         <div class="btnbox"><a class="btnDefault" @click="insertExperimentRepor(hasReport)">确认上传</a></div>
                    </div>
                    </template>
                </el-scrollbar>
            </div>

        </div>
                <!--弹窗-->
            <el-dialog :visible.sync="isClose" width="600px">
            <div slot="title" class="dialog_header">请注意!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <!--成功span的class为icon_success-->
                <span class="span_icon icon_waring">{{type==1?'确认结束当前实验':'确认重新开始当前实验'}}？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="stopOrrestart">确 认</a>
                <a class="btnDefault" @click="isClose=false">取 消</a>
            </div>
            </el-dialog>
            <!--再次上传实验报告弹出框-->
              <el-dialog :visible.sync="isHas" width="600px">
            <div slot="title" class="dialog_header">请注意!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <!--成功span的class为icon_success-->
                <span class="span_icon icon_waring">实验报告已存在,确认覆盖上次提交的报告？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="insertExperimentRepor(false)">确 认</a>
                <a class="btnDefault" @click="isHas=false">取 消</a>
            </div>
            </el-dialog>
    </div>
</template>
<script>
import RFB from '@novnc/novnc/core/rfb';


import { quillEditor } from "vue-quill-editor"; //调用编辑器


 import html2canvas from 'html2canvas';

 import xterm from '@/components/Xterminal.vue'
 import {createContainers,findAllByType,execContainer,removeContainers,insertExperimentRepor,hasExperimentReport} from "@/API/api";



export default {
    data(){
        return{
            dataURL: '',
            isHide:false,//右侧栏是否显示
            curIndex:1,
            virtualMachine:6,
            reportText:'',//实验报告输入内容
            authority:0,
            isOpen:false,//虚拟机是否开启
            yourContent: "",
            editorOption: {
                placeholder: "实验报告输入",
                modules:{
                toolbar:[
                        ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                        ['blockquote', 'code-block'],     //引用，代码块
                        [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                        [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                        [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                        [{ 'direction': 'rtl' }],             // 文本方向
                        [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                        [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                        [{ 'font': [] }],     //字体
                        [{ 'align': [] }],    //对齐方式
                        ['clean'],    //清除字体样式
                        ['image','link']    //上传图片、上传视频'video'
                        ]
                }
            },
            loading:false,

             term: null,

             socketURI:'ws://192.168.1.228:19585'+'/terminals/',

             //socketURI:'http://192.168.1.54:2222/ssh/host/192.168.1.54/5001'
            userid:'',
            experimentId:'',
            courseId:'',
            containers:[],//虚拟机列表 这里显示标题的时候要显示status 0是已创建 1是运行中
            experiment:{},//实验详情
            time:'',
            second:'',//用来记录当前倒计时的秒数
            isClose:false,
            type:'',//0是START,1是 STOP,2是 RESTART
            hasReport:false,//是否已上传过实验报告
            isHas:false

           
        }
    },
    beforeCreate() {
      
       document.getElementsByTagName("body")[0].className="equipment-body";
    },
    beforeDestroy(){
        document.body.removeAttribute("class","equipment-body");
    },
    components:{quillEditor,xterm},
    created(){
        let that = this;
        that.authority = that.$route.query.authority?that.$Base64.decode(that.$route.query.authority):0;
        that.userid = that.$route.query.userid
        that.experimentId=that.$route.query.experimentId
        that.courseId =that.$route.query.courseId
        that.createContainers(that.userid,that.experimentId,that.courseId)
        that.findAllByType(that.experimentId)
        if (that.authority==0) {
            that.hasExperimentReport()
        }  
    },
    methods:{
        // vnc连接断开的回调函数
        disconnectedFromServer (msg) {
          console.log(msg)
            if(msg.detail.clean){
                // 根据 断开信息的msg.detail.clean 来判断是否可以重新连接
                this.contentVnc()
            } else {
                //这里做不可重新连接的一些操作
            }
        },
        // 连接成功的回调函数
        connectedToServer(msg) {
            console.log('success',msg)
        },
           //创建实验
        createContainers(userid,experimentId,courseId){
            let that = this
            let obj = {}
            obj.userId = userid
            obj.experimentId = experimentId
            obj.courseId = courseId
            createContainers(obj).then(res=>{
                if (res.code==200) {
                    console.log(res.data)
                    that.containers = res.data
                 
                    if (that.containers!=null&& that.containers.length>0&&that.containers[0]!=null) {
                        if (that.containers[0].status==1) {
                            that.isOpen=true
                            that.virtualMachine=0
                        }
                        
                    }
                } else {
                     console.log(res.data)
                }
            })

        },
        //获取实验详情
        findAllByType(experId){
            let that = this
            let obj = {}
            obj.id = experId
            obj.type = 0
            obj.perPage=1
            obj.page=1
            findAllByType(obj).then(res=>{
                if (res.code==200) {
                    that.experiment = res.data          
                    let time= that.experiment.duration*60
                    that.formatSecToDate(time)
                    that.daojishi(time)
                }else {
                    that.$toast(res.message,3000)
                }
            })
        },
        //判断是关闭实验还是重启实验
        stopOrrestart(){
            let that = this
            if (that.type==2) {
                //重启实验
                that.execContainer(2)
                
            }else if (that.type==1) {                     
                if (that.authority==0) {
                   //学生关闭实验 
                   that.execContainer(1)
                }else{
                    //教师与管理员关闭实验
                    that.removeContainers()
                }
            }
            that.isClose=false

        },
        //开启实验 type 0是START,1是 STOP,2是 RESTART
        execContainer(type){
            let that = this
            let obj = {}
            let containerId = []
            for (let index = 0; index <  that.containers.length; index++) {
                containerId.push( that.containers[index].containerId)
            }
            obj.containerId = containerId
            obj.type = type
            execContainer(obj).then(res=>{
                if (res.code==200) {
                    console.log(res.data)
                    if (type==1) {
                        that.click_back()
                    }
                } else {
                    that.$toast(res.message,3000) 
                    console.log(res.message)
                }       
            })
          
        },
        //管理员和老师关闭实验调用
        removeContainers(){
            let that = this
            let obj = {}
            let containerId = []
            for (let index = 0; index <  that.containers.length; index++) {
                containerId.push( that.containers[index].containerId)
            }
            obj.containerId = containerId
            removeContainers(obj).then(res=>{
                if (res.code==200) {
                    that.click_back()
                } else {
                    that.$toast(res.message,3000) 
                }
            })
        },
        //添加实验报告
        insertExperimentRepor(hasReport){
            let that = this
            if (that.yourContent=='') {
               return that.$toast("请输入实验报告内容",3000) 
            }
            console.log(hasReport)
            if ( hasReport==true) {
                 that.isHas=true           
                return
                
            }
            that.isHas=false
            let obj={}
            obj.experiment_id = that.experimentId
            obj.user_id = that.userid
            obj.info = that.yourContent
            insertExperimentRepor(obj).then(res=>{
                if (res.code==200) {
                    that.$toast("实验报告上传成功",3000)
                    that.yourContent='' 
                    that.hasReport=true
                } else {
                    that.$toast(res.message,3000) 
                }
            })

        },
        //判断是否已提交实验报告
        hasExperimentReport(){
            let that = this
            let obj ={}
            obj.experiment_id = that.experimentId
            obj.user_id =  that.userid
            hasExperimentReport(obj).then(res=>{
                   console.log(res)
                if (res.code==200) {
                    console.log(res)
                    that.hasReport=true
                } else {
                     that.$toast(res.message,3000) 
                }
            })

        },

        //连接vnc的函数      
        connectVnc () {
            const PASSWORD = '';

            const url='ws://192.168.1.31:6901/vnc.html?password=123456&autoconnect=true'
            //const url ='ws://192.168.1.133:6080/'
            //const url ='ws://192.168.1.133:7002/vnc.html?password=123456&autoconnect=true'

            let rfb = new RFB(document.getElementById('screen'), url, {
            // 向vnc 传递的一些参数，比如说虚拟机的开机密码等
                credentials: {password: '123456' }
            });
            rfb.addEventListener('connect', this.connectedToServer);
            rfb.addEventListener('disconnect', this.disconnectedFromServer);
            rfb.scaleViewport = true;  //scaleViewport指示是否应在本地扩展远程会话以使其适                    合其容器。禁用时，如果远程会话小于其容器，则它将居中，或者根据clipViewport它是否更大来处理。默认情况下禁用。
            rfb.resizeSession = true; //是一个boolean指示是否每当容器改变尺寸应被发送到调整远程会话的请求。默认情况下禁用
            console.log(rfb)
            this.rfb = rfb;
            
        },

        //头部点击返回
        click_back(){
            let that = this;
             if (window.history.length <= 1) {
                 if(that.authority==0){
                    this.$router.push({path:'/student'})
                 }
                  if(that.authority==1){
                    this.$router.push({path:'/teacher'})
                 }
                  if(that.authority==2){
                    this.$router.push({path:'/admin'})
                 }
                
                return false
            } else {
                this.$router.go(-1)
            }
        },
        //一键截屏
        click_screenshots(){
           let that = this;
           that.makeImg()
           
        },
        //时间转化
        formatSecToDate(sec){
            if(!sec){
                return '-'
            }
            var min = Math.floor(sec%3600);//分钟
            this.time= (Math.floor(sec/3600)<10?"0"+ Math.floor(sec/3600):Math.floor(sec/3600) )+ ":" +( Math.floor(min/60)<10?"0"+Math.floor(min/60):Math.floor(min/60)) + ":"+ (sec%60<10?"0"+sec%60:sec%60)
        },

      //倒计时
        daojishi(time){
            let that = this
            var min = Math.floor(time%3600)
            //时
            var h = parseInt(time / 3600) > 0 ? parseInt(time / 3600) : 0
            //分
            var m = parseInt( min /60)
            //秒
            var s = time%60

            //开始执行倒计时
            var timeInterval = setInterval(function () {
            //如果时、分、秒都为0时将停止当前的倒计时
            if (h == 0 && m == 0 && s == 0) { clearInterval(timeInterval); return; }
             //当秒走到0时，再次为60秒
            if (s == 0) { s = 60; }
            if (s == 60) {
            //每次当秒走到60秒时，分钟减一
            m -= 1;
            //当分等于0时并且小时还多余1个小时的时候进里面看看
            if (m < 0 && h > 0) {
                //小时减一
                h -= 1;
                //分钟自动默认为60分
                m = 59;
                //秒自动默认为60秒
                s = 60;
                }
             }
            //秒继续跳动，减一
            s -= 1;
            //小时赋值
            that.time= (h<10?"0"+ h:h )+ ":" +( m<10?"0"+m:m) + ":"+ (s<10?"0"+s:s) ;
            that.second = h*3600+m*60+s
         
            }, 1000);
        },

        // 将dom转成canvas
        makeImg() {
            var that = this
            var opts = {
                logging: true, // 启用日志记录以进行调试 (发现加上对去白边有帮助)
                allowTaint: true, // 否允许跨源图像污染画布
                backgroundColor: null, // 解决生成的图片有白边
                useCORS: true, // 如果截图的内容里有图片,解决文件跨域问题
                scale:2,
                height: document.getElementById('screen').offsetHeight,
                width:document.getElementById('screen').offsetWidth,
                //windowHeight: document.getElementById('imageWrapper').scrollHeight,
                //windowWidth: document.getElementById('imageWrapper').scrollWidth,
                x:0,
                scrollX: 0,    //设置这两个scrollX/Y即可
			scrollY: 0,
             
               
            }
            console.log(document.getElementById('screen').offsetWidth)
            // eslint-disable-next-line no-undef
            const iframeHtml = this.$refs.frameWrapper.contentWindow // 获取iframe内容
            const iframeBody = iframeHtml.document.getElementsByTagName('body')[0]
            //that.$refs.imageWrapper
            html2canvas(that.$refs.imageWrapper, opts).then((canvas) => {
                var url = canvas.toDataURL('image/png')
                that.dataURL = url
                that.yourContent =that.yourContent+ '<p><img src="'+that.dataURL+'"/></p>'
                console.log(that.yourContent)
            })
        },
        // http图片转成base64，防止解决不了的图片跨域问题
        getBase64Image(img) {
        var canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        var dataURL = canvas.toDataURL('image/png') // 可选其他值 image/jpeg
        return dataURL
        },
        onEditorReady(editor) { // 准备编辑器
        },
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件

        }
}
</script>
<style lang="less" scoped>
@import url(../assets/less/operateExperiment.less);


</style>