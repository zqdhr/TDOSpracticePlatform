<template>
    <div>
    <!--新增课件选择-->
    <el-dialog class="dialog_pagination "  :visible.sync="isnewFilter" :width="isnewFilterType==1?'1100px':'600px'" :class="{'newCourseware_dialog':isnewFilterType==0}">
        <template v-if="isnewFilterType==0">
            <div slot="title" class="dialog_header">请选择新增课件模式</div>
            <div class="confirm_dialog_body">
               
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="choseLibray">课件库选择</a>
                <a class="btnDefault" @click="isnewFilterType=2;">本地上传</a>
            </div>
      </template>
      <!--课件库选择-->
      <template v-if="isnewFilterType==1">
           <div slot="title" class="dialog_header">课件库选择</div>
           <div class="pageTab clearfix nopaddingBottom">
                <div class="fl">
                    
                    <div class="sel-box">               
                        <el-select v-model="customType" placeholder="自定义分类" @change="selectCustomType">
                            <el-option
                            v-for="item in customClass"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>               
                    </div>

                    <div class="sel-box">               
                        <el-select v-model="cate" placeholder="请选择课件分类" @change="selectCate">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>               
                    </div>
                    <div class="sel-box">               
                        <el-select v-model="type" placeholder="请选择课件类型" @click="selectType">
                            <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>               
                    </div>
                </div>
                
                <div class="fr">   
                <div class="d-serach"> 
                    <input :placeholder="inplaceholder" type="text" autocomplete="off" />
                    <a class="searchBtn pointer"></a>
                </div>
                </div>

            </div>
           <div class="list_box">
               <div class="div_checked">
                   <span v-for="(item,index) in chooseList" :key="index">
                       {{item.name}}
                       <a class="icon icon_close pointer"/>
                   </span>

                   
               </div>
                <ul class="list_ul coursewareLibrary_ul  clearfix">
                    <li v-for="(item,index) in all_experimentList" :key="index">
                        <div class="info padt20 boxShadow">
                            <a class="icon icon_radio pointer" :class="{'icon_radio_h':item.checked}" @click="click_checked(item,index,item.checked)"></a>
                            <div class="icon-box">
                                <span class="c_icon" :class="{'icon_video':item.type==0,'icon_pdf':item.type==1}"></span>
                            </div>
                            <p class="p-text textline1 p-name">{{item.name}}</p>
                            <div class="line"></div>
                            <p class="p-text textline1">课件大小：{{item.size}}</p>
                            <p class="p-text textline1">视频时长：{{item.duration}}</p>
                        </div>
                    </li>
                </ul>
            </div>
           <div slot="footer" class="clearfix">
               <a class="btnDefault fl" @click="confirmChoose">确认选择</a>
               
                <div class="tab-pagination fr">
                    <el-pagination
                        background
                        :current-page="curPage"
                        :page-size="perPage"
                        @current-change="handleCurrentChange1"
                        layout="prev, pager, next,jumper"
                        :total="total"
                    >
                    </el-pagination>
                </div>
           </div>
      </template>
       <!--本地上传-->
      <template v-if="isnewFilterType==2">
        <div slot="title" class="dialog_header">本地上传</div>
        <div class="confirm_dialog_body" style="padding:60px 0 40px 0">
            <ul class="fileList_name">
                <li v-for="(file) in files" :key="file.id">
                <span>{{file.name}}</span>          
                </li>
            </ul>
            <div class="upload_person">
                <file-upload
                    style="overflow: visible"
                    :maximum="1"
                    :multiple="true"
                    ref="upload"
                    v-model="files"
                    extensions="xlsx,xls"
                    :post-action="uploadUrl"
                    :auto-upload="false"
                    @input-file="inputFile"
                    @input-filter="inputFilter"
                    name="excel_file"
                    :headers="{ Authorization: jwt }"
                >
                    <a class="a_upload pointer"><span>选择需要添加的课件</span></a>
                </file-upload>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <a class="btnDefault" @click="confirmLocalUpload">确认上传</a>
        </div>
      </template>
    </el-dialog>
