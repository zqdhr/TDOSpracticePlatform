<template>
  <div>
    <!--新增实验选择-->
    <el-dialog
      class="dialog_pagination"
      :visible.sync="isnewFilter"
      :width="isnewFilterType == 1 ? '1100px' : '600px'"
      :class="{ newCourseware_dialog: isnewFilterType == 0 }"
    >
      <!--实验库选择-->
      <template v-if="isnewFilterType == 1">
        <div slot="title" class="dialog_header">实验库选择</div>
        <div class="pageTab clearfix nopaddingBottom">
          <div class="fl">
            <div class="sel-box">
              <el-select
                v-model="customType"
                placeholder="自定义分类"
                @change="selectCustomType"
              >
                <el-option
                  v-for="item in customClass"
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
          <ul class="list_ul clearfix">
              <li v-for="(item,index) in experimentList" :key="index">
                  <div class="info">
                     <a
                      class="icon icon_radio pointer"
                      :class="{ icon_radio_h: item.checked }"
                      @click="click_checked(item, index, item.checked)"
                    ></a>

                      <div class="pic">
                          <div class="pic_box"></div>
                      </div>
                      <p class="p-text textline1">{{item.name}}</p>
                      <p class="p-text textline1">实验时长：{{item.duration}}</p>
                      <p class="p-text textline1">截止时间：{{item.endtime}}</p>
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
    </el-dialog>
  </div>
</template>
<script>

import toastVue from "./toast/toast.vue";
export default {
  data() {
    return {
      inplaceholder: "请输入实验名",
        experimentList:[
              {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
              {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
              {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
              {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
              {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
              {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
              {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
              {id:'52dddz',name:'xxxxx实验',duration:'45分钟',endtime:'15:40'},
          ],
     
      total: 100,
      perPage: 8, //8个实验一页
      curPage: 1, //设备列表

      customClass: [
        { value: "1", label: "场景篇" },
        { value: "2", label: "原理篇" },
      ], //自定义分类
      customType: "",
      isnewFilter: false,
      isnewFilterType: 0, //实验库选择 1代表本地实验库  2代表本地上传

      chooseList: [], //实验被选择列表
    };
  },
  components: {
  },
  props: {},
  created() {

  },
  methods: {
    //点击选择实验
    click_new() {
      let that = this;
      that.isnewFilter = true;
      that.chooseList = [];
      that.isnewFilterType = 1;
      that.array_addChecked(that.all_experimentList);
    },
  
    //选择分类
    selectCate(val) {
      console.log(val);
    },

    //本地上传确认上传
    confirmLocalUpload() {
      let that = this;

      that.isnewFilter = false;
    },
    //实验库选择确认选择
    confirmChoose() {
      let that = this;
      that.isnewFilter = false;
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
    array_addChecked(array) {
      let that = this;
      for (var i = 0; i < array.length; i++) {
        that.$set(array[i], "checked", false);
      }
    },
    //删除实验选择
    deleteSel(item, index) {
      let that = this;
      that.chooseList.splice(index, 1);
      for (var i = 0; i < that.all_experimentList.length; i++) {
        if (item.id == that.all_experimentList[i].id) {
          that.$set(that.all_experimentList[i], "checked", false);
        }
      }

    },
    //实验选择
    click_checked(obj, index, checked) {
      let that = this;
      if (!checked) {
        if (!(that.chooseList.indexOf(obj.id) != -1)) {
          if (that.chooseList.length == 2) {
            return this.$toast("最多上传2个实验", 3000);
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
    
  },
};
</script>

<style lang="less" scoped>
@import url(../assets/less/admin.less);

</style>
