<template>
    <div class="chapter_box">
        <ul class="chapter_ul">                         
            <li class="chapter_li" v-for="(item,index) in chapters" :key="index" :class="{'li_focus':item.show}">
                <!--已有章节内容-->
               
                <div class="textline1 cha_title " :class="{'arrow':!item.show,'arrow_up':item.show}"  v-if="item.id">
                    <span class="s_name">章节{{index+1}}：{{item.name}}</span>
                    <!--<span class="s_intro">{{item.introduction}}</span>-->
                    <a class="a_arrow" @click="showSection(item,item.show)"></a>
                </div>
                <div  class="textline1 cha_title new_cha_title" :class="{'arrow':!item.show,'arrow_up':item.show}"  v-if="!item.id">
                     <span class="s_name">章节{{index+1}}：{{item.name}}</span>
                     <div class="din">
                         <input type="text" placeholder="请输入章节"/>
                     </div>
                     <a class="a_arrow" @click="showSection(item,item.show)"></a>
                </div>
                <div class="section_box" v-show="item.show">
                    <ul class="section_ul">
                        <li class="section_li" v-for="(iitem,iindex) in item.sections" :key="iindex">
                            <div class="sec_name textline1">
                                <p class="textline1">第{{iindex+1}}节：{{iitem.name}}</p>
                            </div>
                            <div class="sec_enclosure">
                                <div>附件包含：
                                    <span 
                                    v-for="(i_item,index) in iitem.enclosure.split(',')" :key="index" class="icon" 
                                    :class="{'s-video':i_item==1,'s-pdf':i_item==2,'s-exper':i_item==3,'s-job':i_item==4}">

                                    </span>
                                </div>
                            </div>
                        </li>


                    </ul>
                    <div class="add-btn-box">
                        <a class="btnDefault add-btn pointer">+ 新建小节</a>
                    </div>
                </div>
               
                
            </li>


        </ul>
        <div class="add-btn-box">
            <a class="btnDefault add-btn pointer" @click="click_newChapter">+ 新建章节</a>
        </div>
    </div>

</template>
<script>
export default{
    data(){
        return{
          chapters:[
                {
                    name:'标题内容标题内容标题内容',
                    id:'xjkc2211',
                    introduction:'简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
                    sections:[
                        {
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4' //包含视频，pdf,实验，作业
                        },
                        {
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        }
                    ],
                },
                {
                    id:'xjkc2211',
                    name:'标题内容标题内容标题内容',
                    introduction:'简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
                    sections:[
                        {
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        },
                        {
                        name:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        }
                    ]
                }
            ],
        }
    },
    mounted(){
        let that = this
         //章节下拉添加子元素是否显示参数show
        that.chapters.forEach(item => {
           this.$set(item, 'show', false)
        })
    },
    methods:{
         //显示章节
        showSection(item,show){
            let that = this;
            let tmp = that.chapters
            for(var i = 0;i<tmp.length;i++){
               that.$set(that.chapters[i],'show',false)
               
            }

            that.$set(item,'show',!show)   
        },
        //新建章节
        click_newChapter(){
            let that = this;
            that.chapters.push({name:'',show:false})
        }
    }
}
</script>
<style scoped lang="less">
/*备课课程详情*/
.detail_main{
    /*章节列表*/
     .chapter_box{
        .chapter_li{ margin-top: 20px;}
        .li_focus{border:2px solid @basecolor;.borderRadius(10px,10px,10px,10px); overflow: hidden;}
        .cha_title{background:#F5F5F7; font-size: 18px;line-height: 40px; padding: 7px 60px 7px 60px; position: relative;
           .s_name{color:@fontColor; background: url(../assets/img/d_chapter.png) left center no-repeat; padding: 5px 0 5px 35px; }
           .s_intro{color: @hnavcolor; padding-left: 20px;}
           
        }
        .a_arrow{
           width:20px;height:20px;display: block;position: absolute;right:20px;top:50%;margin-top: -10px; 
            background:#F5F5F7 url(../assets/img/d_arrow_d.png)  center no-repeat;cursor: pointer;
        }

        .cha_title.arrow_up{
           
             .a_arrow{
                  background:#F5F5F7 url(../assets/img/d_arrow_u.png)  center no-repeat;cursor: pointer;
             }
        }

        .din{display: inline-block; width: 80%;
          input{font-size: 18px;color: #6666; width: 100%; padding:0 20px; background: 0 none;color:#333;}
        }

        .new_cha_title{padding-right:90px;}

  

    }
    /*添加按钮样式*/
    .add-btn-box{padding: 20px 0; text-align: center;}
    .add-btn{width:auto;padding:0 50px}

    /*结列表*/
    .section_box{
        .add-btn{padding: 0 20px;}
    }
    .section_ul{
        .section_li{font-size: 0px; border-bottom: 2px solid #EAEAEA; padding:15px 0;
            >div{font-size: 16px;color:@fontColor1;}
            .sec_name{display: inline-block; width:60%;}
            .sec_name p{padding-left: 100px;}
            .sec_enclosure{display: inline-block; width:40%;}
            .sec_enclosure div{margin-left: 20px; margin-right: 50px;}
        }
        
        .icon{width:24px;height:24px;display: inline-block; vertical-align: middle; margin-right: 20px;}
        .s-video{background: url( ../assets/img/d_sp.png) center no-repeat;}
        .s-pdf{background: url(../assets/img/d_pdf.png) center no-repeat;}
        .s-exper{background: url(../assets/img/d_sy.png) center no-repeat;}
        .s-job{background: url(../assets/img/d_zy.png) center no-repeat;}
        
    }
}
</style>