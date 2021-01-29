<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="pageTitle clearfix">
                    当前位置：<a @click="linkcourse">课程管理</a> > <span>新建课程</span>
                </div>
            </div>

            <div class="newCourse_box">
                <div class="col_title">
                    01请先设置课程基础信息
                </div>
                <div class="formMain">
                    <el-form ref="form" label-width="120px">
                        <el-form-item label="课程名称：">
                            <el-input v-model="course.name"></el-input>
                        </el-form-item>
                        <el-form-item label="课程详情：">
                            <el-input v-model="course.intro" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item label="课程封面：">
                            <div class="PicFm" v-for="(file,index) in files" :key="index">
                                <img class="td-image-thumb" v-if="file.thumb" :src="file.thumb" />
                            </div>
                            <file-upload
                                style="overflow: visible"
                                :maximum="1"
                                :multiple="true"
                                ref="upload"
                                v-model="files"
                                extensions="jpg,gif,png,webp"
                                :post-action="uploadUrl"
                                :auto-upload="false"
                                @input-file="inputFile"
                                @input-filter="inputFilter"
                                name="excel_file"
                                :headers="{ Authorization: jwt }"
                            >
                            <a class="a_upload">
                                <i class="icon"></i>
                                <span>上传图片</span>
                            </a>
                            </file-upload>
                            <div class="upload_mess">（请选择10MB以内比例300:180的图片）</div>
                        </el-form-item>
                    </el-form>
                </div>
<!--                <div class="col_title">-->
<!--                    02编辑课程大纲-->
<!--                </div>-->
                <div class="addChapter">
<!--                     <ul class="chaper_ul">-->
<!--                        <li v-for="(item,index) in chapters" :key="index">-->
<!--                            <div class="din">-->
<!--                                <input type="text" maxlength="50" class="boxsizing" v-model="item.name" placeholder="请输入课程大纲"/>-->
<!--                                <a class="pointer btn_add" @click="addSection(index)"></a>-->
<!--                                <a class="pointer btn_del" @click="deleteChapter(index)"></a>-->
<!--                            </div>-->
<!--                            <div class="chapter_box">-->
<!--                                <div class="sectionBox "  v-for="(iitem,index1) in item.sections" :key="index1">-->
<!--                                    <div class="din">-->
<!--                                        <input class="input_section boxsizing" type="text" maxlength="50" v-model="iitem.name" placeholder="请输入课程节名称"/>-->
<!--                                        <a class="pointer btn_del" @click="deleteSection(index,index1)"></a>-->
<!--                                        <a class="pointer btn_add" @click="addSubSection(index,index1)"></a>-->
<!--                                        <div class="line1"></div>-->
<!--                                    </div>-->
<!--                                    -->
<!--                                    <div class="line2" :style="{'height': index1==0?36+'px':(52+newSubSection*52)+'px','top':index1==0?0+'px':(36+(index1-1)*52)+'px'}"></div>-->
<!--                                   -->
<!--                                    -->
<!--                                    <div class="subSectionBox">-->
<!--                                        <div class="sectionBox  sub_sectionBox"  v-for="(sub_iitem,sub_index) in iitem.small_sections" :key="sub_index">-->
<!--                                            <div class="din">-->
<!--                                                <input class="input_section boxsizing" type="text" maxlength="50" v-model="sub_iitem.name" placeholder="请输入小节名称"/>-->
<!--                                                <a class="pointer btn_del" @click="deleteSection(index,sub_index)"></a>-->
<!--                                                 <div class="line1"></div>-->
<!--                                            -->
<!--                                            </div>-->
<!--                                            <div class="line2" :style="{'height': sub_index==0?36+'px':(52)+'px','top':sub_index==0?0+'px':(36+(sub_index-1)*52)+'px'}"></div>-->
<!--                                            -->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                -->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </li>-->
<!--                     </ul>-->
                     <div class="btnbox">
