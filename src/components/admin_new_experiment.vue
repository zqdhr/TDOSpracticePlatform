<template>
  <div>
    <el-dialog
      class="dialog_pagination admin_dialog_newExperiment"
      :visible.sync="isNew_experiment"
      width="1100px"
    >
      <div slot="title" class="dialog_header">新增实验</div>
      <div class="newdialog_body">
        <div class="new_nav">
          <a class="pointer" :class="{ active: curIndex == 1 }"
            ><span class="num">1</span> 基本资料</a
          >
          <a class="pointer" :class="{ active: curIndex == 2 }"
            ><span class="num">2</span> 选择虚拟机</a
          >
          <a class="pointer" :class="{ active: curIndex == 3 }"
            ><span class="num">3</span> 实验步骤</a
          >
          <a class="pointer" :class="{ active: curIndex == 4 }"
            ><span class="num">4</span> 完成发布</a
          >
        </div>
        <!--基本资料-->
        <div class="baseInfo" v-if="curIndex == 1">
          <div class="fromBox">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验名称：</span >
                <el-input v-model="form.name" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验时长：</span >
                <el-input
                  class="el-input-duration"
                  v-model="form.duration"
                ></el-input>
                <span> 小时</span>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验描述：</span >
                <el-input
                  v-model="form.introduction"
                  type="textarea"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验建议：</span >
                <el-input v-model="form.advice" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验报告：</span >
                <el-input v-model="form.report" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验任务：</span >
                <el-input v-model="form.task" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label" ><span>*</span>实验封面：</span >
                <div class="upload_box clearfix">
                  <div class="left_pic">
                    <div class="picbox">
                      <div class="" v-for="(file, index) in files" :key="index">
                        <img
                          class="td-image-thumb"
                          v-if="file.thumb"
                          :src="file.thumb"
                        />
                      </div>
                    </div>
                    <p class="mess">
                      （上传图片比例为360x200的，支持png.jpg.jpeg）
                    </p>
                  </div>
                  <div class="bupload_btn_box">
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
                      <a class="btnDefault a_upload">
                        <span>上传图片</span>
                      </a>
                    </file-upload>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="btnBox">
            <a class="btnDefault pointer" @click="confirm_baseInfo">保存</a>
          </div>
        </div>
        <!--选择虚拟机-->
        <div class="virtualMachineList" v-if="curIndex == 2">
          <div class="pageTab clearfix">
            <div class="fl">
              <div class="sel-box">
                <el-select
                  v-model="type"
                  placeholder="镜像类型"
                  @change="selectType"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="fr">
              <div class="d-serach">
                <input
                  :placeholder="inplaceholder"
                  type="text"
                  autocomplete="off"
                />
                <a class="searchBtn pointer"></a>
              </div>
            </div>
          </div>
          <div class="imageReposity_box">
            <el-table
              class="center-tab admin_dialog_experlist"
              :data="Imagelibraries"
              @selection-change="handleSelectionChange"
              style="width: 100%"
              
            >
              <el-table-column type="selection" width="55"> </el-table-column>

              <el-table-column prop="name" label="名称" width="240">
              </el-table-column>
              <el-table-column prop="type" label="镜像类型">
                <template slot-scope="scope">
                  <span>{{ scope.row.type == 0 ? "KVM" : "Docker" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="size" label="容量"> </el-table-column>
              <el-table-column prop="Introduction" label="简介" width="280">
              </el-table-column>
              <el-table-column prop="applicationNumber" label="被引用次数">
              </el-table-column>
            </el-table>
          </div>
          <div slot="footer">
            <div class="footer_box clearfix">
              <a class="btnDefault fl pointer" @click="curIndex=3">确认选择</a>

              <div class="tab-pagination fr">
                <el-pagination
                  background
                  :current-page="curPage"
                  :page-size="perPage"
                  @current-change="handleCurrentChange"
                  layout="prev, pager, next,jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>

        <!--steps-->
        <div class="steps" v-if="curIndex==3">
            <div class="steps_main">
                <el-form ref="form" label-width="80px">
                <el-form-item v-for="(item,index) in steps" :key="index">
                    <span slot="label" class="s-label">步骤{{index+1}}：</span>
                    <el-input v-model="item.text" type="textarea"></el-input>
                    <a class="adel pointer"></a>
                </el-form-item>
                </el-form>
            </div>
            <div class="btnbox">
                <a class="btnDefault pointer" @click="newStep">新建步骤</a>
                <a class="btnDefault pointer" @click="confirmStep">步骤确认</a>
            </div>
        </div>

        <!--complete-->
        <div class="steps pp_complete" v-if="curIndex==4">
             <div class="confirm_info">
                 <div class="d-confirm">
                    <div class="d-cel clearfix">
                        <label>实验名称：</label>
                        <div>模拟生成一条真实的链</div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验时长：</label>
                        <div>1.5小时</div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验描述：</label>
                        <div>文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本 文本</div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验建议：</label>
                        <div>文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本 文本</div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验报告：</label>
                        <div>文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本 文本</div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验任务：</label>
                        <div>文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本文本 文本</div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验封面：</label>
                        <div>
                            <div class="d-cover"><img src="../assets/pic/course.png"/></div>
                        </div>
                    </div>
                    <div class="d-cel clearfix">
                        <label>实验步骤：</label>
                        <div class="step-div">
                            <p>步骤1：好好做实验</p>
                            <p>步骤2：好好做实验</p>
                        </div>
                    </div>
                 </div>
             </div>
             <div class="btnbox">
                <a class="btnDefault pointer" @click="confirmNewExperiment">确认新增</a>
            </div>
        </div>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import FileUpload from "vue-upload-component";
export default {
  data() {
    return {
      curIndex:1,
      form: {
        name: "",
        duration: "",
        introduction: "",
        advice: "",
        report: "",
        task: "",
        cover: "",
      },
      inplaceholder: "请输入实验名称",
      isNew_experiment: false,
      uploadUrl: "",
      jwt: "",
      files: [],
      options: [
        { value: "0", label: "KVM" },
        { value: "1", label: "Docker" },
      ],
      type: "", //镜像类型
      //新增镜像
      Imagelibraries: [
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 1, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 1, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 1, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
        { id: "ddddoogk", name: "c7_k_2c4g50g_bigdate_linux", type: 0, size: "2.5GB", Introduction: "简介文本简介文本简介文本简介文本 简介文本简介文本简介文本", applicationNumber: "6", },
      ],
      total: 100,
      perPage: 8,
      curPage: 1,
      steps:[{text:''}]//实验步骤
    };
  },
  components: {
    FileUpload,
  },
  methods: {
    //选择实验类型
    selectType(val) {
      console.log(val);
    },
    click_new() {
      let that = this;
      that.isNew_experiment = true;
    },
    /*tab选择 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      const isLt10M = newFile.size / 1024 / 1024 < 10;
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );
        console.log(extension);
        if (
          extension != "jpg" &&
          extension != "gif" &&
          extension != "png" &&
          extension != "webp"
        ) {
          this.$toast("只能上传图片", 3000);
          return prevent();
        }
        if (!isLt10M) {
          this.$toast("上传图片的大小不能超过 10M!", 3000);
          return prevent();
        }
      }

      if (
        newFile &&
        newFile.error === "" &&
        newFile.file &&
        (!oldFile || newFile.file !== oldFile.file)
      ) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
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
    //基本资料确认
    confirm_baseInfo() {
      let that = this;
      that.curIndex = 2;
    },
    //弹窗分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    //点击新建步骤
    newStep(){
        let that = this;
        that.steps.push({text:''})
    },

    //点击步骤确认
    confirmStep(){
        let that = this
        that.curIndex = 4;
    },
    //确认新增实验
    confirmNewExperiment(){
        let that = this;
        that.isNew_experiment = false
        console.log(that.form.name)
    }

    
  },
};
</script>
<style lang="less" scoped>
@import url(../assets/less/admin.less);
.newdialog_body {
  .new_nav {
    padding: 20px 0;
    a {
      font-size: 18px; color: @tabcolor; display: inline-block; width: 22%; text-align: center; margin: 0 1.5%; background: @dialog_nav; padding: 10px 0; line-height: 22px;
    }
    .num {
      min-width: 20px; height: 20px; line-height: 20px; border: 1px solid @tabcolor; display: inline-block; vertical-align: top;
      .borderRadius(50%,50%,50%,50%);
    }
    a.active {
      color: @fontfff; background: @basecolor;
      .num { border-color: @fontfff; }
    }
  }
}
.baseInfo {
  min-height: 600px;
  .btnBox {
    padding-bottom: 20px; text-align: center;
  }
  .left_pic {
    width: 320px; display: inline-block;
  }
  .s-label {
    font-size: 18px; color: @tabcolor;
    > span { color: #d82a2a; }
  }
  .fromBox {
    width: 600px; margin: 0 auto; }
  .picbox {
    width: 320px; height: 160px; border: 1px solid @border;
    .borderRadius(5px,5px,5px,5px);
    > div { position: relative; width: 320px; height: 160px; overflow: hidden; }
    img { width: 320px; position:absolute;left:50%;top:50%;
           position:absolute;left:50%;top:50%;
        transform:translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%);	
        -moz-transform:translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        -o-transform:translate(-50%,-50%);
    }
  }
  .mess { color: @hnavcolor; line-height: normal; }
  .bupload_btn_box { display: inline-block; vertical-align: bottom; margin-bottom: 40px; margin-left: 20px; }
}
.virtualMachineList {
  min-height: 600px;
  .footer_box {
    margin: 0 20px; padding: 20px 0;
    .tab-pagination { margin-top: 10px; }
  }
  .dialog_experlist th { background: @dialog_nav; }
  .imageReposity_box { margin: 0 20px; }
}

/**steps */
.steps{
    min-height: 500px;
    .steps_main{margin: 0 160px;}
     .s-label {
        font-size: 18px; color: @tabcolor;
        > span { color: #d82a2a; }
    }
    .adel{width:20px;height:20px;display:block;background: url(../assets/img/icon_del.png) center no-repeat; position:absolute; right:0px;top:50%;margin-top: -10px;}
    .btnbox{
        text-align:center; padding-bottom: 40px;
        a.btnDefault{width:160px;margin: 0 20px;}
    }
}
/*pp_complete */
.pp_complete{ 
    .btnbox{padding-top:30px;}
    .confirm_info{min-height:300px; margin: 0 60px;border:1px solid @border; font-size: 18px; color: @tabcolor; padding:20px 0;}
    .d-confirm{width:70%;margin: 0 auto;}
    label{float: left;}
    .d-cel{padding:4px 0}
    .d-cel >div{padding-left:100px;}
    .d-cover{width:320px;height: 160px;border:1px solid @border;.borderRadius(5px,5px,5px,5px); overflow: hidden; position: relative;}
    img{
        position:absolute;left:50%;top:50%; max-width: 100%;
        transform:translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%);	
        -moz-transform:translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        -o-transform:translate(-50%,-50%);
    }
    .step-div p{padding-bottom: 3px;}
}
</style>