</div>
</template>
<script>
import FileUpload from "vue-upload-component";
export default {
    data(){
        return{
          inplaceholder:'请输入课件名',
            options:[
                {value: '1',label: '内置课件'},{value: '2',label: '教师上传'}
            ],
            typeList:[
                {value: '1',label: '全部'},{value: '2',label: '文档'},{value: '3',label: '视频'}
            ],
              //已有的课件库
            all_experimentList:[
               {id:'522dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'521dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'524dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'526dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'528dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'529dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:0},
               {id:'567dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
               {id:'52dddz',name:'xxxxx.mp4',size:'2.3G',duration:'00:16:34',type:1},
            ],
             total:100,
            perPage:8, //8个实验一页
            curPage:1,//设备列表
            cate:'内置课件',//课件分类默认内置课件
            type:'全部',//课件类型默认全部


            customClass:[ {value: '1',label: '场景篇'},{value: '2',label: '原理篇'}],//自定义分类
            customType:'',
            isnewFilter:false,
            isnewFilterType:0, //课件库选择 1代表本地课件库  2代表本地上传
       
            jwt:'',
            uploadUrl:'',
            files:[],
            chooseList:[],//课件被选择列表
        }
    },
   components:{
      FileUpload
    },
    props:{
      
    },
     created(){
        this.cate = this.options[0].value;//默认选中内置课件
        this.type = this.typeList[0].value;//课件类型默认选中全部
    },
    methods:{
   //点击新建课件
        click_new(){
           let that = this;
           that.files = [];
           that.isnewFilterType = 0
           that.isnewFilter=true;
           that.chooseList = [];
        },
        //点击课件库选择
        choseLibray(){
            let that = this;
             that.isnewFilterType = 1
            that.array_addChecked(that.all_experimentList)
        },
         //选择分类
        selectCate(val){
            console.log(val)
        },

        //选择课件类型
            selectType(val){
            console.log(val)
        },
         //本地上传确认上传
        confirmLocalUpload(){
            let that = this;
           
            that.$emit('hidedialog')
        },
        //课件库选择确认选择
        confirmChoose(){
            let that = this;
            that.$emit('hidedialog')
        },
        //弹窗关闭
        closeDialog(){
            let that = this;
            console.log('ok')
            //that.$emit('hidedialog')
        },
         //弹窗分页
        handleCurrentChange1(val) {
        console.log(`当前页: ${val}`);
        },
          
        //弹窗自定义分类
        selectCustomType(val){
          console.log('选择自定义分类');
        },
        //数组新增checked元素
        array_addChecked(array){
            let that = this;
            for(var i=0;i<array.length;i++){
                that.$set(array[i],'checked',false)
            }
        },
       
        //课件选择
        click_checked(obj,index,checked){
            let that = this;
           if (!checked) {
            if (!(that.chooseList.indexOf(obj.id) != -1)) {
            that.chooseList.push(obj);
            }
            that.$set(that.all_experimentList[index], "checked", true);
            
            } else {
                that.$set(that.all_experimentList[index], "checked", false);
                for(var i=0;i<that.chooseList.length;i++){
                    if(obj.id==that.chooseList[i].id){
                       that.chooseList.splice(i, 1);
                    }
                }
                
            }
        },
         //上传前的钩子函数
        inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
            const extension = newFile.name.substring(
            newFile.name.lastIndexOf(".") + 1
            );
            console.log(extension);
            if (extension != "xlsx" && extension != "xls") {
            this.$toast("只能上传后缀是.xlsx或xls的文件", 3000);
            return prevent();
            }
        }
        },
            //上传的回调函数，每次上传回调都不一样
        inputFile(newFile, oldFile) {
        let that = this;
        console.log('123')
        
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
        }
    }
}
</script>

<style lang="less" scoped>
@import url(../assets/less/admin.less);

</style>
