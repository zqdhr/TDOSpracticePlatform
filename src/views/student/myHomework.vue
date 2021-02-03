<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab">
        <div class="clearfix">
          <div class="fl">
            <div class="sel-box">
              <el-select
                v-model="state"
                placeholder="请选择状态"
                @change="changeState"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div class="sel-box">
              <el-select
                v-model="level1Name"
                placeholder="课程"
                @change="changeLevel1"
              >
                <el-option
                  v-for="item in level1List"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
      </div>
    </div>
    <div class="container">
      <div class="tea_list">
        <ul class="tab_box">
          <li class="li-th">
            <div class="d1 d28">
              <div class="cell pname">作业名称</div>
            </div>
            <div class="d2 d15">
              <div class="cell textline1">截止时间</div>
            </div>
            <div class="d3 d18">
              <div class="cell">分数</div>
            </div>
            <div class="d4 d14">
              <div class="cell">状态</div>
            </div>
            <div class="d4 d11">
              <div class="cell"></div>
            </div>
            <div class="d5 d14">
              <div class="cell">操作</div>
            </div>
          </li>
          <li class="li-tr" v-for="(item, index) in jobList" :key="index">
            <div class="d1 d28">
              <div class="cell pname">{{ item.assignmentName }}</div>
            </div>
            <div class="d2 d15">
              <div class="cell textline1">{{ item.endAt }}</div>
            </div>
            <div class="d3 d18">
              <div class="cell">
                {{ item.score == -1 ? "待老师批阅" : item.score+"分" }}
              </div>
            </div>
            <div class="d4 d14">
              <div class="cell">
                {{ item.status == 1 ? "已提交" : "待提交" }}
              </div>
            </div>
            <div class="d4 d11">
              <div class="cell">{{ item.num }}</div>
            </div>
            <div class="d5 d14">
              <div class="cell">
                <div class="cell">
                  <a
                    class="pointer tab_atn"
                    @click="showDetail(item)"
                    >查看</a
                  >
                  <!--这两个属性只有在未提交的时候显示-->
                  <span class="space-line" v-if="item.status != 1"></span>
                  <a class="pointer tab_atn" v-if="item.status != 1">提交</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="tab-pagination">
          <el-pagination
            background
            :current-page="curPage"
            :page-size="perPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next,jumper"
            :total="totalNum"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      width="1100px"
      :visible.sync="isHomework"
      class="report_detail_dialog homeWork"
      :class="{ dialog_submitted_noreview: curStatus == 2 || curStatus == 1 }"
    >
      <div slot="title" class="dialog_header">xxxxx实验(作业)---共100分</div>
      <div class="reportMain course_list">
        <ul class="choice_question">
          <li
            class="li_choose"
            v-for="(item, index) in all_courseList"
            :key="index"
          >
            <div class="title">
              {{ item.title }}<span class="colorRed">（本题分数：20分）</span>
            </div>
            <div class="pic">
              <span><img src="../../assets/pic/course.png" /></span>
            </div>
            <p class="answer_box" v-if="item.type == 1">
              <span
                class="s_radio"
                :class="{ s_radio_answer: iindex + 1 == item.answer }"
                v-for="(iitem, iindex) in item.chose"
                :key="iindex"
                @click="choseanswer(index, iindex)"
              >
                {{ iitem }}
              </span>
            </p>
            <div class="answer-in" v-if="item.type == 2 && curStatus == 1">
              <el-input
                type="textarea"
                placeholder="请输入答案"
                :rows="3"
                v-model="item.answer"
              />
            </div>

            <p
              class="answer_box Short-answer p_text"
              v-if="item.type == 2 && curStatus != 1"
            >
              作答：{{ item.answer }}
            </p>

            <p
              class="answer_box colorRed p_correct_text"
              v-if="item.type == 2 && item.correctAnswer != ''"
            >
              正确答案：{{ item.correctAnswer }}
            </p>

            <div
              class="score_box"
              v-if="item.type == 2 && item.correctAnswer != ''"
            >
              本题得分：<span>10</span>
            </div>
            <!--选中的状态添加class   li_radio_h-->
            <span
              class="li_radio"
              :class="{ li_radio_correct: 1 == 0, li_radio_error: 1 == 1 }"
            ></span>
          </li>
        </ul>
      </div>
      <div class="report_detail_btnbox" v-if="curStatus == 1">
        <a class="pointer btnDefault">确认</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { student_getCourseList, student_getJobList,student_getJobDetail } from "@/API/api";