<!--&lt;!&ndash;                         <div class="d-addchapter">&ndash;&gt;-->
<!--&lt;!&ndash;                              <a class="a-addChaper pointer" @click="addchapter"> + 新建大纲 </a>&ndash;&gt;-->
<!--&lt;!&ndash;                         </div>&ndash;&gt;-->
                         <div><a class="btnDefault pointer" @click="newCourses">新建课程</a></div>
                     </div>
                </div>
            </div>
        </div>

         <!--课程暂未新建退出-->
        <el-dialog :visible.sync="isNewComplete" width="600px">
        <div slot="title" class="dialog_header">请注意!</div>
        <div class="confirm_dialog_body">
            <p class="dialog_mess">
            <!--成功span的class为icon_success-->
            <span class="span_icon icon_waring">当前课程暂未新建完成！确定要退出吗？</span>
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <a class="btnDefault" @click="confirm">确 认</a>
            <a class="btnDefault" @click="isNewComplete = false">取 消</a>
        </div>
        </el-dialog>
        <!--点击大纲删除按钮-->
        <el-dialog :visible.sync="isDeleteChapter" width="600px">
        <div slot="title" class="dialog_header">请注意!</div>
        <div class="confirm_dialog_body">
            <p class="dialog_mess">
            <!--成功span的class为icon_success-->
            <span class="span_icon icon_waring">确认删除此章（小节）吗？</span>
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <a class="btnDefault" @click="deleteChapterOrSection">确 认</a>
            <a class="btnDefault" @click="isDeleteChapter = false">取 消</a>
        </div>
        </el-dialog>
        <!--点击新建课程课程按钮前确认弹框-->
        <el-dialog :visible.sync="isNewCourses" width="600px">
        <div slot="title" class="dialog_header"></div>
        <div class="confirm_dialog_body">
            <p class="dialog_mess">
            <!--成功span的class为icon_success-->
            <span class="span_icon icon_success">确认新建名为：{{course.name}}？</span>
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <a class="btnDefault" @click="uploadCourses">确 认</a>
            <a class="btnDefault" @click="isNewCourses = false">取 消</a>
        </div>
        </el-dialog>
           <!--新建课程成功弹框-->
        <el-dialog :visible.sync="isNewCoursesSuccess" width="600px">
        <div slot="title" class="dialog_header"></div>
        <div class="confirm_dialog_body">
            <p class="dialog_mess">
            <!--成功span的class为icon_success-->
            <span >新建成功！请至“备课管理”中查看。</span>
            </p>
        </div>
        <div slot="footer" class="dialog-footer">
            <a class="btnDefault" @click="confirmSuccess">确 认</a>
            
        </div>
        </el-dialog>
    </div>
</template>

