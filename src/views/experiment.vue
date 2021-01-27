<template>
    <div class="experiment_pagewrap boxsizing">
        <div class="e-header">
           
            <div class="name textline1">正在进行的实验：模拟部署一条真实的链</div>
           
            <div class="timeBox">00:45:52</div>

            <div class="operationBox">
            
                <a class="a-opera pointer" v-if="isOpen">
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
        <div class="experiment_container clearfix">
            <div class="left-noVNc boxsizing">
                <div class="l-nav">
                  <span claass="pointer " :class="{'active':virtualMachine==1}">虚拟机1</span>
                  <span claass="pointer" :class="{'active':virtualMachine==2}">虚拟机2</span>
                  <span claass="pointer" :class="{'active':virtualMachine==3}">虚拟机3</span>
                </div>
                <div class="operation_box" id="screen">
                    <a class="btn-open pointer" @click="connectVnc()">点击开启全部虚拟机</a>
                </div>
            </div>
            <div class="right_main">
                <el-scrollbar style="height:100%">
                    <div class="nav">
                        <a class="pointer" :class="{'active_index':curIndex==1}" @click="curIndex=1">实验步骤</a>
                        <a class="pointer" :class="{'active_index':curIndex==2}" @click="curIndex=2" v-if="authority==0">实验报告</a>
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
                    <template v-if="curIndex==2 &&  authority==0">
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
export default {
    data(){
        return{
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
            }
           
        }
    },
    beforeCreate() {
      
       document.getElementsByTagName("body")[0].className="equipment-body";
    },
    beforeDestroy(){
        document.body.removeAttribute("class","equipment-body");
    },
    components:{quillEditor},
    created(){
        let that = this;
        that.authority = that.$route.query.authority?that.$Base64.decode(that.$route.query.authority):0;

       
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
        
        //连接vnc的函数      
        connectVnc () {
            const PASSWORD = '';
            const url='ws://ip/端口'
            let rfb = new RFB(document.getElementById('screen'), url, {
            // 向vnc 传递的一些参数，比如说虚拟机的开机密码等
                credentials: {password: PASSWORD }
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