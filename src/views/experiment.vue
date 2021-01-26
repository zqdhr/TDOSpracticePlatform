<template>
    <div class="experiment_pagewrap boxsizing">
        <div class="e-header">
           
            <div class="name textline1">正在进行的实验：模拟部署一条真实的链</div>
           
            <div class="timeBox">00:45:52</div>

            <div class="operationBox">
            
                <a class="a-opera pointer">
                    <i><img src="../assets/img/exper_screen.png"/></i>
                    <span>一键截屏</span>
                </a>
                <a class="a-opera pointer">
                     <i><img src="../assets/img/exper_download.png"/></i>
                    <span>下载代码</span>
                </a>
                <a class="a-opera pointer">
                    <i><img src="../assets/img/exper_back.png"/></i>
                    <span>返回</span>
                </a>
                 <a class="a-opera pointer">
                    <i><img src="../assets/img/exper_end.png"/></i>
                    <span>结束</span>
                </a>
                <a class="a-opera pointer">
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
                        <a class="pointer" :class="{'active_index':curIndex==2}" @click="curIndex=2">实验报告</a>
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
                    <template v-if="curIndex==2">
                    <h3 class="htitle">填写实验报告</h3>
                    <div class="labReport_box"  >
                        
                        <div class="pic"></div>
                        <div class="from">
                            <el-input v-model="reportText" type="textarea" rows="10" placeholder="实践报告输入"></el-input>
                        </div>
                    </div>
                    </template>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
import RFB from '@novnc/novnc/core/rfb';
export default {
    data(){
        return{
            curIndex:1,
            virtualMachine:0,
            reportText:'',//实验报告输入内容
        }
    },
    beforeCreate() {
        console.log('123456')
       document.getElementsByTagName("body")[0].className="equipment-body";
    },
    beforeDestroy(){
        document.body.removeAttribute("class","equipment-body");
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

    }
}
</script>
<style lang="less" scoped>
@import url(../assets/less/operateExperiment.less);
</style>