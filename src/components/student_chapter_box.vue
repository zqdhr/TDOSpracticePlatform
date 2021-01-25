<template>
    <div class="chapter_box">
        <ul class="chapter_ul">                         
            <li class="chapter_li" v-for="(item,index) in chapters" :key="index" :class="{'li_focus':item.show}">
                <!--已有章节内容-->
               
                <div class="textline1 cha_title " :class="{'arrow':!item.show,'arrow_up':item.show}"  v-if="item.id">
                    <div class="chapter_name_box textline1">
                        <span class="s_name">章节{{index+1}}：{{item.name}}</span>
                    </div>
                     <div class="sec_enclosure">
                        <div v-if="item.enclosure">附件包含：{{item.enclosure}}
                            <span
                            v-for="(file,file_index) in item.enclosure" :key="file_index" class="icon"
                            :class="{'s-video':file==1,'s-pdf':file==2,'s-exper':file==3,'s-job':file==4}">
                            </span>
                        </div>
                    </div>
                  
                    <a class="a_arrow" @click="showSection(item,item.show)"></a>
                </div>


                <el-collapse-transition>
                <div class="section_box" v-if="item.show">
                    <ul class="section_ul">
                        <li class="section_li" v-for="(iitem,iindex) in item.sections" :key="iindex" :class="{'new_section_li':!iitem.id}">
                            <!--节-->
                    
                            <div class="section_box d-section_name" :class="{'arrow':!iitem.show,'arrow_up':iitem.show}">
                                <div class="sec_name textline1">
                                    <p class="textline1">第{{iindex+1}}节：{{iitem.name}}</p>

                                </div>
                                <div class="sec_enclosure">
                                    <div>附件包含：
                                        <span
                                        v-for="(i_file_item,i_file_index) in iitem.enclosure" :key="i_file_index" class="icon"
                                        :class="{'s-video':i_file_item==1,'s-pdf':i_file_item==2,'s-exper':i_file_item==3,'s-job':i_file_item==4}">

                                        </span>
                                    </div>
                                </div>
                              
                                <a class="a_arrow" @click="showSection_children(index,iitem,iitem.show)"></a>
                            </div>
                    
                            <!--小节-->
                            <el-collapse-transition>
                            <ul class="section_ul i_section_ul" v-if="iitem.show">
                                <li class="section_li" v-for="(i_item,i_index) in iitem.smallSections" :key="i_index" :class="{'new_section_li':!i_item.id}">
                                    <div class="sec_name textline1">
                                        <p class="textline1">第{{i_index+1}}小节：{{i_item.name}}</p>
                                    </div>
                                </li>
                            </ul>
                            </el-collapse-transition>

                        </li>


                    </ul>
                    
                </div>
                </el-collapse-transition>
                
            </li>


        </ul>



    </div>

