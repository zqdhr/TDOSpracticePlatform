<template>
  <div>
    <!--新增课件选择-->
    <el-dialog
      class="dialog_pagination"
      :visible.sync="isnewFilter"
      :width="isnewFilterType == 1 ? '1100px' : '600px'"
      :class="{ newCourseware_dialog: isnewFilterType == 0 }"
    >
      <template v-if="isnewFilterType == 0">
        <div slot="title" class="dialog_header">请选择新增课件模式</div>
        <div class="confirm_dialog_body"></div>
        <div slot="footer" class="dialog-footer">
          <a class="btnDefault" @click="choseLibray">课件库选择</a>
          <a class="btnDefault" @click="isnewFilterType = 2">本地上传</a>
        </div>
      </template>
      <!--课件库选择-->
      <template v-if="isnewFilterType == 1">
        <div slot="title" class="dialog_header">课件库选择</div>
        <div class="pageTab clearfix nopaddingBottom">
          <div class="fl">
            <div class="sel-box">
              <el-cascader
                      v-model="category"
                      :options="categoryOptions"
                      :props="{value: 'id', label: 'name',children: 'cates'}"
                      @change="handleChange" clearable>
              </el-cascader>
            </div>

            <div class="sel-box">
              <el-select
                v-model="cate"
                placeholder="请选择课件分类"
                @change="selectCate"
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
            <div class="sel-box">
              <el-select
                v-model="type"
                placeholder="请选择课件类型"
                @click="selectType"
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
            <div class="d-serach">
              <input
                :placeholder="inplaceholder"
                type="text"
                autocomplete="off"
                v-model = "searchText"
              />
            
            </div>
            <a class="btn_finsh" @click="searchCoerseWare">完成</a>
          </div>
        </div>
        <div class="list_box">
          <div class="div_checked">
            <span v-for="(item, index) in chooseList" :key="index">
              {{ item.name }}
              <a
                class="icon icon_close pointer"
                @click="deleteSel(item, index)"
              />
            </span>
          </div>
          <ul class="list_ul coursewareLibrary_ul clearfix">
            <li v-for="(item, index) in all_experimentList" :key="index">
              <div class="info padt20 boxShadow">
                <a
                  class="icon icon_radio pointer"
                  :class="{ icon_radio_h: item.checked }"
                  @click="click_checked(item, index, item.checked)"
                ></a>
                <div class="icon-box">
                  <span
                    class="c_icon"
                    :class="{
                      icon_video: item.type == 0,
                      icon_pdf: item.type == 1,
                    }"
                  ></span>
                </div>
                <p class="p-text textline1 p-name">{{ item.name }}</p>
                <div class="line"></div>
                <p class="p-text textline1">课件大小：{{ item.size }}</p>
                <p class="p-text textline1">视频时长：{{ item.duration }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div slot="footer" class="clearfix">
          <a class="btnDefault fl pointer" @click="confirmChoose">确认选择</a>

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
      <template v-if="isnewFilterType == 2">
        <div slot="title" class="dialog_header">本地上传</div>
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
          <a class="btnDefault pointer" @click="confirmLocalUpload">确认上传</a>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import FileUpload from "vue-upload-component";
import toastVue from "./toast/toast.vue";
import {getCoursewareAll,addChapterSectionCourseware,findParentCategory,findChildCategory,upload,addCourseware} from '@/API/api';
export default {
  inject:['reload'],
  data() {
    return {
      inplaceholder: "请输入课件名",
      options: [
        { value: "0", label: "内置课件" },
        { value: "1", label: "教师上传" },
      ],
      typeList: [
        { value: "2", label: "全部" },
        { value: "1", label: "文档" },
        { value: "0", label: "视频" },
      ],
      //已有的课件库
      all_experimentList: [
      ],
      total: 100,
      perPage: 10, //8个实验一页
      curPage: 1, //设备列表
      cate: "内置课件", //课件分类默认内置课件
      type: '全部', //课件类型默认全部

      customClass: [
        { value: "1", label: "场景篇" },
        { value: "2", label: "原理篇" },
      ], //自定义分类
      isnewFilter: false,
      isnewFilterType: 0, //课件库选择 1代表本地课件库  2代表本地上传
      category:[],//实验所属分类
      categoryOptions: [],
      cateId:'',
      searchText:'',
      jwt: "",
      uploadUrl: "",
      files: [],
      chooseList: [], //课件被选择列表
      sindex:'',
      cindex:'',
      category_id:'',//父分类id
      c_category_id:'',//子分类id
      kind:'',
      type1:'',
      name:'',
      count:'',
    };
  },
  components: {
    FileUpload,
  },
  props: {},
  created() {
    this.cate = this.options[0].value; //默认选中内置课件
    this.type = this.typeList[0].value; //课件类型默认选中全部

    this.findParentCategory();
  },
  mounted() {
    let that = this;

  },
  methods: {
    //课件列表
    getCoursewareAll() {
      let that = this;
      if(that.sindex != '' && that.cindex != ''){
        that.cindex = '';
      }
      alert(that.type1)
      that.findCourseWareAll(that.perPage, 1, that.kind, that.type1,'', '', that.cindex, that.sindex,'');
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

    //课件所属分类选择
    handleChange(value) {
      let that = this
      console.log(value.length==1?value[0]:value[1]);
      that.cateId = value.length==1?value[0]:value[1]
    },

    findCourseWareAll(per_page, page, kind, type, name, category_id, chapter_id, section_id,c_category_id) {
      let that = this;
      let obj = {};
      obj.perPage = per_page;
      obj.page = page;
      obj.kind = kind;
      obj.type = type;
      obj.name = name;
      obj.name = name;
      obj.category_id = category_id;
      obj.chapter_id = chapter_id;
      obj.section_id = section_id;
      obj.c_category_id = c_category_id;
      getCoursewareAll(obj).then((res) => {
        if (res.code == 200) {
          that.all_experimentList = res.data.list;
          that.total = res.data.total
        } else {
          that.$toast(res.message, 3000);
        }
      });
    },
    //点击新建课件
    click_new(cid, sid,count) {
      let that = this;
      that.files = [];
      that.isnewFilterType = 0;
      that.isnewFilter = true;
      that.chooseList = [];
      that.sindex = sid;
      that.cindex = cid;
      that.count = count;
      that.getCoursewareAll();
    },
    //点击课件库选择
    choseLibray() {
      let that = this;
      that.isnewFilterType = 1;
      that.array_addChecked(that.all_experimentList);
    },
    //选择分类
    selectCate(val) {
      let that = this;
      console.log("选择自定义分类1" + val);
      that.type1 = val;
    },

    //选择课件类型
    selectType(val) {
      let that = this;
      console.log(val);
      that.kind = val;
    },
    searchCoerseWare(){
      let that = this;
      console.log(that.searchText)
      that.type = that.type1 == '2' ? '' : that.type1;
      that.findCourseWareAll(10, 1, that.kind, that.type, that.searchText, that.category_id, '', '',that.c_category_id);
    },
    //本地上传确认上传
    confirmLocalUpload() {
      let that = this;

      that.isnewFilter = false
      console.log("111")
      if (!this.$refs.upload.active) {
        that.upload(that.files[0].file)
      }
    },
    //课件库选择确认选择
    confirmChoose() {
      let that = this;
      console.log(that.sindex)
      console.log(that.chooseList)
      if (that.sindex !== '') {
        console.log("节新增课件")
        let obj = {};
        let list = [];
        for(let i = 0;i<that.chooseList.length;i++){
          let obj1 = {};
          obj1.courseware_id = that.chooseList[i].id
          obj1.section_id = that.sindex;
          obj1.chapter_id = "fb0a1080-b11e-427c-8567-56ca6105ea07";
          list.push(obj1);
        }
        obj.chapter_section_courseware_list = list
        console.log(JSON.stringify(obj))
        addChapterSectionCourseware(JSON.stringify(obj)).then(res => {
          if (res.code == 200) {
            alert("111")
            that.isnewFilter = false;
            this.$toast("新增成功", 2000)
            that.reload();
          } else {
            this.$toast(res.message, 2000)
          }
        })
      } else {
        console.log("章新增课件")
        let obj = {};
        let list = [];
        for(let i = 0;i<that.chooseList.length;i++){
          let obj1 = {};
          obj1.courseware_id = that.chooseList[i].id
          obj1.section_id = "fb0a1080-b11e-427c-8567-56ca6105ea07";
          obj1.chapter_id = that.cindex;
          list.push(obj1);
        }
        obj.chapter_section_courseware_list = list
        console.log(JSON.stringify(obj))
        addChapterSectionCourseware(JSON.stringify(obj)).then(res => {
          if (res.code == 200) {
            alert("111")
            that.isnewFilter = false;
            this.$toast("新增成功", 2000)
            that.reload();
          } else {
            this.$toast(res.message, 2000)
          }
        })
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
      let that = this
      console.log(`当前页: ${val}`);
      that.findCourseWareAll(that.perPage, val, that.kind, that.cate, that.searchText, that.category_id, that.cindex, that.sindex,that.c_category_id);
    },
    //数组新增checked元素
    array_addChecked(array) {
      let that = this;
      for (var i = 0; i < array.length; i++) {
        that.$set(array[i], "checked", false);
      }
    },
    //删除课件选择
    deleteSel(item, index) {
      let that = this;
      that.chooseList.splice(index, 1);
      for (var i = 0; i < that.all_experimentList.length; i++) {
        if (item.id == that.all_experimentList[i].id) {
          that.$set(that.all_experimentList[i], "checked", false);
        }
      }

      // that.$set(that.all_experimentList[item.index], "checked", false);
      // for (var i = 0; i < that.chooseList.length; i++) {
      //   if (item.id == that.chooseList[i].id) {
      //     that.chooseList.splice(i, 1);
      //   }
      // }
    },
    //课件选择
    click_checked(obj, index, checked) {
      let that = this;
      if (!checked) {
        if (!(that.chooseList.indexOf(obj.id) != -1)) {
          if (that.chooseList.length + parseInt(that.count) > 4) {
            return this.$toast("最多上传5个课件，还需添加请删除", 3000);
          }
          that.chooseList.push(obj);
        }
        that.$set(that.all_experimentList[index], "checked", true);
      } else {
        that.$set(that.all_experimentList[index], "checked", false);
        for (var i = 0; i < that.chooseList.length; i++) {
          if (obj.id == that.chooseList[i].id) {
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
          console.log(this.files)

          if (newFile.xhr) {
            //  Get the response status code
            console.log("status", newFile.xhr.status);
          }
        }
      }


    },
    //上传图片
    upload(file) {
      let that = this
      let obj = new FormData()
      let type = that.extension == 'pdf' ?2 : 1
      obj.append('type', type)
      obj.append('file', file)
      alert(that.files[0].file.name)
      upload(obj).then(res => {
        if (res.code == 200) {
          that.picUrl = res.data.name;
          that.size = res.data.size;
          that.time = res.data.time;
          let obj = {};
          obj.name = that.files[0].file.name;
          obj.type = 0;
          obj.kind = type;
          obj.url = that.picUrl;
          obj.duration = that.time;
          obj.size = that.size;
          obj.category_id = that.addCategoryID;
          this.$refs.upload.active = true;
          addCourseware(JSON.stringify(obj)).then((resCourse) => {
            if (resCourse.code == 200) {
              alert("新建成功");
              console.log(resCourse.data.id)
              if (that.sindex !== '') {
                console.log("节新增课件")
                let obj = {};
                obj.courseware_id = resCourse.data.id;
                obj.section_id = that.sindex;
                obj.chapter_id = that.cindex;
                addChapterSectionCourseware(JSON.stringify(obj)).then(resadd => {
                  if (resadd.code == 200) {
                    alert("111")
                    that.isnewFilter = false;
                  } else {
                    this.$toast(resadd.message, 2000)
                  }
                })
              } else {
                console.log("章新增课件")
                let obj = {};
                obj.courseware_id = resCourse.data.id;
                obj.section_id = "fb0a1080-b11e-427c-8567-56ca6105ea07";
                obj.chapter_id = that.cindex;
                addChapterSectionCourseware(JSON.stringify(obj)).then(resadd => {
                  if (resadd.code == 200) {
                    alert("111")
                    that.isnewFilter = false;
                  } else {
                    this.$toast(resadd.message, 2000)
                  }
                })
              }
            } else {
              that.$toast(res.message, 3000);
            }
          });

        } else {
          that.$toast(res.message, 3000)
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/less/admin.less);
.pageTab .sel-box{width:180px;}
.pageTab .fr .d-serach{padding-left: 12px;padding-right: 12px; width: 170px; margin-right: 20px;}
.btn_finsh{background: @basecolor; font-size:16px;color:#fff; display: inline-block; padding: 5px 8px; .borderRadius(5px,5px,5px,5px);
vertical-align: middle; cursor: pointer;}
</style>