<script>
import FileUpload from "vue-upload-component";
import { insertCourse,upload} from "@/API/api";
export default {
    data(){
        return{
            //课程信息
           course:{
               name:'',
               intro:''
           },
           files:[],
           //课程章节
           chapters:[
               {name:'',introduction:'',order:0,sections:[]}
            ],
            uploadUrl:'',
            jwt:'',
            chaptersNum: '',
            sectionNum: '',
            chaptersOrsectio:'',

            isNewComplete:false, 
            isDeleteChapter:false, //控制删除章、节
            isNewCourses:false, //控制新建课程前提示
            isNewCoursesSuccess:false, //课程新建成功

            newSubSection:0, //定义一个变量
            newSubSection_last:0,
            picUrl:''

        }
    },
    components:{
        FileUpload
    },
    methods:{

        //上传前的钩子函数
        inputFilter(newFile, oldFile, prevent) {
            const isLt10M = newFile.size / 1024 / 1024 < 10;
            if (newFile && !oldFile) {
                const extension = newFile.name.substring(
                newFile.name.lastIndexOf(".") + 1
                );
                console.log(extension);
                if (extension != "jpg" && extension != "gif" && extension != "png" && extension !='webp') {
                this.$toast("只能上传图片", 3000);
                return prevent();
                }
                if (!isLt10M) {
                    this.$toast("上传图片的大小不能超过 10M!", 3000);
                    return prevent();
                }
                
                
               

            }

            if (newFile && newFile.error === "" && newFile.file && (!oldFile || newFile.file !== oldFile.file)) {
                // Create a blob field
                // 创建 blob 字段
                newFile.blob = ''
                let URL = (window.URL || window.webkitURL)
                if (URL) {
                newFile.blob = URL.createObjectURL(newFile.file)
                }
                // Thumbnails
                // 缩略图
                newFile.thumb = ''
                if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                newFile.thumb = newFile.blob
                }
            }


        },

     //上传的回调函数，每次上传回调都不一样
    inputFile(newFile, oldFile) {
        let that = this;
         /*
         if ( Boolean(newFile) !== Boolean(oldFile) ||oldFile.error !== newFile.error) {
             if (!this.$refs.upload.active) {
            this.$refs.upload.active = true;
            }
        }
        */
   
        if (newFile && oldFile) {   
            if (newFile && oldFile && !newFile.active && oldFile.active) {
            //console.log('response', newFile.response)
            let response = newFile.response;
            console.log(this.files)
     
            if (newFile.xhr) {
                //  Get the response status code
                console.log("status", newFile.xhr.status);
            }
            }
        }


        },
        //上传图片
        upload(file){
            let that =this
            let obj= new FormData()
            obj.append('type',0)
            obj.append('file',file)
            upload(obj).then(res=>{
                if (res.code==200) {
                    that.picUrl = res.data.name;
                    let obj = {};
                    obj.owner_id = sessionStorage.getItem("userId");
                    obj.name = that.course.name;
                    obj.introduction = that.course.intro
                    obj.pic_url = that.picUrl;
                    obj.chapters = that.chapters;
                    this.$refs.upload.active = true;
                    insertCourse(JSON.stringify(obj)).then((res) => {
                        if (res.code == 200) {
                            // this.$message.success("新建成功");
                        } else {
                            that.$toast(res.message, 3000);
                        }
                    });

                }else {
                    that.$toast(res.message,3000)
                }
            })

        },
         //添加章节
        addchapter(){
           let that = this;
           let tmp = that.chapters.length;
           that.chapters.push({name:'',introduction:'',order:tmp,sections:[]})
        },
        //添加小节
        addSection(num){
            let that = this;
            console.log(that.chapters)
            that.chapters[num].sections.push({name:'',order:num,small_sections:[]});
            let tmp=0
            console.log(num)
            that.newSubSection = that.newSubSection + that.newSubSection_last;
            that.newSubSection_last = 0

        },

        //新建小节
        addSubSection(index,sectionIndex){
            let that = this;
            
            if(sectionIndex+1 != that.chapters[index].sections.length){
                that.newSubSection = that.newSubSection + 1;
            }else{
                that.newSubSection_last = that.newSubSection_last+1
            }
             that.chapters[index].sections[sectionIndex].small_sections.push({name:'',order:index});

        },

        //跳转到课程管理页面
        linkcourse(){
            let that = this;
            that.isNewComplete = true;
           
        },
        confirm(){
          let that = this;
           that.$router.push({path:'/admin/courseManagement'}).catch((err)=>{
                console.log(err)
            })
            that.isNewComplete = true;
        },

        
        //删除
        deleteChapter(num){
            let that = this;
            that.chaptersNum = num;
            that.isDeleteChapter=true;
            that.chaptersOrsectio=1;
        
        },
        //删除小节
        deleteSection(num,num1){
          let that = this;
            that.chaptersNum = num;
            that.sectionNum=num1;
            that.isDeleteChapter=true;
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
             that.isDeleteChapter = false; 
        },
        //新建课程前判断然后显示弹窗
        newCourses(){
            let that = this;
            if(that.course.name ==''){
                return  that.$toast('请输入课程名称',2000)
            }
            if(that.course.intro ==''){
                return  that.$toast('请输入课程详情',2000)
            }
            that.isNewCourses = true;
        },
        //此方法是用来写新建课程的接口的
        uploadCourses(){
             let that = this;
             that.isNewCourses = false;
             
            //上传成功后 isNewCoursesSuccess=true即可显示创建课程成功弹窗
            that.isNewCoursesSuccess=true;

            that.upload(that.files[0].file)

        },
        //新建成功后跳转课程管理页面
        confirmSuccess(){
          let that = this;
           that.$router.push({path:'/admin/courseManagement'}).catch((err)=>{
                console.log(err)
            })
         
        },
    }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/admin.less);

</style>