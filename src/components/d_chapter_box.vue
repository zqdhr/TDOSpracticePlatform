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
                        <div>附件包含：
                            <span
                            v-for="(file,file_index) in item.enclosure" :key="file_index" class="icon"
                            :class="{'s-video':file==0,'s-pdf':file==1,'s-exper':file==2,'s-job':file==2}">

                            </span>
                        </div>
                        
                        
                    </div>
                     <!--已保存添加s-saved-->
                     <span class="s-state s-Not_saved" :class="{'s-saved':1==1}">未保存</span>

                    <el-tooltip class="item" effect="light" content="章节保存" placement="top-start">
                      <a class="a_save pointer" @click="addChapters(index)"></a>
                    </el-tooltip>
                    <a class="icon_edit pointer" @click="edit(1,item.id,item.name,index,iindex,i_index)"></a>
                    <a class="a_arrow" @click="showSection(item,item.show)"></a>
                </div>
                <!--新建章节样式-->
                <div  class="textline1 cha_title new_cha_title" :class="{'arrow':!item.show,'arrow_up':item.show}"  v-if="!item.id" >
                     <span class="s_name">章节{{index+1}}：</span>
                     <div class="din">
                         <input type="text" placeholder="请输入章节" v-model="item.name"/>
                         <!--已保存添加s-saved-->
                         <span class="s-state s-Not_saved" :class="{'s-saved':1==1}">未保存</span>
                     </div>
                      
                      <el-tooltip class="item" effect="light" content="章节保存" placement="top-start">
                        <a class="a_save pointer" @click="addNewChapters(index)"></a>
                      </el-tooltip>
                     <a class=" a_delete" @click="deleteChapter(index)"></a>
                     <a class="a_arrow" @click="showSection(item,item.show)"></a>
                </div>

                <el-collapse-transition>
                <div class="section_box" v-if="item.show">
                    <ul class="section_ul">
                        <li class="section_li" v-for="(iitem,iindex) in item.sections" :key="iindex" :class="{'new_section_li':!iitem.id}">
                            <!--节-->
                            <template v-if="iitem.id">
                            <div class="section_box d-section_name" :class="{'arrow':!iitem.show,'arrow_up':iitem.show}">
                                <div class="sec_name textline1">
                                    <p class="textline1">第{{iindex+1}}节：{{iitem.name}}</p>

                                </div>
                                <div class="sec_enclosure" >
                                    <div>附件包含：
                                        <span
                                        v-for="(i_file_item,i_file_index) in iitem.secEnclosure" :key="i_file_index" class="icon"
                                        :class="{'s-video':i_file_item==0,'s-pdf':i_file_item==1,'s-exper':i_file_item==2,'s-job':i_file_item==3}">

                                        </span>
                                    </div>
                                </div>
                                <a class="icon_edit pointer" @click="edit(2,iitem.id,iitem.name,index,iindex,i_index)"></a>
                                <a class="a_arrow" @click="showSection_children(index,iitem,iitem.show)"></a>
                            </div>
                            </template>>
                            <template v-if="!iitem.id">
                            <div class="section_box new_section_in_box">
                                <div class="sec_name textline1 new_sec_name">
                                    <span class="textline1">第{{iindex+1}}节：</span>
                                    <div class="din">
                                        <input placeholder="请输入节名称" v-model="iitem.name"/>
                                    </div>
                                </div>
                                <a class=" a_delete" @click="deleteSection(index,iindex)"></a>
                                <a class="a_arrow" @click="showSection_children(index,iitem,iitem.show)"></a>
                            </div>
                            </template>
                            <!--小节-->
                            <el-collapse-transition>
                            <ul class="section_ul i_section_ul" v-if="iitem.show">
                                <li class="section_li" v-for="(i_item,i_index) in iitem.small_sections" :key="i_index" :class="{'new_section_li':!i_item.id}">
                                     <template v-if="i_item.id">
                                        <div class="sec_name textline1">
                                            <p class="textline1">第{{i_index+1}}小节：{{i_item.name}}</p>
                                              <a class="icon_edit pointer" @click="edit(3,i_item.id,i_item.name,index,iindex,i_index)"></a>
                                        </div>
                                    </template>>
                                    <template v-if="!i_item.id">
                                            <div class="sec_name textline1 ">
                                                <span class="textline1">第{{i_index+1}}小节：</span>
                                                <div class="din">
                                                    <input placeholder="请输入小节名称" v-model="i_item.name"/>
                                                </div>
                                                <a class=" a_delete" @click="deleteSection(index,i_index)"></a>
                                            </div>
                                    </template>

                                </li>
                                 <div class="add-btn-box">
                                    <a class="btnDefault add-btn pointer" @click="click_new_section(index,iindex,item)">+ 新建小节</a>
                                </div>
                            </ul>
                            </el-collapse-transition>

                        </li>


                    </ul>
                    <div class="add-btn-box">
                        <a class="btnDefault add-btn pointer" @click="click_section(index,item)">+ 新建节</a>
                    </div>
                </div>
                </el-collapse-transition>
                
            </li>


        </ul>
        <div class="add-btn-box">
            <a class="btnDefault add-btn pointer" @click="click_newChapter">+ 新建章节</a>
        </div>
        <!--
        <div class="add-btn-box last-btn-box">
            <a class="btnDefault add-btn pointer" @click="addChapters">确认上传</a>
        </div>
        -->

         <!--删除弹出框-->
        <el-dialog :visible.sync="isDelete" width="600px">
        <div slot="title" class="dialog_header">请注意!</div>
        <div class="confirm_dialog_body">
            <p class="dialog_mess">
            <span class="span_icon icon_waring">确认删除此章（小节）吗？</span>
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <a class="btnDefault" @click="deleteChapterOrSection">确 认</a>
            <a
            class="btnDefault"
            @click="isDelete = false;"
            >取 消</a
            >
        </div>
        </el-dialog>

        <!--编辑弹出框-->
         <!--修改编辑弹出框-->
    <el-dialog
     
      :visible.sync="isEdit"
      width="600px"
      class="personDialog"
      
    >
    <div slot="title" class="dialog_header">{{editTitle}}</div>

      <div class="editMain" >
        <el-form ref="form" label-width="60px">
          <el-form-item label="名称">
            <el-input v-model="editValue"></el-input>
          </el-form-item>
        
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btnDefault" @click="isEdit = false">取消</button>
        <button class="btnDefault" @click="modify">确认修改</button>
      </span>
    </el-dialog>

    </div>

