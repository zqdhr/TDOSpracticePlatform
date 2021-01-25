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
        <div class="experiment_container">
            <div class="left-noVNc"></div>
            <div class="right_main">
                <el-scrollbar style="height:100%">
                    <div class="nav">
                        <a>实验步骤</a>
                        <a>实验报告</a>
                    </div>
                    <div v-if="curIndex=1">
                        <ul class="step-ul">

                        </ul>
                    </div>
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