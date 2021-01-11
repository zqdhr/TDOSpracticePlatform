<template>
    <div class="courseNav">
        <el-scrollbar style="height:100%">
           <p class="textline1 p-courseName">{{courseName}}</p>
           <ul class="tree_ul">
              <li class="tree_li" v-for="(item,index) in chapters" :key="index">
                  <div class="p-name" :class="{'arrow':!item.show,'arrow_up':item.show}" @click="showSection(item,item.show)">
                      <p class="textline1">{{index+1}}、{{item.name}}({{item.num}})</p>
                 </div>
                   
                    <el-collapse-transition>
                        <ul class="children_ul" v-show="item.show">
                            <li v-for="(iitem,iindex) in item.sections" :key="iindex" class="pointer">
                                <div class=" children_name">
                                    <p class="textline1">{{iitem.name}}({{iitem.num}})</p>
                                </div>
                            </li>
                        </ul>
                   </el-collapse-transition>
                 
              </li>       
           </ul>
        </el-scrollbar>
    </div>
</template>
<script>
export default {
    data(){
        return{
            courseName:'《节点的模拟运行课程》',
            courseId:'36a81315-c928-430f-940a-af913743621b',
            
            chapters: [
                {
                id:'5662222',
                name: '节点共识模拟',
                num:120,
                sections: [
                    {id:'5662222',name: '节点启停',num:40}
                ]},
                {
                id:'5662222',
                name: '异常篇',
                num:120,
                sections: [
                    {id:'5662222',name: '51%攻击',num:40},
                    {id:'5662222',name: '软分叉',num:40},
                    {id:'5662222',name: '硬分叉',num:40},
                    {id:'5662222',name: '重放攻击',num:40},
                    {id:'5662222',name: '延展性攻击',num:40},
                    {id:'5662222',name: '长程攻击',num:40},
                    {id:'5662222',name: '智能合约漏洞',num:40},
                ]
            }    
            ]
           
       
        }
    },
    mounted(){
        let that = this;
        //章节下拉添加子元素是否显示参数show
        for(var i=0;i<that.chapters.length;i++){
           this.$set(that.chapters[i], 'show', false)
        }
    },
    methods:{
            menuEnter: function(el, done) {
    //这行是关键
      el.offsetWidth;
      el.style.maxHeight =  600
      el.style.transition = "all 0.3s ease-in";
      done();
    },
    menuLeave: function(el) {
      el.offsetWidth;
      el.style.maxHeight = 0;
      el.style.transition = "all 0.3s ease-out";
    },

        handleNodeClick(data) {
            console.log(data);
        },
         //显示章节
        showSection(item,show){
            let that = this;
            let tmp = that.chapters
            for(var i = 0;i<tmp.length;i++){
               that.$set(that.chapters[i],'show',false)
               
            }

            that.$set(item,'show',!show)   
        }
       
    }
}
</script>
<style lang="less">

</style>
<style lang="less" scoped>
.courseNav{
    position: absolute;width: 320px; background: @background; height: 100%;
    .p-courseName{font-size: 22px; color:@basecolor;text-align: center; padding: 20px 10px;}
    .p-name{padding:0  40px 0 10px ;font-size:20px; color: @fontColor; cursor: pointer; line-height: 50px;}
    .p-name.arrow{background: url(../assets/img/n_arrow_d.png) right 20px center no-repeat;}
    .p-name.arrow_up{background:@basecolor url(../assets/img/n_arrow_u.png) right 20px center no-repeat; color:#fff;}
    .children_ul{
        
        >li{border-bottom: 2px solid @linecoloe; height: 50px; line-height: 50px;}
        .children_name{
            font-size: 18px;color:@fontColor1;padding: 0 50px;
        }
    }
    

}



@media screen and (max-width:1440px) {
    .courseNav{width:280px;
     .p-courseName{font-size:18px;}
     .p-name{font-size: 16px;}
     .children_name{font-size: 14px;}
    }
}
</style>
