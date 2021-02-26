<template>
  <div>
    <!--新增课件选择-->
    <el-dialog
      class="dialog_pagination add_local_courseware"
      :visible.sync="isnewFilter"
      width="500px"

    >
      <!--本地上传-->
      <template >
        <div slot="title" class="dialog_header">本地上传</div>
        <div class="confirm_dialog_body" style="padding: 40px 0 20px 0">
          <div class="classifyBox">
            <el-form ref="form"  label-width="120px">
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>所属分类：</span >
                <el-cascader
                        v-model="category"
                        :options="categoryOptions"
                        :props="{value: 'id', label: 'name',children: 'cates'}"
                        @change="handleChange" clearable>
                </el-cascader>
              </el-form-item>
            </el-form>
             <el-form ref="form"  label-width="120px">
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>选择文件：</span >
                      <ul class="fileList_name" style="padding:0px;width:304px">
                  <li v-for="file in files" :key="file.id">
                    <span>{{ file.name }}</span>
                  </li>
                </ul>
                <div class="upload_person">
                  <file-upload
                    style="overflow: visible"
                    :maximum="1"
                    :multiple="true"
                    ref="upload"
                    v-model="files"
                    extensions=""
                    :post-action="uploadUrl"
                    :auto-upload="false"
                    @input-file="inputFile"
                    @input-filter="inputFilter"
                    name="excel_file"
                    :headers="{ 'Content-Type':'multipart/form-data'}"
                    :data="{file: files.name}"
                  >
                    <a class="a_upload pointer" style="padding:0px 55px"><span>选择需要添加的课件</span></a>
                  </file-upload>
                </div>
              </el-form-item>
            </el-form>
          </div>

        </div>
        <div slot="footer" class="dialog-footer">
          <a class="btnDefault pointer" @click="confirmLocalUpload">确认上传</a>
        </div>
      </template>
    </el-dialog>
    <loading v-if="loading" @hideloading="hideloading" mess='文件正在上传,请稍候...'></loading>>
  </div>
