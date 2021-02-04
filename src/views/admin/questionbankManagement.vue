<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
          <div class="sel-box">
            <el-select
              v-model="customClass"
              value-key="id"
              placeholder="自定义分类"
              @change="selectType"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="sel-box" v-if="options1.length > 0">
            <el-select
              v-model="i_customClass"
              value-key="id"
              placeholder="自定义分类"
              @change="selectType1"
            >
              <el-option
                v-for="item in options1"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>

          <div class="sel-box">
            <el-select
              v-model="quest_type"
              placeholder="题目类型"
              @change="selectQuestType"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn" @click="delList">删除题目</a>
          <a
            class="btnDefault pointer abtn"
            @click="
              isNew = true;
              files = [];
              isNewType = 0;
            "
            >新增题目</a
          >

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

      <div class="table_box table_box_questionBank">
        <el-table
          class="center-tab tab-userList"
          :data="questionList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>
          <el-table-column prop="serial_number" label="题目序号" width="150">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * perPage + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="题目详情">
            <template slot-scope="scope">
              <div class="">
                <el-tooltip
                  popper-class="quest_tooltip"
                  ref="tooltip"
                  :content="scope.row.content"
                  placement="top"
                  effect="light"
                >
                  <span class="s-text textline1 pointer">{{
                    scope.row.content
                  }}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="answer" label="题目答案">
            <template slot-scope="scope">
              <div class="">
                <!--根据题目类型，确定答案是否需要放上去提示完全-->
                <el-tooltip
                  popper-class="quest_tooltip"
                  ref="tooltip"
                  :content="scope.row.choice"
                  placement="top"
                  effect="light"
                  v-if="quest_type == 0"
                  show-overflow-tooltip="false"
                >
                  <span class="s-text textline1 pointer">{{
                    scope.row.answer
                  }}</span>
                </el-tooltip>

                <el-tooltip
                  popper-class="quest_tooltip"
                  ref="tooltip"
                  :content="scope.row.answer"
                  placement="top"
                  effect="light"
                  v-if="quest_type != 0"
                  show-overflow-tooltip="false"
                >
                  <span class="s-text textline1 pointer">{{
                    scope.row.answer
                  }}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="pictureAddress" label="题目图片">
            <template slot-scope="scope">
              <div class="" v-if="scope.row.picUrl.length > 0">
                <span
                  class="s-text textline1 pointer"
                  @click="getPreview(scope.row.picUrl)"
                  >点击查看</span
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tab-pagination">
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
    <el-image-viewer
      v-if="showViewer"
      :on-close="showViewerClose"
      :url-list="[guidePic]"
    ></el-image-viewer>

    <!--删除题目-->
    <el-dialog :visible.sync="isDelete" width="600px">
      <div slot="title" class="dialog_header">请注意!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring"
            >确定要删除当前选中的题目吗？</span
          >
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDelete">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>

    <!--新增题目-->
    <el-dialog
      class="dialog_pagination"
      :visible.sync="isNew"
      width="600px"
      :class="{ newCourseware_dialog: isNewType == 0 }"
    >
      <template v-if="isNewType == 0">
        <div slot="title" class="dialog_header">新增题目</div>
        <div class="confirm_dialog_body"></div>
        <div slot="footer" class="dialog-footer">
          <a class="btnDefault" @click="isNewType = 1">批量上传</a>
          <a class="btnDefault" @click="singleUpload()">单个上传</a>
          <p class="dialog-mess">
            （<a @click="downloadMB()">点击此处</a>下载“批量上传”模板）
          </p>
        </div>
      </template>
      <template v-if="isNewType == 1">
        <div slot="title" class="dialog_header">批量上传</div>
        <div class="confirm_dialog_body" style="padding: 60px 0 40px 0">
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
              ref="upload1"
              v-model="files"
              extensions="xlsx,xls"
              :post-action="uploadUrl"
              :auto-upload="false"
              @input-file="inputFile"
              @input-filter="inputFilter"
              name="excel_file"
            >
              <a class="a_upload pointer"><span>选择需要添加的题目</span></a>
            </file-upload>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <a class="btnDefault pointer" @click="confimBatchUpload"
            >确认上传{{ uploadUrl }}</a
          >
        </div>
      </template>

      <template v-if="isNewType == 2">
        <div slot="title" class="dialog_header">单个上传</div>

        <div class="baseInfo">
          <div class="fromBox">
            <el-form ref="form" label-width="90px">
              <el-form-item>
                <span slot="label" class="s-label">所属分类：</span>
                <el-cascader
                  v-model="category"
                  :options="categoryOptions"
                  :props="{ value: 'id', label: 'name', children: 'cates' }"
                  @change="handleChange"
                  clearable
                >
                </el-cascader>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label">题目类型：</span>
                <el-select
                  v-model="choseQuestionType"
                  placeholder="题目类型"
                  @change="dialogselectType"
                >
                  <el-option
                    v-for="item in questOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <span slot="label" class="s-label">题目详情：</span>
                <el-input
                  v-model="question.title"
                  type="textarea"
                  resize="none"
                ></el-input>
              </el-form-item>

              <el-form-item v-if="choseQuestionType == 0">
                <span slot="label" class="s-label">题目选项：</span>
                <div
                  class="din-options"
                  v-for="(item, index) in question.options"
                  :key="index"
                >
                  <el-input
                    style="margin-bottom: 12px; width: 90%"
                    v-model="item.label"
                    type="text"
                  ></el-input>
                  <a
                    @click="editChoice(index)"
                    class="btn_options pointer"
                    :class="{
                      btn_options_add: index + 1 == question.options.length,
                    }"
                  ></a>
                </div>
              </el-form-item>

              <el-form-item v-if="choseQuestionType == 0">
                <span slot="label" class="s-label">题目答案：</span>
                <el-select v-model="question.answer" placeholder="题目答案">
                  <el-option
                    v-for="item in question.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-if="choseQuestionType == 1">
                <span slot="label" class="s-label">题目答案：</span>
                <el-input v-model="question.answer" type="textarea"></el-input>
              </el-form-item>

              <el-form-item>
                <span slot="label" class="s-label">题目图片：</span>
                <div class="upload_box clearfix">
                  <div class="left_pic">
                    <div class="picbox">
                      <div
                        class=""
                        v-for="(file, index) in files1"
                        :key="index"
                      >
                        <img
                          class="td-image-thumb"
                          v-if="file.thumb"
                          :src="file.thumb"
                        />
                      </div>
                    </div>
                    <p class="mess">
                      （上传图片比例为3:2的，支持png.jpg.jpeg）
                    </p>
                  </div>
                  <div class="bupload_btn_box">
                    <file-upload
                      style="overflow: visible"
                      :maximum="1"
                      :multiple="true"
                      ref="upload"
                      v-model="files1"
                      extensions="jpg,gif,png,webp"
                      :post-action="uploadUrl"
                      :auto-upload="false"
                      @input-file="inputFile1"
                      @input-filter="inputFilter1"
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
            <a class="btnDefault pointer" @click="saveTilte">保存</a>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import FileUpload from "vue-upload-component";
