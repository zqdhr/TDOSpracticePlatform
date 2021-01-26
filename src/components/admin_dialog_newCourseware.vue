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
                    @change="handleChange" clearable>
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
      customType: "",
      isnewFilter: false,
      isnewFilterType: 0, //课件库选择 1代表本地课件库  2代表本地上传

      jwt: "",
      uploadUrl: "http://192.168.1.167:8111/upload",
      files: [],
       category:[],//实验所属分类
      categoryOptions: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }]
      }],

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
    //点击新建课件
    click_new() {
      let that = this;
      that.files = [];
      that.isnewFilterType = 0;
      that.isnewFilter = true;
      that.chooseList = [];
    },
  
    //选择分类
    selectCate(val) {
      console.log(val);
    },

    //选择课件类型
    selectType(val) {
      console.log(val);
    },
    //本地上传确认上传
    confirmLocalUpload() {
      let that = this;
      that.isnewFilter= false
      if (!this.$refs.upload.active) {
        this.$refs.upload.active = true;
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
      console.log(val)
    },
  
   
    //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );
        console.log(extension);
        // if (extension != "xlsx" && extension != "xls") {
        //   this.$toast("只能上传后缀是.xlsx或xls的文件", 3000);
        //   return prevent();
        // }
      }
    },
    //上传的回调函数，每次上传回调都不一样
    inputFile(newFile, oldFile) {
      let that = this;
      console.log("123");

      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      )

      if (newFile && oldFile) {
        //add
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          //console.log('response', newFile.response)
          let response = newFile.response;
          console.log(this.files);
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
  },
};
</script>

<style lang="less" scoped>
@import url(../assets/less/admin.less);
.fileList_name{padding: 0 30px;}
.classifyBox{width:500px;margin: 0 auto;;}
.confirm_dialog_body .upload_person{text-align: left;}
</style>