export default {
  created() {
    let that = this;
    that.state = that.stateList[0].value;
    that.getCourse();
  },
  data() {
    return {
      totalNum:0,
      perPage: 10, //用户列表每页条数
      curPage: 1,
      jobList: [],

      stateList: [
        { label: "全部", value: "-1" },
        { label: "未提交", value: "" },
        { label: "已提交", value: "1" },
      ], //作业状态list
      state: "", //作业选中状态
      level1List: [],
      level1Name: "", //选中课程名称

      inplaceholder: "请输入实验名称",

      //全部题目
      all_courseList: [],
      score: 6, //得分

      isHomework: false,

      curStatus: 0, //当前的作业状态
    };
  },
  filters: {
    catIndex: function (val) {
      let str = "";
      let value = val;
      if (value < 9) {
        str = "0" + value;
      } else {
        str = value;
      }
      return str;
    },
  },
  methods: {
    //获取学生作业
    student_getJobList(val) {
      let that = this;
      let obj = {};
      obj.perPage = that.perPage;
      obj.page = 1;
      obj.courseId = "13d0567f-a196-43ab-a7ac-d72f5b2915e5";//that.level1Name;
      obj.userId = sessionStorage.getItem("userId");
      obj.chapterId = "";
      obj.sectionId = "";
      obj.name = "";
      obj.status =  that.state == "-1"?"":that.state;

      student_getJobList(obj)
        .then((res) => {
          if (res.code == 200) {
              that.totalNum = res.data.total;
              that.jobList = res.data.list;
            // alert(JSON.stringify(res));
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((err) => {
            // alert(JSON.stringify(err));
        });
    },

    //获取学生作业详情
    student_getJobDetail(val) {
        alert(JSON.stringify(val))
      let that = this;
      let obj = {};
      obj.perPage = 100;
      obj.page = 1;
      obj.assignmentId = val.assignmentId;
      obj.userId = sessionStorage.getItem("userId");

      student_getJobDetail(obj)
        .then((res) => {
          if (res.code == 200) {
            alert(JSON.stringify(res));
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((err) => {
            // alert(JSON.stringify(err));
        });
    },
    //获取课程
    getCourse() {
      let that = this;
      let obj = {};
      obj.per_page = 1000;
      obj.page = 1;
      obj.user_id = sessionStorage.getItem("userId");
      obj.start = "";
      obj.end = "";
      obj.name = "";

      student_getCourseList(obj)
        .then((res) => {
          if (res.code == 200) {
            that.level1List = res.data.list;
            //   alert(JSON.stringify(res));
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((err) => {
          //   alert(JSON.stringify(err));
        });
    },

    //底部分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      let that = this;
      that.student_getJobList(0);
    },
    //选择状态
    changeState(val) {
      console.log("选择状态");
      let that = this;
      that.student_getJobList(0);
    },
    //选择课程
    changeLevel1(val) {
      let that = this;
      that.student_getJobList(0);
    },

    showDetail(item) {
      //status:0 未提交 state:1 已提交
      //score:-1 待老师批阅  >=0老师已批阅
      let that = this;
      that.isHomework = true;
      that.student_getJobDetail(item);
    //   //老师已批阅
    //   if (state == 1 && score == 1) {
    //     that.all_courseList = [
    //       {
    //         id: "1",
    //         title: "1.题目文本题目文本题目文本题目文本题目?",
    //         type: 1,
    //         chose: ["选项111", "选项222", "选项3333", "选项4444"],
    //         pic: "",
    //         answer: 2,
    //       },
    //       {
    //         id: "2",
    //         title: "1.题目文本题目文本题目文本题目文本题目?",
    //         type: 2,
    //         pic: "",
    //         answer: "题目文本题目文本题目文本题目文本题目",
    //         correctAnswer: "你猜我答题对不对",
    //       },
    //     ];
    //     that.curStatus = 3; //已提交已批阅
    //   }
    //   //老师未批阅
    //   if (state == 1 && score == 0) {
    //     that.curStatus = 2; //已提交待批阅
    //     that.all_courseList = [
    //       {
    //         id: "1",
    //         title: "1.题目文本题目文本题目文本题目文本题目?",
    //         type: 1,
    //         chose: ["选项111", "选项222", "选项3333", "选项4444"],
    //         pic: "",
    //         answer: "2",
    //         correctAnswer: "",
    //       },
    //       {
    //         id: "2",
    //         title: "1.题目文本题目文本题目文本题目文本题目?",
    //         type: 2,
    //         pic: "",
    //         answer: "ffffffff",
    //         correctAnswer: "",
    //       },
    //     ];
    //   }
    //   if (state == 0) {
    //     that.curStatus = 1; //已提交待批阅
    //     that.all_courseList = [
    //       {
    //         id: "1",
    //         title: "1.题目文本题目文本题目文本题目文本题目?",
    //         type: 1,
    //         chose: ["选项111", "选项222", "选项3333", "选项4444"],
    //         pic: "",
    //         answer: "",
    //         correctAnswer: "",
    //       },
    //       {
    //         id: "2",
    //         title: "1.题目文本题目文本题目文本题目文本题目?",
    //         type: 2,
    //         pic: "",
    //         answer: "",
    //         correctAnswer: "",
    //       },
    //     ];
    //   }
    //   that.curStatus = 2;

},
    //未提交可以选中
    choseanswer(index, iindex) {
      console.log("index" + index);
      console.log("iindex" + iindex);
      let that = this;
      if (that.curStatus != 1) {
        return false;
      } else {
        that.$set(that.all_courseList[index], "answer", iindex + 1);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/coursework.less);
@import url(../../assets/less/student.less);
.course_list {
  padding: 10px 20px 20px 0;
  .colorRed {
    color: #d82a2a;
  }
  .li_choose {
    padding-left: 30px;
    .li_radio {
      width: 18px;
      height: 18px;
    }
    .li_radio_correct {
      background: url(../../assets/img/quest_correct.png) center no-repeat;
    }
    .li_radio_error {
      background: url(../../assets/img/quest_error.png) center no-repeat;
    }
    .s_radio_answer {
      background: url(../../assets/img/quest_checked.png) left center no-repeat;
    }
  }
  .Short-answer {
    color: @basecolor;
  }
}
/*作业已提交未批阅 */
.dialog_submitted_noreview {
  .course_list {
    .li_choose {
      padding-left: 0px;
      .li_radio {
        display: none;
      }
    }
  }
  .answer-in {
    padding: 10px 0;
    background: inherit;
  }
}
</style>