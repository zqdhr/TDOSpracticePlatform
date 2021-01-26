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
                            <el-input v-model="input" type="textarea" rows="10" placeholder="实践报告输入"></el-input>
                        </div>
                    </div>
                    </template>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            curIndex:1,
            virtualMachine:0
        }
    },
    beforeCreate() {
        console.log('123456')
       document.getElementsByTagName("body")[0].className="equipment-body";
    },
    beforeDestroy(){
        document.body.removeAttribute("class","equipment-body");
    },
}
</script>
<style lang="less" scoped>
@import url(../assets/less/operateExperiment.less);
</style>