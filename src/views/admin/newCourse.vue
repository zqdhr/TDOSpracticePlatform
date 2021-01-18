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
                <div class="col_title">
                    02编辑课程大纲
                </div>
                <div class="addChapter">
                     <ul class="chaper_ul">
                        <li v-for="(item,index) in chapters" :key="index">
                            <div class="din">
                                <input type="text" maxlength="50" class="boxsizing" v-model="item.name" placeholder="请输入课程大纲"/>
                                <a class="pointer btn_add" @click="addSection(index)"></a>
                                <a class="pointer btn_del" @click="deleteChapter(index)"></a>
                            </div>
                            <div class="sectionBox " :class="{'sectionBox_first':index1==0}" v-for="(iitem,index1) in item.section" :key="index1">
                                <div class="din">
                                    <input class="input_section boxsizing" type="text" maxlength="50" v-model="iitem.name" placeholder="请输入课程小节名称"/>
                                    <a class="pointer btn_del" @click="deleteSection(index,index1)"></a>
                                    <div class="line1"></div>
                                    <div class="line2"></div>
                                </div>
                               
                            </div>
                        </li>
                     </ul>
                     <div class="btnbox">
                         <div class="d-addchapter">
                              <a class="a-addChaper pointer" @click="addchapter"> + 新建大纲 </a>
                         </div>
                         <div><a class="btnDefault pointer">新建课程</a></div>
                     </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FileUpload from "vue-upload-component";
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
               {name:'',section:[]}
            ],
            uploadUrl:'',
            jwt:'',
           

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
       
        if ( Boolean(newFile) !== Boolean(oldFile) ||oldFile.error !== newFile.error) {
            if (!this.$refs.upload.active) {
            this.$refs.upload.active = true;
            }
        }
   
        if (newFile && oldFile) {
            //add
            if (newFile && oldFile && !newFile.active && oldFile.active) {
            //console.log('response', newFile.response)
            let response = newFile.response;
            console.log(this.files)
            if (response.code == 200) {
                this.$message.success("文件上传成功");
                that.searchUser(2, "", "", 1, 10);
                
            } else {
                this.$message.error("文件上传失败");
            }
            if (newFile.xhr) {
                //  Get the response status code
                console.log("status", newFile.xhr.status);
            }
            }
        }
        if (newFile && oldFile) {
            // update
            console.log("update", newFile);
        }
        if (!newFile && oldFile) {
            // remove
            console.log("remove", oldFile);
        }
        },
        //添加小节
        addSection(num){
            let that = this;
            that.chapters[0].section.push({name:''});
            console.log(that.chapters);

        },

        //跳转到课程管理页面
        linkcourse(){
            let that = this;
            that.$router.push({path:'/admin/courseManagement'}).catch((err)=>{
                console.log(err)
            })
        },
        //添加章节
        addchapter(){
           let that = this;
           that.chapters.push({name:''})
        },
        //删除
        deleteChapter(num){
            let that = this;
            that.chapters.splice(num,1)
        },
        //删除小节
        deleteSection(num,num1){
          let that = this;
          that.chapters[num].section.splice(num1,1)
        }
    }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/admin.less);

</style>