<template>
    <div class="PP_header">
        <div class="header-container">
          <div class="container">  
            <div class="fl fl-logo"><div class="logo"></div><span>区块链实践平台</span></div>
            
            <div class="fr fr-info">
                欢迎你,<span>陈友谅(工号:0056)</span>
                <div class="hline"></div>
                <a class="btnexit">退出系统</a>
            </div>
            <ul class="nav_ul">
               <li class="cur">
                   <a>统计分析</a>
                   
               </li>
                <li><a>课程管理</a></li>
                <li> <a>库</a></li>
                <li><a>运行实验管理</a></li>
                <li><a>人员管理</a></li>    
            </ul>  
          </div> 
        </div>
        
    </div>
</template>

<style lang="less" scoped>
.PP_header{position:fixed;width:100%;height:75px;background:#fff;top:0px;z-index: 999; width:100%;
-moz-box-shadow:0px 4px 6px 0px rgba(8, 22, 125, 0.14);/*firefox*/ 
-webkit-box-shadow:0px 4px 6px 0px rgba(8, 22, 125, 0.14);/*webkit*/ 
box-shadow:0px 4px 6px 0px rgba(8, 22, 125, 0.14);/*opera或ie9*/ 

.header-container{
    margin: 0 60px;
}
.logo{width:33px;height:33px; display:inline-block; vertical-align:top; background:@basecolor;}
.fl-logo{ padding: 21px 0; height: 33px; line-height: 33px;
    span{color:@fontColor; padding-left: 15px; font-size:18px;}
}

.fr-info{
    color:@fontColor1; line-height:35px; height:35px; margin-top: 20px; font-size: 14px;
    .hline{width:2px;height:15px;background:#ddd; display: inline-block; vertical-align:middle; margin: 0 10px;}
    .btnexit{padding-left: 20px;background: url(../assets/img/icon_exit.png)left center no-repeat; cursor: pointer;}
    .btnexit:hover{color:@basecolor;background: url(../assets/img/icon_exit_h.png)left center no-repeat; cursor: pointer;}
}

.nav_ul{
     margin: 0  auto;text-align: center;
    li{padding:0 30px; display: inline-block; height: 75px; line-height: 75px; position: relative;}
    li a{font-size:18px;color:@hnavcolor; cursor: pointer;}
    li:hover a,li.cur a{color:@basecolor;}
    li:hover:after,li.cur:after{
        content:''; width:71px;height: 3px;position: absolute;left:50%;margin-left: -35px; bottom:0px;
        background:@basecolor;
    }
}
@media screen  and (min-width:1500px){
 .nav_ul{
       li{padding: 0 40px;}
   } 
}
@media screen  and (max-width:1200px){
   
   .nav_ul{
       li{padding: 0 20px;}
   } 
}

}



@media screen  and (max-width:1200px){
.PP_header{width: 1200px; position: static;}
}

</style>