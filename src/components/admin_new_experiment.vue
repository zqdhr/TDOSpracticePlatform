<template>
    <div>
      <el-dialog class="dialog_pagination admin_dialog_newExperiment"
      :visible.sync="isNew_experiment"
      width='1100px'      
       >
        <div slot="title" class="dialog_header">新增实验</div>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
       return{
           isNew_experiment:true,
       }
    },
    methods:{
        click_new(){
            let that = this;
            that.isNew_experiment =true;
        }
    }
}
</script>
<style lang="less" scoped>

</style>