import {
  getQuestionBackAll,
  deleteQuestionBackById,
  findParentCategory,
  findChildCategory,
  adminSubmitQuestions,
  upload,
  upload_qb_excel,
} from "@/API/api";

import { mapState } from "vuex";

export default {
  data() {
    return {
      inplaceholder: "请输入题目详情",
      customClass: {}, //父类
      i_customClass: {}, //子类
      options: [],
      options1: [],
      typeList: [
        { value: "0", label: "选择题" },
        { value: "1", label: "简答题" },
      ],
      quest_type: "",
      questionList: [],
      multipleSelection: [],
      guidePic: null,
      total: 0, //总共条数
      perPage: 15, //每页页数
      curPage: 1, //当前页
      showViewer: false, //图片预览
      showDel: false,
      isDelete: false,
      isNew: false, //新增题目
      isNewType: 0, //题目新增方式，1批量上传 2单个上传
      jwt: "",
      files: [], //题目批量上传
      files1: [], //上传的图片列表

      //新建题目命名
      question: {
        title: "",
        answer: "",
        options: [
          { value: 1, label: "" },
          { value: 2, label: "" },
        ],
      },
      choseQuestionType: "", //单个上传题目类型
      //新增题目类型
      questOptions: [
        { value: "0", label: "选择题" },
        { value: "1", label: "简答题" },
      ],
      category: [], //实验所属分类
      categoryOptions: [],
      addCategoryID: "",
      addCategoryItem: {}, //分类对象
      pic_upload_url: "",
      xlsx_upload_url: "",
      uploadUrl: "",
    };
  },
  components: {
    ElImageViewer,
    FileUpload,
  },

  mounted() {
    let that = this;
    that.uploadUrl = that.$store.state.uploadUrlExcel;
    console.log(that.uploadUrl);
    that.getQuestionBackAll();
  },
  created() {
    let that = this;
    //默认显示选择题
    that.quest_type = that.typeList[0].value;
    that.findParentCategory();
  },
  methods: {
    //下载模板
    downloadMB(val) {
      let that = this;
      window.location.href = that.$store.state.dowmloadExcel;
    },
    //新增删减题目选项
    editChoice(val) {
      let that = this;

      if (val == that.question.options.length - 1 && val < 3) {
        //新增
        that.question.options.push({ value: val + 1, label: "" });
      } else if (that.question.options.length > 2 && val < 3) {
        //删除
        that.question.options.splice(val, 1);
      }
      //重置value
      for (let i = 0; i < that.question.options.length; i++) {
        let aa = that.question.options[i];
        aa.value = i + 1;
      }
    },
    //获取父类
    findParentCategory() {
      let that = this;
      findParentCategory().then((res) => {
        // alert(JSON.stringify(res));
        console.log(res);
        if (res.code == 200) {
          that.options = res.data;
          that.categoryOptions = res.data;

          // that.customClass = that.options[0];
          // that.findChildCategory(that.customClass.id);

          for (let index = 0; index < that.categoryOptions.length; index++) {
            that.findChildCategory1(that.categoryOptions[index].id);
          }
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    findChildCategory(val) {
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

    //实验所属分类选择
    handleChange(value) {
      let that = this;
      //  console.log(value.length==1?value[0]:value[1]);
      that.addCategoryItem = value;
      that.addCategoryID = value.length == 1 ? value[0] : value[1];
    },

    findChildCategory1(cateId) {
      let that = this;
      let obj = {};
      obj.parent_category_id = cateId;
      findChildCategory(obj).then((res) => {
        // alert(JSON.stringify(res));
        if (res.code == 200) {
          let catesons = res.data;
          if (catesons.length > 0) {
            for (let i = 0; i < that.options.length; i++) {
              if (that.options[i].id === cateId) {
                that.$set(that.categoryOptions[i], "cates", catesons); // right
                break;
              }
            }
            // alert(that.categoryOptions)
          }
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    selectQuestionBackAll(content) {
      let that = this;
      let obj = {};
      obj.type = that.quest_type;
      obj.content = content;
      if (JSON.stringify(that.i_customClass) != "{}") {
        obj.category_id = that.i_customClass.id;
      } else if (JSON.stringify(that.customClass) != "{}") {
        obj.category_id = that.customClass.id;
      } else {
        obj.category_id = "";
      }

      obj.perPage = that.perPage;
      obj.page = that.curPage;
      obj.assignment_id = "";

      // alert(JSON.stringify(obj));
      getQuestionBackAll(obj).then((res) => {
        console.log(JSON.stringify(res));
        if (res.code == 200) {
          that.total = res.data.total;
          that.questionList = res.data.list;
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    getQuestionBackAll() {
      let that = this;
      that.selectQuestionBackAll("");
    },

    //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );

        if (extension != "xlsx" && extension != "xls") {
          this.$toast("只能上传后缀是.xlsx或xls的文件", 3000);
          return prevent();
        }
      }
    },
    //上传的回调函数，每次上传回调都不一样
    inputFile(newFile, oldFile) {
      let that = this;

      if (newFile && oldFile) {
        //add
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          //console.log('response', newFile.response)
          let response = newFile.response;
          console.log(this.files);
          if (response.code == 200) {
            // alert(111)
            this.$message.success("文件上传成功");
            that.isNew = false;
          } else {
            // alert(222)

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
    //上传前的钩子函数
    inputFilter1(newFile, oldFile, prevent) {
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
    inputFile1(newFile, oldFile) {
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

      //上传图片
      that.upload(that.files1[0].file, 0);
    },
    //上传图片
    upload(file, type) {
      let that = this;
      let obj = new FormData();
      obj.append("type", type);
      obj.append("file", file);

      upload(obj).then((res) => {
        if (res.code == 200) {
          that.pic_upload_url = res.data.name;
        } else {
          that.$toast(res.message, 3000);
        }
      });
    },
    //父类
    selectType(val) {
      let that = this;
      that.i_customClass = {};
      that.findChildCategory(val);
      that.selectQuestionBackAll("");
    },
    //子类
    selectType1(val) {
      let that = this;
      that.selectQuestionBackAll("");
    },
    //题目类型选择
    selectQuestType(val) {
      // that.quest_type
      let that = this;
      that.quest_type = val;
      that.selectQuestionBackAll("");
    },
    //底部分页
    handleCurrentChange(val) {
      let that = this;

      console.log(`当前页: ${val}`);
    },
    //点击单个上传
    singleUpload() {
      let that = this;
      that.isNewType = 2;
      that.choseQuestionType = that.questOptions[0].value;

      that.files1 = [];
      that.pic_upload_url = "";
      let obj = {
        title: "",
        answer: "",
        options: [
          { value: 1, label: "" },
          { value: 2, label: "" },
        ],
      };
      that.question = obj;
    },
    //点击图片
    getPreview(val) {
      let that = this;
      that.showViewer = true;
      that.guidePic = that.$store.state.pic_Url + val;
      // "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg";
      that.guidePic
        ? (that.showViewer = true)
        : that.$message.info("当前没有可预览的图片");
    },
    //图片预览关闭
    showViewerClose() {
      console.log("ok");
      this.showViewer = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //删除题目
    delList() {
      let that = this;

      if (that.multipleSelection.length <= 0) {
        that.showDel = !that.showDel;
      } else {
        that.isDelete = true;
      }
    },
    //确认删除
    confirmDelete() {
      let that = this;
      that.showDel = !that.showDel;
      that.isDelete = false;
      let obj = {};
      let list = [];
      for (let i = 0; i < that.multipleSelection.length; i++) {
        list.push(that.multipleSelection[i].id);
      }
      obj.delete_id_list = list;
      deleteQuestionBackById(JSON.stringify(obj)).then((res) => {
        if (res.code == 200) {
          that.isDelete = false;
          that.selectQuestionBackAll("");
        } else {
          this.$toast(res.message, 2000);
        }
      });
    },
    //批量上传确认
    confimBatchUpload() {
      let that = this;

      this.$refs.upload1.active = true;
    },
    //弹出框内，选择题目类型
    dialogselectType(val) {
      console.log(val);
      let that = this;
      // that.files1 = [];
      that.question.answer = "";
    },
    //新增题目保存
    saveTilte() {
      let that = this;

      // this.$refs.upload.active = true;
      // this.isNew = false;

      let obj = {};
      obj.type = that.choseQuestionType;
      if (that.addCategoryID == "") {
        return that.$toast("请选择所属分类", 3000);
      }
      if (that.question.title == "") {
        return that.$toast("请输入题目详情", 3000);
      }
      obj.content = that.question.title;

      if (that.choseQuestionType == 0) {
        let tmpArr = [];
        for (let i = 0; i < that.question.options.length; i++) {
          let aa = that.question.options[i];
          if (aa.label == "") {
            return that.$toast("题目选项存在空", 3000);
          }
          tmpArr.push(aa.label);
        }
        obj.choice = JSON.stringify(tmpArr);
      } else {
        obj.choice = "";
      }
      if (that.question.answer == "") {
        return that.$toast("请输入题目答案", 3000);
      }
      obj.answer = that.question.answer;
      if (that.choseQuestionType == 0) {
        //选择题答案处理下
        let tmp = that.question.options[that.question.answer - 1];
        obj.answer = tmp.label;
      }
      obj.pic_url = that.pic_upload_url;

      if (that.addCategoryItem.length == 1) {
        // obj.model_id = that.addCategoryItem[0];
        // obj.category_id = "";
        obj.model_id = "";
        obj.category_id = that.addCategoryItem[0];
      } else {
        obj.model_id = "";
        obj.category_id = that.addCategoryItem[1];
      }

      console.log(JSON.stringify(obj));

      adminSubmitQuestions(obj).then((res) => {
        console.log(JSON.stringify(res));
        if (res.code == 200) {
          that.files1 = [];
          that.pic_upload_url = "";
          let obj = {
            title: "",
            answer: "",
            options: [
              { value: 1, label: "" },
              { value: 2, label: "" },
            ],
          };
          that.question = obj;
          this.isNew = false;
          that.$toast("题目新增成功", 3000);
          that.selectQuestionBackAll("");
        } else {
          that.$toast(res.message, 3000);
        }
      });
      /*
           let obj ={
              title:'',
              answer:'',
              options:[
                {value:1,label:''},
                {value:2,label:''},
              ],
            }
          that.question = obj
          */
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);
.table_box_questionBank {
  min-height: 500px;
}
.s-text {
  display: block;
}
.dialog-mess {
  text-align: center;
  padding-top: 10px;
  color: @hnavcolor;
  a {
    cursor: pointer;
    color: @basecolor;
  }
}
.fileList_name {
  li {
    text-align: center;
    padding-bottom: 5px;
  }
}
/*新增题目样式 */
.baseInfo {
  margin: 0 50px;
  padding-top: 30px;
}
.btnBox {
  text-align: center;
  padding-bottom: 20px;
}
.left_pic {
  display: inline-block;
}
.bupload_btn_box {
  display: inline-block;
  vertical-align: bottom;
  margin-left: 10px;
  margin-bottom: 10px;
}
.picbox {
  width: 300px;
  height: 200px;
  border: 1px solid @border;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    -moz-transform: translate(0, -50%);
    -webkit-transform: translate(0, -50%);
  }
}
.din-options {
  display: inline-block;
  width: 100%;
}
.btn_options {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 12px;
  .borderRadius(5px,5px,5px,5px);
  background: url(../../assets/img/question_reduce.png) center no-repeat;
  background-size: 20px 2px;
  -webkit-background-size: 20px 2px;
}
.btn_options_add {
  background: url(../../assets/img/question_add.png) center no-repeat;
  background-size: 20px;
  -webkit-background-size: 20px;
}
</style>