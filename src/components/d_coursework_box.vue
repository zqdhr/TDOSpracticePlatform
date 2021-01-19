<!--课程作业-->
<template>
  <div class="experiment_box">
    <div class="exper_main">
      <courseNav></courseNav>
      <div class="right_box">
        <div class="add_btn_box">
          <div class="sel-box">
            <el-select
              v-model="cate"
              placeholder="请选择作业类型"
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
          <a class="btnDefault pointer mr20" @click="deleteOperation"
            >删除题目</a
          >
          <a class="btnDefault pointer" @click="click_new">新增题目</a>
        </div>
        <!--课程题目-->
        <div class="coursework_box">
          <!--未开课显示的样式 根据情况只显示一个-->
          <template>
            <div class="in-box">
              <input
                placeholder="请输入作业名称"
                type="text"
                autocomplete="off"
                maxlength="15"
                ref="inputVal"
              /><a class="edit" @click="input_focus"></a>
            </div>
          </template>
          <!--已开课显示的样式-->
          <template v-if="1 == 0">
            <div class="coursework_name">区块链原理篇作业</div>
          </template>

          <div class="course_list">
            <!--选择题-->
            <ul class="choice_question">
              <li
                :class="{ li_choose: isShow }"
                v-for="(item, index) in courseList"
                :key="index"
              >
                <div class="title">{{ item.title }}</div>
                <div class="pic">
                  <img :src="item.pic" />
                </div>
                <p class="answer_box" v-if="item.type == 1">
                  <span
                    class="s_radio"
                    :class="{ s_radio_answer: index == item.answer }"
                    v-for="(iitem, iindex) in item.chose"
                    :key="iindex"
                  >
                  </span>
                </p>
                <p class="answer_box" v-if="item.type == 2">
                  {{ item.answer }}
                </p>
                <!--选中的状态添加class   li_radio_h-->
                <span
                  class="li_radio"
                  @click="cheeckedList(item, index, item.checked)"
                  :class="{ li_radio_h: item.checked }"
                ></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--删除弹出框-->
    <el-dialog :visible.sync="isDelete" width="600px">
      <div slot="title" class="dialog_header">请注意!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前选中作业吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteCourseWork">确 认</a>
        <a
          class="btnDefault"
          @click="
            isDelete = false;
            isShow = false;
          "
          >取 消</a
        >
      </div>
    </el-dialog>
    <!--题库选择弹出框-->
    <el-dialog :visible.sync="showQuestionBank" :width="dialogWidth">
      <div slot="title" class="dialog_header">新增题目（题目库选择）</div>
      <div class="course_list dialog_course_list">
        <!--选择题-->
        <ul class="choice_question">
          <li
            class="li_choose"
            v-for="(item, index) in all_courseList"
            :key="index"
          >
            <div class="title">{{ item.title }}</div>
            <div class="pic">
              <img :src="item.pic" />
            </div>
            <p class="answer_box" v-if="item.type == 1">
              <span
                class="s_radio"
                :class="{ s_radio_answer: index == item.answer }"
                v-for="(iitem, iindex) in item.chose"
                :key="iindex"
              >
              </span>
            </p>
            <p class="answer_box" v-if="item.type == 2">{{ item.answer }}</p>
            <!--选中的状态添加class   li_radio_h-->
            <span
              class="li_radio"
              :class="{ li_radio_h: item.checked }"
              @click="cheeckedList(item, index, item.checked)"
            ></span>
          </li>
        </ul>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showQuestionBank = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import courseNav from "@/components/left_courseNav.vue";
