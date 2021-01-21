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
                                <div class=" children_name" :class="{'arrow_up':iitem.show}" @click="showSubsection(index,iitem,iitem.show)">
                                    <p class="textline1">{{iitem.name}}({{iitem.num}})</p>
                                </div>
                               <el-collapse-transition>
                                <ul class="subSection_ul" v-if="iitem.subsection && iitem.show">
                                    <li v-for="(subitem,sub_index) in iitem.subsection" :key="sub_index">
                                        <div class="subSection_name">
                                            <p class="textline1">{{subitem.name}}</p>
                                        </div>
                                    </li>
                                </ul>
                               </el-collapse-transition>
                                
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
                    {
                        id:'5662222',name: '节点启停1',num:40,
                        subsection:[{id:'5dffff',name:'节点启动1'},{id:'5dffff',name:'节点停止1'}]
                    },
                    {
                        id:'5662222',name: '节点启停2',num:40,
                        subsection:[{id:'5dffffss',name:'节点启动2'},{id:'ee5dffff',name:'节点停止2'}]
                    }
                ]},
                 {
                id:'5662222',
                name: '节点共识模拟',
                num:120,
                sections: [
                    {
                        id:'5662222',name: '节点启停1',num:40,
                        subsection:[{id:'5dffff',name:'节点启动1'},{id:'5dffff',name:'节点停止1'}]
                    },
                    {
                        id:'5662222',name: '节点启停2',num:40,
                        subsection:[{id:'5dffffss',name:'节点启动2'},{id:'ee5dffff',name:'节点停止2'}]
                    }
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
        that.addChecked();
        console.log(that.chapters)
        
    },
    methods:{
        //章、杰添加子元素是否显示参数show
        addChecked(){
            let that = this;
            for(var i=0;i<that.chapters.length;i++){
                this.$set(that.chapters[i], 'show', false)

                for(var j=0;j<that.chapters[i].sections.length;j++){
                    this.$set(that.chapters[i].sections[j], 'show', false)
                }
               
            }
        },

        handleNodeClick(data) {
            console.log(data);
        },
         //显示章节
        showSection(item,show){
            let that = this;
            let tmp = that.chapters
            
                that.$set(item,'show',!show)   
            
           

            
        },

        //显示小节
        showSubsection(index,obj,show){
            console.log(show)
            let that = this;
            let temp =that.chapters[index].sections
            
            that.$set(obj,'show',!show) 
            
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
    .p-name{padding:0  40px 0 10px ;font-size:20px; color: @fontColor; cursor: pointer; line-height: 50px;
      position: relative; z-index:9999;
    }
    .p-name.arrow{background: url(../assets/img/n_arrow_d.png) right 20px center no-repeat;}
    .p-name.arrow_up{background:@basecolor url(../assets/img/n_arrow_u.png) right 20px center no-repeat; color:#fff;}
    .children_ul{
        
     
        .children_name{
            font-size: 16px;color:@tabcolor;padding: 0 20px 0 30px;line-height: 50px;border-bottom:1px solid @border;
            background: url(../assets/img/n_arrow_d.png) right 20px center no-repeat;
            overflow: hidden;
        }
        .arrow_up{
            background: url(../assets/img/n_arrow_d_u.png) right 20px center no-repeat;
        }
        >li:last-child{
            .children_name{
                border:0 none
            }
        }

    }

    .subSection_ul{
        border-bottom:1px solid @border;
        li{background: @dialog_nav;}
        .subSection_name{height: 40px; line-height: 40px; padding-left: 50px; padding-right: 20px;color:@fontColor1;}
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