</template>
<script>
import FileUpload from "vue-upload-component";
import toastVue from "./toast/toast.vue";
import { findParentCategory,findChildCategory,upload,addCourseware} from "@/API/api";
import loading from '@/components/uploadLoading.vue'
export default {

  data() {
    return {
      inplaceholder: "请输入课件名",
      options: [
        { value: "1", label: "内置课件" },
        { value: "2", label: "教师上传" },
      ],
      typeList: [
        { value: "1", label: "全部" },
        { value: "2", label: "文档" },
        { value: "3", label: "视频" },
      ],


      total: 100,
      perPage: 8, //8个实验一页
      curPage: 1, //设备列表
      cate: "内置课件", //课件分类默认内置课件
      type: "全部", //课件类型默认全部
      category:[],//实验所属分类
      categoryOptions: [],
      customClass: [
        { value: "1", label: "场景篇" },
        { value: "2", label: "原理篇" },
      ], //自定义分类
      picUrl:'',
      customType: "",
      isnewFilter: false,
      isnewFilterType: 0, //课件库选择 1代表本地课件库  2代表本地上传

      jwt: "",
      uploadUrl: "",
      files: [],
      extension:'',
      size:'',
      time:'',
      addCategoryID:'',//自定义分类ID
      loading:false,//课件库是否在上传
      upload_falg:0, //文件是否上传 0可以上传 1文件格式不对  2pdf文件太大 3视频文件太大
    };
  },
  components: {
    FileUpload,loading
  },
  props: {},
  created() {
    this.cate = this.options[0].value; //默认选中内置课件
    this.type = this.typeList[0].value; //课件类型默认选中全部
    this.findParentCategory();
  },
  methods: {

    //自定义分类
    selectType(val){
      let that = this;
      that.i_customClass = {};
      that.findChildCategory(val);

    },

    //自定义父级分类
    findParentCategory() {
      let that = this;
      findParentCategory().then(res => {
        if (res.code == 200) {
          that.categoryOptions = res.data;
          for (let index = 0; index < that.categoryOptions.length; index++) {
            that.findChildCategory(that.categoryOptions[index].id)

          }
        } else {
          this.$toast(res.message, 2000)
        }
      })
    },
    //根据一级分类id查询二级分类
    findChildCategory(cateId){
      let that = this
      let obj={}
      obj.parent_category_id = cateId
      findChildCategory(obj).then(res=> {
        if(res.code==200){
          let catesons = res.data
          if(catesons.length>0){
            for(let i = 0; i <  that.categoryOptions.length; i++) {
              if(that.categoryOptions[i].id === cateId) {
                that.$set(that.categoryOptions[i], 'cates', catesons) // right
                break;
              }
            }
          }
        }else{
          that.$toast(res.message,3000)
        }
      })

    },

    //点击新建课件
    click_new() {
      let that = this;
      that.files = [];
      that.isnewFilterType = 0;
      that.isnewFilter = true;
      that.chooseList = [];
      this.findParentCategory()
    },

    //选择分类
    selectCate(val) {
      console.log(val);
    },

    //本地上传确认上传
    confirmLocalUpload() {
      let that = this;
      //
      if(that.addCategoryID == '' || that.addCategoryID == null ){
        this.$toast("请选择自定义分类", 3000);
        return;
      }

      if(that.files.length==0){
        this.$toast("请先上传课件", 3000);
        return;
      }


      if (!this.$refs.upload.active) {
        that.upload(that.files[0].file)
      }
    },

    //弹窗关闭
    closeDialog() {
      let that = this;
      console.log("ok");
      //that.$emit('hidedialog')
    },
    //弹窗分页
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`);
    },

    //弹窗自定义分类
    selectCustomType(val) {
      console.log("选择自定义分类");
    },
    //数组新增checked元素

    handleChange(val){
      let that = this;
      //  console.log(value.length==1?value[0]:value[1]);
      that.addCategoryItem = val;
      that.addCategoryID = val.length == 1 ? val[0] : val[1];

    },


    //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      let that = this;
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );
        that.extension = extension;
        const isLt100M = newFile.size / 1024 / 1024 < 100;
        const isLt500M = newFile.size / 1024 / 1024 < 500;

        if (extension != "pdf" && extension != "mp4") {
          this.$toast("只能上传后缀是pdf或mp4的文件", 3000);
          this.upload_falg = 1;
          return
        }
        if(extension == 'pdf' && !isLt100M){
          this.$toast("上传的pdf不能大于100M", 3000);
          this.upload_falg = 2;
          return
        }
        if(extension == 'mp4' && !isLt500M){
             this.$toast("上传的视频不能大于500M", 3000);
             this.upload_falg = 3;
             return
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
          //alert(this.files)

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
      if(that.addCategoryID == '' || that.addCategoryID == null ){
        this.$toast("请选择自定义分类", 3000);
        return;
      }
      let obj= new FormData()
      //alert("asddd"+that.extension)
      let type = that.extension == 'pdf'?2:1
      //alert("asddd"+type)
      obj.append('type',type)
      obj.append('file',file)

      //alert(that.files[0].file.name)
      if(that.upload_falg==1){
        return this.$toast("只能上传后缀是pdf或mp4的文件", 3000);
      }

      if(that.upload_falg==2){
        return   this.$toast("上传的pdf不能大于100M", 3000);
      }
      if(that.upload_falg==3){
        return this.$toast("上传的视频不能大于500M", 3000);
      }

      if(that.upload_falg==0){
          upload(obj).then(res=>{
            if (res.code==200) {
              that.loading = false;
              that.picUrl = res.data.name;
              that.size = res.data.size;
              that.time = res.data.time;
              let obj = {};
              obj.name = that.files[0].file.name;
              obj.type = 0;
              obj.kind = that.extension == 'pdf'?1:0;
              obj.url = that.picUrl;
              obj.duration = that.time;
              obj.size = that.size;
              obj.category_id = that.addCategoryID;
              this.$refs.upload.active = true;
              addCourseware(JSON.stringify(obj)).then((res) => {
                if (res.code == 200) {
                  that.isnewFilter =false ; //上传弹窗消失
                  that.loading = true;
                  that.$emit('getCourseAll')
                } else {
                  that.$toast(res.message, 3000);
                }
              });

            }else {
              that.$toast(res.message,3000)
            }
          }).catch(res => {console.log(JSON.stringify(res))})
      }





    },

    //文件上传成功隐藏loading
    hideloading(){
      let that = this;
      that.loading = false
    }


  },
};
</script>

<style lang="less" scoped>
@import url(../assets/less/admin.less);
.fileList_name{padding: 0 30px;}
.classifyBox{width:500px;margin: 0 auto;;}
.confirm_dialog_body .upload_person{text-align: left;}
.fileList_name li {text-align:center; padding-bottom:12px; color: #444; font-size:18px;}
</style>