export default {
  data() {
    return {
      options: [
        { value: "1", label: "选择题" },
        { value: "2", label: "简答题" },
      ],

      cate: "选择题", //课件分类默认内置课件
      showQuestionBank: false, //题库是否显示(弹出框)
      dialogWidth: 0,
      //作业列表参数根据具体实际情况来定
      coursework: {
        name: "",
      },
      courseList: [
        {
          id: "1",
          title: "1.题目文本题目文本题目文本题目文本题目?",
          type: 1,
          chose: ["选项111", "选项222", "选项3333", "选项4444"],
          pic: "",
          answer: 2,
        },
        {
          id: "2",
          title: "1.题目文本题目文本题目文本题目文本题目?",
          type: 2,
          pic: "",
          answer: "题目文本题目文本题目文本题目文本题目",
        },
      ],
      //全部题目
      all_courseList:[
         {
          id: "1",
          title: "1.题目文本题目文本题目文本题目文本题目?",
          type: 1,
          chose: ["选项111", "选项222", "选项3333", "选项4444"],
          pic: "",
          answer: 2,
        },
        {
          id: "2",
          title: "1.题目文本题目文本题目文本题目文本题目?",
          type: 2,
          pic: "",
          answer: "题目文本题目文本题目文本题目文本题目",
        }, 
      ],
      isShow: false,
      deleteList: [], //选中需要删除的题目列表
      isDelete: false,
    };
  },
  components: {
    courseNav,
  },
  created() {
    let that = this;
    this.cate = this.options[0].value; //默认选中内置课件
    this.setDialogWidth();
    that.addState(that.courseList);
  },
  mounted() {
    let that = this;
    window.onresize = () => {
      return (() => {
        this.setDialogWidth();
      })();
    };
  },
  methods: {
    //选中事件
    cheeckedList(obj, index, checked) {
      let that = this;
      if (!checked) {
        if (!(that.deleteList.indexOf(obj.id) != -1)) {
          that.deleteList.push(obj.id);
        }
        that.$set(that.courseList[index], "checked", true);
        
      } else {
        that.$set(that.courseList[index], "checked", false);
        var i = that.deleteList.indexOf(obj.id);
        that.deleteList.splice(i, 1);
      }
    },
    addState(array) {
      //获取的作业列表，添加选中状态

      let that = this;
      for (var i = 0; i < array.length; i++) {
        that.$set(array[i], "checked", false);
      }
    },
    //弹出框设置响应式宽度
    setDialogWidth() {
      var val = document.documentElement.clientWidth;
      const def = 1200; // 默认宽度
      if (val < def) {
        this.dialogWidth = "80%";
      } else {
        this.dialogWidth = def - 200 + "px";
      }
    },
    //弹出框右上角关闭安妮
    handleClose() {
      let that = this;
      that.showQuestionBank = false;
    },
    //选择分类
    selectCate(val) {
      console.log(val);
    },

    //删除题目
    deleteOperation() {
      let that = this;

      if (that.isShow && that.deleteList.length > 0) {
        that.isDelete = true;
      } else {
        that.isShow = !that.isShow;
        that.addState(that.courseList);

        that.deleteList = [];
      }
    },
    //点击编辑框输入作业名获取焦点
    input_focus() {
      this.$nextTick(function () {
        //DOM 更新了
        this.$refs.inputVal.focus();
      });
    },

    //删除确认
    confirmDeleteCourseWork() {
      let that = this;
      that.isDelete = false;
      that.isShow = false;
    },
    //点击新增题目
    click_new() {
      let that = this;
      that.showQuestionBank = true;
      that.addState(that.all_courseList);
      that.deleteList = [];
    },
  },
};
</script>
<style lang="less" scoped>
.experiment_box {
  margin-top: 30px;
  min-height: 600px;
  .exper_main {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .right_box {
    margin-left: 330px;
  }
}

.page_box {
  text-align: right;
}
.add_btn_box {
  padding-bottom: 15px;
  text-align: right;
}
.mr20 {
  margin-right: 20px;
}

.sel-box {
  float: left;
  margin-right: 30px;
}

.coursework_box {
  min-height: 500px;
  border: 1px solid @hnavcolor;
  padding: 10px 0;
  .coursework_name {
    text-align: center;
    margin: 0 50px;
    padding: 20px 0;
    font-size: 24px;
  }
  .edit {
    width: 18px;
    height: 18px;
    display: inline-block;
    background: url(../assets/img/icon_edit.png) center no-repeat;
    vertical-align: top;
    cursor: pointer;
    margin-top: 5px;
  }
  .in-box {
    text-align: center;
    input {
      font-size: 18px;
      color: #333;
      text-align: center;
      line-height: 30px;
    }
  }
}

/*作业列表*/
.course_list {
  padding: 0 40px;
  .title {
    font-size: 16px;
    color: @tabcolor;
    margin: 8px 0;
  }
  .pic {
    width: 400px;
    height: 150px;
    background: @background;
    .borderRadius(5px,5px,5px,5px);
    overflow: hidden;
    margin: 8px 0;
  }
  .answer_box {
    margin: 8px 0;
    .s_radio {
      background: url(../assets/img/course_radion.png) left center no-repeat;
      padding-left: 24px;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
    }
    .s_radio_answer {
      background: url(../assets/img/course_radioh.png) left center no-repeat;
    }
  }
  li {
    padding-left: 0px;
    transition: all 0.1s ease-in-out;
    -moz-transition: all 0.1s ease-in-out;
    -webkit-transition: all 0.1s ease-in-out;
    -o-transition: all 0.1s ease-in-out;
    .li_radio {
      opacity: 0;
    }
  }
  .li_choose {
    position: relative;
    padding-left: 40px;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    .li_radio {
      width: 26px;
      height: 26px;
      display: block;
      background: url(../assets/img/rad2.png) center no-repeat;
      position: absolute;
      left: 0px;
      top: 12px;
      -webkit-background-size: 24px;
      background-size: 24px;
      opacity: 1;
      transition: all 0.2s ease-in-out;
      -moz-transition: all 0.2s ease-in-out;
      -webkit-transition: all 0.2s ease-in-out;
      -o-transition: all 0.2s ease-in-out;
    }
    .li_radio_h {
      background: url(../assets/img/radh11.png) center no-repeat;
      -webkit-background-size: 24px;
      background-size: 24px;
    }
  }
}

/*弹出框 */
.dialog_course_list {
  padding: 0px;
}
.dialog-footer {
  text-align: center;
}

@media screen and (max-width: 1440px) {
  .experiment_box {
    .right_box {
      margin-left: 290px;
    }
  }
}
</style>