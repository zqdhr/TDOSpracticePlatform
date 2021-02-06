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
                {{ item.score == -1 ? "待老师批阅" : item.score + "分" }}
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
                  <a class="pointer tab_atn" @click="showDetail(item)">查看</a>
                  <!--这两个属性只有在未提交的时候显示-->
                  <span class="space-line" v-if="item.status != 1"></span>
                  <a
                    class="pointer tab_atn"
                    @click="submitHomework(item)"
                    v-if="item.status != 1"
                    >提交</a
                  >
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

    <!--点击确定按钮弹出确认框-->
    <el-dialog :visible.sync="isSubmitJob" width="600px">
      <div slot="title" class="dialog_header"></div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <!--成功span的class为icon_success-->
          <span class="span_icon icon_success">是否已经完成作业？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="submitHomeworkConfirm()">确 认</a>
        <a class="btnDefault" @click="isSubmitJob = false">取 消</a>
      </div>
    </el-dialog>

    <el-dialog
      width="1100px"
      :visible.sync="isHomework"
      class="report_detail_dialog homeWork"
      :class="{ dialog_submitted_noreview: curStatus == 2 || curStatus == 1 }"
    >
      <div slot="title" class="dialog_header">
        {{ momentJob.assignmentName }}(作业)---共{{ totalScore }}分
      </div>
      <div class="reportMain course_list">
        <ul class="choice_question">
          <li
            class="li_choose"
            v-for="(item, index) in all_courseList"
            :key="index"
          >
            <div class="title">
              {{ index + 1 }}. {{ item.content
              }}<span class="colorRed"
                >（本题分数：{{ item.totalScore }}分）</span
              >
            </div>

            <div class="pic" v-if="item.picUrl.length > 0">
              <span><img :src="pic_Url + item.picUrl" /></span>
            </div>

            <p class="answer_box" v-if="item.type == 0">
              <span
                class="s_radio"
                :class="{ s_radio_answer: iitem == item.studentAnswer }"
                v-for="(iitem, iindex) in JSON.parse(item.choice)"
                :key="iindex"
                @click="choseanswer(item, iindex)"
              >
                {{ iitem }}
              </span>
            </p>
            <div class="answer-in" v-if="item.type == 1 && curStatus == 0">
              <el-input
                type="textarea"
                placeholder="请输入答案"
                :rows="3"
                v-model="item.studentAnswer"
              />
            </div>

            <p
              class="answer_box Short-answer p_text"
              v-if="item.type == 1 && curStatus != 0"
            >
              作答：{{ item.studentAnswer }}
            </p>

            <p
              class="answer_box colorRed p_correct_text"
              v-if="curStatus == 2"
            >
              正确答案：{{ item.answer }}
            </p>

            <div class="score_box" v-if="curStatus == 2">
              本题得分：<span>{{item.score}}</span>
            </div>
            <!--选中的状态添加class   li_radio_h-->
            <span
              class="li_radio"
              v-if="item.type == 0 && curStatus == 2"
              :class="{
                li_radio_correct: item.studentAnswer == item.answer,
                li_radio_error: item.studentAnswer != item.answer,
              }"
            ></span>
          </li>
        </ul>
      </div>
      <div class="report_detail_btnbox" v-if="curStatus == 0">
        <a class="pointer btnDefault" @click="confirm()">保存</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  student_getCourseList,
  student_getJobList,
  student_getJobDetail,
  stduentSaveHomework,
  stduentSubmitHomework,
} from "@/API/api";

export default {
  created() {
    let that = this;
    that.state = that.stateList[0].value;
    that.getCourse();
  },
  data() {
    return {
      isSubmitJob: false,
      totalNum: 0,
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
      pic_Url: "",

      curStatus: 0, //0-->未提交可编辑   1-->已提交未批改   2-->已提交已批改
      totalScore: 0, //题目总分
      momentJob: {},
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

  mounted() {
    let that = this;
    that.pic_Url = that.$store.state.pic_Url;
  },

  methods: {
    //获取学生作业
    student_getJobList(val) {
      let that = this;
      let obj = {};
      obj.perPage = that.perPage;
      obj.page = 1;
      obj.courseId = that.level1Name; //"13d0567f-a196-43ab-a7ac-d72f5b2915e5";
      obj.userId = sessionStorage.getItem("userId");
      obj.chapterId = "";
      obj.sectionId = "";
      obj.name = "";
      obj.status = that.state == "-1" ? "" : that.state;

      // alert(JSON.stringify(obj));
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
      // alert(JSON.stringify(val))
      let that = this;
      let obj = {};
      obj.perPage = 100;
      obj.page = that.curPage;
      obj.assignmentId = val.assignmentId;
      obj.userId = sessionStorage.getItem("userId");

      student_getJobDetail(obj)
        .then((res) => {
          if (res.code == 200) {
            // alert(JSON.stringify(res))

            that.all_courseList = res.data.list;
            that.totalScore = 0;
            for (let i = 0; i < that.all_courseList.length; i++) {
              let dic = that.all_courseList[i];

              that.totalScore = that.totalScore + dic.totalScore;
            }
            // console.log(JSON.stringify(res));
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
            // console.log(JSON.stringify(res));
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
      that.curPage = val;
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

      that.momentJob = item;

      if (item.status == 0) {
        that.curStatus = 0;
      } else if (item.score == -1) {
        that.curStatus = 1;
      } else {
        that.curStatus = 2;
      }

      that.isHomework = true;
      that.student_getJobDetail(item);
    },
    //未提交可以选中
    choseanswer(item, iindex) {
      let that = this;
      if (that.curStatus == 0) {
        let aswArr = JSON.parse(item.choice);
        that.$set(item, "studentAnswer", aswArr[iindex]);
      }
    },
    //提交作业确认
    submitHomework(item) {
      let that = this;
      that.momentJob = item;
      that.isSubmitJob = true;
    },
    //提交作业
    submitHomeworkConfirm() {
      let that = this;

      let obj = {};
      obj.assignment_id = that.momentJob.assignmentId;
      obj.user_id = sessionStorage.getItem("userId");

      stduentSubmitHomework(obj)
        .then((res) => {
          // alert(JSON.stringify(res));
          if (res.code == 200) {
            that.$toast("作业提交成功", 3000);
            that.isSubmitJob = false;
            that.student_getJobList(0);
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((ero) => {
          // alert(JSON.stringify(ero));
        });
    },
    confirm(val) {
      let that = this;

      let obj = {};
      let answerArr = [];
      for (var i = 0; i < that.all_courseList.length; i++) {
        let tmpDic = that.all_courseList[i];
        let dic = {};
        dic.question_id = tmpDic.id;
        dic.assignment_id = that.momentJob.assignmentId;
        dic.user_id = sessionStorage.getItem("userId");
        if (tmpDic.type == 0) {
          if (tmpDic.studentAnswer == tmpDic.answer) {
            dic.score = tmpDic.totalScore;
          } else {
            dic.score = 0;
          }
        } else {
          dic.score = 0;
        }
        dic.answer = tmpDic.studentAnswer;
        answerArr.push(dic);
      }
      // obj.student_score_list = JSON.stringify(answerArr);
      obj.student_answer_list = answerArr;

      // alert(JSON.stringify(obj));

      stduentSaveHomework(obj)
        .then((res) => {
          // alert(JSON.stringify(res));
          if (res.code == 200) {
            that.$toast("作业保存成功", 3000);
            that.isHomework = false;
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((ero) => {
          alert(JSON.stringify(ero));
        });
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
}
.answer-in {
  padding: 10px 0;
  margin-top: 10px;
  background: inherit;
}
</style>