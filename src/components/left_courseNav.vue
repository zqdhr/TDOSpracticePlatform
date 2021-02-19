<template>
    <div class="courseNav" >
        <el-scrollbar style="height:100%">
           <p class="textline1 p-courseName">{{courseName}}</p>
           <ul class="tree_ul">
              <li class="tree_li" v-for="(item,index) in chapters" :key="index">
                  <div class="p-name" :class="{'arrow':!item.show,'arrow_up':item.show}" @click="showSection(item,item.show,item.id)">
                      <p class="textline1">{{index+1}}、{{item.name}}</p>
                 </div>
                   
                    <el-collapse-transition>
                        <ul class="children_ul" v-show="item.show">
                            <li v-for="(iitem,iindex) in item.sections" :key="iindex" class="pointer">
                                <div class=" children_name" :class="{'arrow_up':iitem.id ==sectionId}" @click="showSubsection(index,iitem,iitem.show,item.id,iitem.id)">
                                    <p class="textline1">{{iitem.name}}</p>
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
import {getCourseById} from '@/API/api';
export default {
    data(){
        return{
            courseName:'《节点的模拟运行课程》',
            courseId:'36a81315-c928-430f-940a-af913743621b',
            sectionId:'',//当前选中的节id
            chapters: [
            ]
           
       
        }
    },
    props:{
        course:{
            default:''
        }
    },
    mounted(){
        let that = this;
        that.addChecked();
        that.getCourseById();
    },
    methods:{
        getCourseById(){
            let that = this;
            let obj = {};
            obj.course_id = this.$route.query.courseId
            getCourseById(obj).then(res=> {
                if(res.code==200){
                    that.courseName = res.data.name;
                    res.data.chapters.sort(this.compare1('order'))
                    that.chapters = res.data.chapters;
                    console.log(that.chapters)
                }else{
                    this.$toast(res.message,2000)
                }
            })
        },
        //升序
        compare1(attr) {
            return function(a,b){
                var val1 = a[attr];
                var val2 = b[attr];
                return val1 - val2;
            }
        },
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
        showSection(item,show,cid) {
            let that = this;
            let tmp = that.chapters;
            console.log(item.sections)
            item.sections.sort(this.compare1('order'))
            that.$set(item,'show',!show)
            that.sectionId = '';
            
            this.$emit('getData', {cindex:cid,sindex:''})
        },

        //显示小节
        showSubsection(index,obj,show,cid,sid){
            let that = this;
            let temp =that.chapters[index].sections
            that.sectionId = sid            
            that.$set(obj,'show',!show)
            this.$emit('getData', {cindex:cid,sindex:sid})
            
        },
       
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
      position: relative; 
    }
    .p-name.arrow{background: url(../assets/img/n_arrow_d.png) right 20px center no-repeat;}
    .p-name.arrow_up{background:@basecolor url(../assets/img/n_arrow_u.png) right 20px center no-repeat; color:#fff;}
    .children_ul{
        
     
        .children_name{
            font-size: 16px;color:@tabcolor;padding: 0 20px 0 30px;line-height: 50px;border-bottom:1px solid @border;
           // background: url(../assets/img/n_arrow_d.png) right 20px center no-repeat;
            overflow: hidden;
        }
        .arrow_up{
           // background: url(../assets/img/n_arrow_d_u.png) right 20px center no-repeat;
           color: @basecolor;
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
