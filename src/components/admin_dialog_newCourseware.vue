<template>
  <div>
    <!--新增课件选择-->
    <el-dialog
      class="dialog_pagination add_local_courseware"
      :visible.sync="isnewFilter"
      width="600px"
    
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
                            :props="{ value: 'id', label: 'name', children: 'cates' }"
                            @change="handleChange"
                            clearable
                    >
                    </el-cascader>
              </el-form-item>
            </el-form>
             <el-form ref="form"  label-width="120px">
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>选择文件：</span >
                      <ul class="fileList_name">
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
                    <a class="a_upload pointer"><span>选择需要添加的课件</span></a>
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
  </div>
</template>
<script>
import FileUpload from "vue-upload-component";
import toastVue from "./toast/toast.vue";
import { findParentCategory,findChildCategory,upload,addCourseware} from "@/API/api";
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
      category: [], //实验所属分类
      categoryOptions: [],
      extension:'',
      size:'',
      time:''
    };
  },
  components: {
    FileUpload,
  },
  props: {},
  created() {
    this.cate = this.options[0].value; //默认选中内置课件
    this.type = this.typeList[0].value; //课件类型默认选中全部
  },
  methods: {

    //自定义分类
    selectType(val){
      let that = this;
      that.i_customClass = {};
      that.findChildCategory(val);

    },

    //获取一级分类
    findParentCategory(){
      let that = this
      findParentCategory().then(res=> {
        if(res.code==200){
          that.options = res.data;
          that.categoryOptions = res.data;

        }else{
          that.$toast(res.message,3000)
        }
      })
    },
    //根据一级分类id查询二级分类
    findChildCategory(val){
      let that = this;
      let obj = {};
      obj.parent_category_id = val.id;
      findChildCategory(obj).then((res) => {
        // alert(JSON.stringify(res));
        if (res.code == 200) {
          that.options1 = res.data;
          // if (that.options1.length > 0) {
          //   that.i_customClass = that.options1[0];
          // }
        } else {
          this.$toast(res.message, 2000);
        }
      });

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
      that.isnewFilter= false
      console.log("111")
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
        if (extension != "pdf" && extension != "mp4") {
          this.$toast("只能上传后缀是pdf或mp4的文件", 3000);
          return prevent();
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
          alert(this.files)

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
      alert(that.files[0].file.name)
      upload(obj).then(res=>{
        if (res.code==200) {
          that.picUrl = res.data.name;
          that.size = res.data.size;
          that.time = res.data.time;
          let obj = {};
          obj.name = that.files[0].file.name;
          obj.type = 0;
          obj.kind = that.extension == 'pdf' ?1 : 0
          obj.url = that.picUrl;
          obj.duration = that.time;
          obj.size = that.size;
          obj.category_id = that.addCategoryID;
          this.$refs.upload.active = true;
          addCourseware(JSON.stringify(obj)).then((res) => {
            if (res.code == 200) {
              alert("新建成功");
              window.location.reload();
            } else {
              that.$toast(res.message, 3000);
            }
          });

        }else {
          that.$toast(res.message,3000)
        }
      })

    },


  },
};
</script>

<style lang="less" scoped>
@import url(../assets/less/admin.less);
.fileList_name{padding: 0 30px;}
.classifyBox{width:500px;margin: 0 auto;;}
.confirm_dialog_body .upload_person{text-align: left;}
</style>