</template>
<script>
import {getCourseById,getCoursewareBySectionId,insertCourseChapterCompleted,getCoursewareByChapterId,getAssignmentBySectionId} from '@/API/api';
export default{
    data(){
        return{
          chapters:[
            ],
            isDelete:false,
            deleteMess:'',
            course_Id:'',
            editTitle:'章修改',
            editValue:'',
            editId:'',
            isEdit:false,
            small_sections:[{
                id:'section123',
                name:'dgfdgfgfdgf',
            }],
            index:'',
            iindex:'',
            i_index:'',
            num:'',
            order:1,
            test:''
        }
    },
    props:{
        courseId:{
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
                    res.data.chapters.sort(this.compare1('order'))
                    that.chapters = res.data.chapters
                    // for(let i =0;i<res.data.chapters.length;i++){
                    //     that.getCoursewareByChapterId(res.data.chapters[i].id,i)
                    //     for(let j = 0 ;j<res.data.chapters[i].sections.length;j++){
                    //         that.getCoursewareBySectionId(res.data.chapters[i].sections[j].id,i,j)
                    //         // that.getAssignmentBySectionId(res.data.chapters[i].sections[j].id,i,j)
                    //     }
                    // }


                }else{
                    that.$toast(res.message,3000)
                }
            })
        },

        // getCoursewareByChapterId(chapterId,index){
        //     let that = this;
        //     let obj = {};
        //     obj.chapterId = chapterId;
        //     obj.perPage = 10;
        //     obj.page = 1;
        //     getCoursewareByChapterId(obj).then(res=> {
        //         if(res.code==200){
        //             for(let i =0;i<res.data.list.length;i++){
        //                 that.$set(that.chapters[index], "enclosure", res.data.list[i].kind);
        //             }
        //         }else{
        //             that.$toast(res.message,3000)
        //         }
        //     })
        // },
        //
        // getCoursewareBySectionId(sectionId,cIndex,sIndex){
        //     let that = this;
        //     let obj = {};
        //     obj.sectionId = sectionId;
        //     obj.perPage = 10;
        //     obj.page = 1;
        //     getCoursewareBySectionId(obj).then(res=> {
        //         if(res.code==200){
        //             for(let i =0;i<res.data.list.length;i++){
        //                 console.log(that.chapters[cIndex].sections[sIndex])
        //                 that.$set(that.chapters[cIndex].sections[sIndex], "secEnclosure", res.data.list[i].kind);
        //             }
        //         }else{
        //             that.$toast(res.message,3000)
        //         }
        //     })
        //},

        //删除
        deleteChapter(num){
            let that = this;
            that.chaptersNum = num;
            that.isDelete=true;
            that.chaptersOrsectio=1;

        },
        //删除小节
        deleteSection(num,num1){
            let that = this;
            that.chaptersNum = num;
            that.sectionNum=num1;
            that.isDelete=true;
            that.chaptersOrsectio=2;
        },
        //判断是删除章还是节
        deleteChapterOrSection(){
            let that=this;
            if (that.chaptersOrsectio==1) {
                that.chapters.splice(that.chaptersNum,1)
            } else {
                that.chapters[that.chaptersNum].sections.splice(that.sectionNum,1)
            }
            that.isDelete = false;
        },

        //升序
        compare1(attr) {
            return function(a,b){
                var val1 = a[attr];
                var val2 = b[attr];
                return val1 - val2;
            }
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
        //新建章节
        click_newChapter(){
            let that = this;
            let tmp = that.chapters.length
            that.chapters.push({name:'',introduction:'',order:tmp,show:false,sections:[]})
        },
        //新建节
        click_section(index,obj){
           let that = this;
           let tmp = that.chapters[index].sections.length;
           that.chapters[index].sections.push({name:'',order:tmp,show:false,small_sections:[]})
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
        /*新建小节 */
        click_new_section(index,iindex,item){
          let that = this;
            let tmp = that.chapters[index].sections[iindex].small_sections.length;
           that.chapters[index].sections[iindex].small_sections.push({name:'',order:tmp,show:false})
        },
        addChapters(index){
            let that = this;
            let obj = {};
            console.log(index)
            obj.course_id = that.courseId
            obj.chapter = that.chapters[index];
            console.log(obj)
            insertCourseChapterCompleted(JSON.stringify(obj)).then(res=> {
                if(res.code==200){
                    that.getCourseById();
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        addNewChapters(index){
            let that = this;
            console.log(index)
            console.log(that.chapters[index])
            let obj = {};
            console.log(index)
            obj.course_id = that.courseId
            obj.chapter = that.chapters[index];
            console.log(obj)
            insertCourseChapterCompleted(JSON.stringify(obj)).then(res=> {
                if(res.code==200){
                    that.getCourseById();
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        //点击编辑
        edit(num,id,text,index,iindex,i_index){
            let that = this;
            that.isEdit = true;
            that.editValue = text;
            that.editId = id
            that.index = index
            that.iindex = iindex
            that.i_index = i_index
            that.num = num
            console.log(index)
            //章
           if(num==1){
              that.editTitle = "章修改"
              console.log(text)
           }
           //节
           if(num==2){
               that.editTitle = "节修改"
              console.log(text)
           }
           //小节
           if(num==3){
              that.editTitle = "小节修改"
              console.log(text)
           }
        },
        modify(){
            let that = this;
            console.log(that.num)
            //章
            if(that.num==1){
                console.log(that.editValue)
                that.chapters[that.index].name = that.editValue;
            }
            //节
            if(that.num==2){
                console.log(that.editValue)
                that.chapters[that.index].sections[that.iindex].name = that.editValue;
            }
            //小节
            if(that.num==3){
                console.log(that.editValue)
                that.chapters[that.index].sections[that.iindex].small_sections[that.i_index].name = that.editValue;
            }
            that.isEdit = false;
        }
    }
}
</script>
<style scoped lang="less">
/*备课课程详情*/
.detail_main{
    /*章节列表*/
     .a_save{width:20px;height: 20px;display: block;background: url(../assets/img/chapter_save.png) center no-repeat; 
       position:absolute;top:50%;margin-top: -10px;right:86px;
       background-size: 20px 20px; -webkit-background-size: 20px 20px;
     }
     .s-state{width:19%;display: inline-block; vertical-align:middle; text-align:right; font-size:16px;}
     .s-Not_saved{color:#e33737}
     .s-saved{color:#24c41c;}
     .chapter_box{
        .chapter_li{ margin-top: 20px;}
        .li_focus{border:2px solid @basecolor;.borderRadius(10px,10px,10px,10px); overflow: hidden;}
        .cha_title{background:#F5F5F7; font-size: 18px;line-height: 40px; padding: 7px 180px 7px 20px; position: relative;
           .s_name{color:@fontColor; background: url(../assets/img/d_chapter.png) left center no-repeat; padding: 5px 0 5px 35px; }
           .s_intro{color: @hnavcolor; padding-left: 20px;}
           .chapter_name_box{
               display: inline-block; width:60%; vertical-align: middle;

           }
           .s-state{right:130px;position: absolute;}
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
        .din{display: inline-block; width: 88%;
          input{font-size: 18px;color: #6666; width:90%; background: 0 none;color:#333; line-height: 40px;}
        }

        .new_cha_title{padding-right:180px;}

  

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