<template>
    <div class="nodata_box nodata_page_box">
        <div class="icon"></div>
        <p class="noData_mess" :class="{'noData_page_mess':noDataType==1}">{{dataMess!=''?dataMess:'当前暂无内容，请点击左侧菜单'}}</p>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        noDataType:{
            default:0  ,//1表示功能列表
        },
        dataMess:{
            default:'',
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
.noData_page_mess{color:@basecolor;}

.nodata_page_box{padding:80px 0; padding-top: 120px;}

</style>