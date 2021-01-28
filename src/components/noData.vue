<template>
    <div class="nodata_box">
        <div class="icon"></div>
        <p class="noData_mess">当前暂无内容，请点击左侧菜单</p>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    }
}
</script>
<style lang="less" scoped>
.nodata_box{margin: 0 auto;
   padding: 30px 0;
   .icon{background: url(../assets/img/no_data.png) center no-repeat; width: 260px;height: 277px; margin:0 auto;}
}
.noData_mess{
    font-size:18px; color: #444444; padding-top: 15px; text-align: center;
}
</style>