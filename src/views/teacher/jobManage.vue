<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div>
                    <div class="fl"></div>
                    <div class="fr"></div>
                </div>
                <div class="mess">
                    当前选择XXXX班级，共有<span>60</span>名学员，已提交<span>45</span>份，还剩<span>15</span>份未提交
                    <el-tooltip class="item" effect="light" :content="userList" placement="right-start">
                       <a class="nosubmit"></a>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
      return{
        userList:'张三，李四，王龙，李明'
      }
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>