</template>
<script>
import {getCourseById,getCoursewareBySectionId} from '@/API/api';
export default{
    data(){
        return{
          chapters:[
                {
                    id:'xjkc2211',
                    name:'标题内容标题内容标题内容',
                    introduction:'简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
                    sections:[
                        {
                        id:'lfllff',
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:[1,2,3,4],
                        smallSections:[{
                            id:'section123',
                            name:'dgfdgfgfdgf',
                        }]
                        },
                        {
                        id:'dfkldfklal',
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:[1,2,3,4],
                        smallSections:[{
                            id:'section123',
                            name:'dgfdgfgfdgf',
                        }]
                        }
                    ]
                }
            ],

        }
    },
    props:{
        courseId:{
            default:''
        },
        course:{
            default:''
        }
    },
    /*
    watch:{
        courseId:{
            handler(courseId){
                this.course_Id = courseId;

            }
        }
    },
    */
    created() {
        let that = this;
        that.getCourseById();
    },
    mounted(){
        let that = this
        //that.getCourseById();
         //章节下拉添加子元素是否显示参数show
         for(var i=0;i<that.chapters.length;i++){
            this.$set(that.chapters[i], 'show', false);
            for(var j=0;j<that.chapters[i].sections.length;j++){
                 this.$set(that.chapters[i].sections[j], 'show', false);
            }
         }


    },
    methods:{
        getCourseById(){
            let that = this;
            let obj = {};
            obj.course_id = that.courseId;
            getCourseById(obj).then(res=> {
                if(res.code==200){
                    that.chapters = res.data.chapters
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },


         //显示章节
        showSection(item,show){
            let that = this;
            let tmp = that.chapters
            for(var i = 0;i<tmp.length;i++){
               that.$set(that.chapters[i],'show',false)
               
            }

            that.$set(item,'show',!show)   
        },
    
        /*显示小节 */
        showSection_children(index,item,show){
            console.log(index)
           let that = this;
           let tmp = that.chapters[index].sections;
           console.log(tmp)
           for(var i =0;i<tmp.length;i++){

               that.$set(that.chapters[index].sections[i],'show',false)
           }
           that.$set(item,'show',!show)
           console.log(that.chapters)
        },

        addChapters(){
            let that = this;
            console.log(that.chapters)
        },
     
    }
}
</script>
<style scoped lang="less">
/*备课课程详情*/
.detail_main{
    /*章节列表*/
   
     .chapter_box{
          min-height: 300px;
        .chapter_li{ margin-top: 20px; padding-bottom:20px;}
        .li_focus{border:2px solid @basecolor;.borderRadius(10px,10px,10px,10px); overflow: hidden;}
        .cha_title{background:#F5F5F7; font-size: 18px;line-height: 40px; padding: 7px 60px 7px 20px; position: relative;
           .s_name{color:@fontColor; background: url(../assets/img/d_chapter.png) left center no-repeat; padding: 5px 0 5px 35px; }
           .s_intro{color: @hnavcolor; padding-left: 20px;}
           .chapter_name_box{
               display: inline-block; width:60%; vertical-align: middle;

           }
        }
        .a_arrow{
           width:20px;height:20px;display: block;position: absolute;right:20px;top:50%;margin-top: -10px; 
            background: url(../assets/img/d_arrow_d.png)  center no-repeat;cursor: pointer;
        }

        .cha_title.arrow_up{
             .a_arrow{
                  background: url(../assets/img/d_arrow_u.png)  center no-repeat;cursor: pointer;
             }
        }

        .a_delete{
             width:20px;height:20px;display: block;position: absolute;top:50%;margin-top: -10px;
            background: url(../assets/img/icon_del.png)  center no-repeat;cursor: pointer; right:56px}
        .din{display: inline-block; width: 80%;
          input{font-size: 18px;color: #6666; width: 100%; background: 0 none;color:#333; line-height: 40px;}
        }

        .new_cha_title{padding-right:90px;}

  

    }
    /*添加按钮样式*/
    .add-btn-box{padding: 20px 0; text-align: center;}
    .add-btn{width:auto;padding:0 50px}
    .last-btn-box{padding-top:0px}

    /*附件*/
    .sec_enclosure{display: inline-block; width:40%;vertical-align:middle;
        .icon{width:24px;height:24px;display: inline-block; vertical-align:middle; margin-right: 20px;}
        .s-video{background: url( ../assets/img/d_sp.png) center no-repeat;}
        .s-pdf{background: url(../assets/img/d_pdf.png) center no-repeat;}
        .s-exper{background: url(../assets/img/d_sy.png) center no-repeat;}
        .s-job{background: url(../assets/img/d_zy.png) center no-repeat;}
    }
    .sec_enclosure div{margin-left: 20px; margin-right:20px;}

    .cha_title{
        position: relative;
       .sec_enclosure div{margin-left:45px; font-size:16px;}
    }

    /*结列表*/
    .section_box{

         .a_delete{right:30px}
        .add-btn{padding: 0 20px;}
    }
    .d-section_name{
        background: @bge3e3e3; padding: 10px 40px 10px 0;
        .sec_enclosure div{margin-left: 40px;}
        .a_arrow{right:20px;}
    }

    .section_ul{
        overflow: hidden;
        .section_li{font-size: 0px;   position: relative;margin:15px 20px 0 30px;
            >div{font-size: 16px;color:@fontColor1;}
            .section_box{
                position: relative;

            }
            .arrow_up{
                .a_arrow{background: url(../assets/img/d_arrow_u.png)  center no-repeat;cursor: pointer;}
            }
            .sec_name{display: inline-block; width:60%; vertical-align:middle; position: relative;}
            .sec_name p{padding-left:30px;}


            .new_sec_name{
                padding-left: 30px; width:90%;
                input{font-size: 16px; line-height:40px;}
            }
        }
        .new_section_in_box{background:@bge3e3e3;
         .a_arrow{right:20px;}
         .a_delete{right:58px}
        }


        .line1{width:30px;height: 1px;background: @linecoloe; position: absolute; top:50%; margin-top: -0.5px;}
        .line2{width:1px;height:60px;background: @linecoloe;position: absolute;left:0px; top:-31px}

        
    }
    /*小节列表*/
    .i_section_ul{
        .section_li{
             margin: 15px 0 0 30px;
             .sec_name{background: @bgf0f0f0;  width:80%; padding-right: 20%; position: relative;}
            .sec_name p{padding-left:0px; line-height: 40px; padding-left: 30px;}
            .din input{font-size: 16px;}
            .a_delete{right:0px}
            .icon_edit{right:20px}
        }
        .new_section_li{
            margin-right: 0px;
           .sec_name{ display: block; padding-left: 30px; width:auto;}
           .a_delete{right:20px}
        }
        
    }

    .icon_edit{width:20px;height:20px;display: block;
    background: url(../assets/img/icon_edit.png) center no-repeat; position:absolute; top:50%;margin-top: -10px;}
   .cha_title,.d-section_name{
       .icon_edit{right:50px}
   }
   .editMain{margin:0 30px}

   
}
</style>