<template>
    <div class="experiment_pagewrap boxsizing">
        <div class="e-header">
           
            <div class="name textline1">正在进行的实验：模拟部署一条真实的链</div>
           
            <div class="timeBox">00:45:52</div>

            <div class="operationBox">
            
                <a class="a-opera pointer"  @click="click_screenshots">
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
                 <a class="a-opera pointer" v-if="isOpen">
                    <i><img src="../assets/img/exper_end.png"/></i>
                    <span>结束</span>
                </a>
                <a class="a-opera pointer" v-if="isOpen">
                    <i><img src="../assets/img/exper_restart.png"/></i>
                    <span>重新开始</span>
                </a>
                
        
            </div>
            
        </div>
        <div class="experiment_container clearfix boxsizing">
            <div class="left-noVNc boxsizing " :class="{'changeWidth':isHide}">
                <div class="l-nav" >
                  <span class="pointer " :class="{'active':virtualMachine==1}">虚拟机1</span>
                  <span class="pointer" :class="{'active':virtualMachine==2}">虚拟机2</span>
                  <span class="pointer" :class="{'active':virtualMachine==3}">虚拟机3</span>
                  <a class="icon_jm pointer" @click="isHide=!isHide" v-if="isHide"></a>
                </div>
                <div class="operation_box" id="screen" v-if="1==1"  ref="imageWrapper" >
                    <!--@click="connectVnc()"-->
                    <!--<a class="btn-open pointer" v-if="!isOpen" @click="isOpen=true">点击开启全部虚拟机</a>-->
                   <a class="btn-open pointer" v-if="!isOpen" @click="connectVnc()">点击开启全部虚拟机</a>
                   <xterm :socketURI="socketURI"></xterm> 
                </div>
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
                               <p class="pt">1、实验步骤</p>
                               <p class="ptext">步骤内容步骤内容步骤内容步骤内容步骤内容步骤内容步骤内容步骤内容步骤内容</p>
                           </li>
                        </ul>
                    </div>
                    <!--&& authority==0-->
                    <template v-if="curIndex==2">
                    <h3 class="htitle">填写实验报告</h3>
                    <div class="labReport_box"  >
                        <quill-editor 
                                v-model="yourContent" 
                                ref="myQuillEditor"  
                                :options="editorOption" 
                                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                            >
                         </quill-editor>
                         <div class="btnbox"><a class="btnDefault">确认上传</a></div>
                    </div>
                    </template>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
import RFB from '@novnc/novnc/core/rfb';


import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

 import html2canvas from 'html2canvas';

 import xterm from '@/components/Xterminal.vue'
 import {createContainers} from "@/API/api";



export default {
    data(){
        return{
            dataURL: '',
            isHide:false,//右侧栏是否显示
            curIndex:1,
            virtualMachine:0,
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

             socketURI:'ws://192.168.1.228:4000'+'/terminals/',

             //socketURI:'http://192.168.1.54:2222/ssh/host/192.168.1.54/5001'
            userid:'',
            experimentId:'',
            courseId:''
           
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
        console.log(that.$route.query.userid)
        console.log(that.$route.query.experimentId)
        console.log(that.$route.query.courseId)
       
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
            console.log(obj)
            createContainers(obj).then(res=>{
                console.log()
                if (res.code==200) {
                    console.log(res.data)
                } else {
                     console.log(res.data)
                }
            })

        },

        //连接vnc的函数      
        connectVnc () {
            const PASSWORD = '';
            const url='ws://192.168.1.54:7002/vnc.html?password=123456&autoconnect=true'
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