<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab">
        <div class="clearfix">
          <div class="fl">
            <div class="sel-box">
              <el-select
                v-model="state"
                value-key="id"
                placeholder="请选择状态"
                @change="changeState"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>

            <!-- <div class="stSelTime" v-if="state.id == 1">
              <el-date-picker
                v-model="value2"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="changeDate"
                value-format=" yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div> -->
            <div class="sel-box" style="width:350px">
 <el-date-picker 
                            class="pageTab_date"
                            v-if="state.id==1"
                            v-model="value2"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                             @change="changeDate"
                             value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                            >
                        </el-date-picker>
              </div>
            <div class="sel-box">
              <el-select
                v-model="level1Name"
                value-key="id"
                placeholder="课程"
                @change="changeLevel1"
              >
                <el-option
                  v-for="item in level1List"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="fr">
            <div class="d-serach">
              <input v-model="searchText" :placeholder="inplaceholder" type="text" autocomplete="off" v-emoji />
              <a class="searchBtn pointer" @click="searchAction"></a>
            </div>
          </div>
        </div>
      </div>
             <noData :noDataType="noDataType" :dataMess="dataMess" v-if="!hasData"></noData>
               <template v-if="hasData">
      <div class="container">
        <div class="tea_list">
          <ul class="tab_box">
            <li v-for="(item, index) in jobList" :key="index">
              <div class="d1 d15">
                <!-- <div class="cell pnum">{{ (index + 1) | catIndex }}</div> -->
                 <div class="cell textline1">班级：{{item.className}}</div>
              </div>
              <div class="d2 d28">
                <div class="cell textline1">
                  学号：{{ item.userId }} 姓名：{{ item.userName }}
                </div>
              </div>
              <div class="d3 d30">
                <div class="cell">提交时间：{{ item.committedAt | dateFormatYMDhms}}</div>
              </div>
              <div class="d4 d14">
                <div class="cell">
                  {{ item.status == 0 ? "待批阅" : "已批阅" }}
                </div>
              </div>
              <div class="d5 d13">
                <div class="cell">
                  <a
                    class="btnDefault btn_py pointer"
                    v-if="item.status == 0"
                    @click="showDetail(0, item)"
                    >批阅</a
                  >
                  <a
                    class="btnDefault btn_py pointer"
                    v-if="item.status == 1"
                    @click="showDetail(1, item)"
                    >查看详情</a
                  >
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
              :total="allJob_Nub"
            >
            </el-pagination>
          </div>
        </div>
      </div>
         </template>
    </div>

    <!--点击确定按钮弹出确认框-->
    <el-dialog :visible.sync="isCorrectJob" width="600px" top="250px">
      <div slot="title" class="dialog_header"></div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <!--成功span的class为icon_success-->
          <span class="span_icon icon_success">是否已经批阅完成？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="submit()">确 认</a>
        <a class="btnDefault" @click="isCorrectJob = false">取 消</a>
      </div>
    </el-dialog>

    <el-dialog
      v-if="momentJobMod"
      width="1100px"
      :visible.sync="isHomework"
      class="report_detail_dialog"
    >
      <div slot="title" class="dialog_header">
        {{ momentJobMod.assignmentName }}(作业)---{{
          momentJobMod.userName
        }}提交
      </div>
      <div class="reportMain course_list">
        <ul class="choice_question">
          <li
            class="li_choose"
            v-for="(item, index) in all_courseList"
            :key="index"
          >
            <div class="title">
              {{ index + 1 }}.{{ item.content
              }}<span class="colorRed"
                >（本题分数：{{ item.totalScore }}分）</span
              >
            </div>
            <div class="pic" v-if="item.picUrl">
              <span><img :src="pic_Url + item.picUrl" /></span>
            </div>
            <p class="answer_box" v-if="item.type == 0">
              <span
                class="s_radio"
                :class="{ s_radio_answer: iitem == item.studentAnswer }"
                v-for="(iitem, iindex) in JSON.parse(item.choice)"
                :key="iindex"
              >
                {{ iitem }}
              </span>
            </p>
            <p class="answer_box Short-answer p_text" v-if="item.type == 1">
              作答：{{ item.studentAnswer }}
            </p>
            <p
              class="answer_box colorRed p_correct_text"
              v-if="item.type == 1 || item.studentAnswer != item.answer"
            >
              正确答案：{{ item.answer }}
            </p>
            <div class="score_box" v-if="item.type == 1">
              本题分数：<span v-if="isReport_num == 1">{{ item.score }}分</span>
              <div class="din">
                <input
                  @input="changeScore(item)"
                  oninput="value=value.replace(/[^\d]/g, '')"
                  v-if="isReport_num == 0"
                  type="text"
                  v-model="item.score"
                  placeholder="请输入本题分数"
                />
              </div>
            </div>
            <!--选中的状态添加class   li_radio_h-->
            <span
              class="li_radio"
              v-if="item.type == 0"
              :class="{
                li_radio_correct: item.studentAnswer == item.answer,
                li_radio_error: item.studentAnswer != item.answer,
              }"
            ></span>
          </li>
        </ul>
      </div>
      <div class="report_detail_btnbox" v-if="isReport_num == 0">
        <a class="pointer btnDefault" @click="correctJob()">确认</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import noData from '@/components/noData.vue'
import {
  getCourseListNoNameByUserId,
  getStudentJobList,
  getStudentJobDetail,
  submitCorrectJob,
} from "@/API/api";

export default {
  data() {
    return {
      value2: [],
      isCorrectJob: false,
      allJob_Nub: 0,
      searchText: "",
      perPage: 10, //用户列表每页条数
      curPage: 1,
      jobList: [],

      stateList: [
        { label: "全部", id: "-1" },
        { label: "待批阅", id: "0" },
        { label: "已批阅", id: "1" },
      ], //作业状态list
      state: {}, //作业选中对象

      level1List: [],
      level1Name: {}, //选中课程对象

      inplaceholder: "请输入学号/姓名",

      isHomework: false,
      isReport_num: 0,
      //全部题目
      all_courseList: [],
      momentJobMod: null,
      pic_Url: "",
      noDataType:1,  //没有数据展示的样式
      dataMess:'当前暂无作业',
      hasData:false,
      timestart:'',//筛选起始时间
      timeend:'',//筛选结束时间
      pickerOptions: {
          
        },
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
    components:{noData},
  mounted() {
    let that = this;
    that.pic_Url = that.$store.state.pic_Url;
  },
  created() {
    let that = this;
    that.state = that.stateList[0];
    that.getCourseListNoNameByUserId();
    that.getStudentJobList(0);
  },
  methods: {
    changeDate(val) {
      let that = this;
      if (val==null) {
              that.timestart = '';
      that.timeend = '';
      }else {
      that.timestart = val[0];
      that.timeend = val[1];
      }

      that.getStudentJobList(0)
      console.log(val) 
      // alert(that.value2.length);
    },
    //底部分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      let that = this;
      that.curPage = val;
      that.getStudentJobList(0);
    },

    //选择状态
    changeState(val) {
      let that = this;
      that.timestart = "";
      that.timeend = "";
      that.value2 = [];
      that.getStudentJobList(0);

    },
    //选择课程
    changeLevel1(val) {
      let that = this;

      that.getStudentJobList(0);
    },

    //显示选择作业
    showDetail(num, item) {
      let that = this;
      that.isHomework = true;
      that.isReport_num = num;
      that.momentJobMod = item;
      that.getStudentJobDetail(item);
    },
    //搜索事件
    searchAction() {
      let that = this;
      that.getStudentJobList(1);
    },
    //批改分数
    changeScore(val) {
      let that = this;

      if (val.score < 0) {
        val.score = 0;
        return that.$toast("分数不能小于0", 3000);
      }
      if (val.score > val.totalScore) {
        val.score = 0;
        return that.$toast("分数不能大于" + val.totalScore, 3000);
      }
    },
    correctJob() {
      let that = this;
      that.isCorrectJob = true;
    },
    //提交批改
    submit() {
      let that = this;
      let obj = {};
      let answerArr = [];
      for (var i = 0; i < that.all_courseList.length; i++) {
        let tmpDic = that.all_courseList[i];
        let dic = {};
        dic.question_id = tmpDic.id;
        dic.assignment_id = that.momentJobMod.assignmentId;
        dic.user_id = that.momentJobMod.userId;
        if (tmpDic.type == 0) {
          if (tmpDic.studentAnswer == tmpDic.answer) {
            dic.score = tmpDic.totalScore;
          } else {
            dic.score = 0;
          }
        } else {
          dic.score = tmpDic.score;
        }
        answerArr.push(dic);
      }
      // obj.student_score_list = JSON.stringify(answerArr);
      obj.student_score_list = answerArr;

// alert(JSON.stringify(obj));
      submitCorrectJob(obj)
        .then((res) => {
          console.log(JSON.stringify(res));
          if (res.code == 200) {
            that.isHomework = false;
            that.isCorrectJob = false;
            that.getStudentJobList(0);
            that.$toast("作业批改成功", 3000);
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((error) => {
          // alert(JSON.stringify(error));
        });
    },

    //课程列表
    getCourseListNoNameByUserId(val) {
      let that = this;
      let obj = {};
      obj.per_page = 100;
      obj.page = 1;
      obj.user_id = sessionStorage.getItem("userId");
      obj.name = "";
      getCourseListNoNameByUserId(obj).then((res) => {
        // alert(JSON.stringify(res));
        if (res.code == 200) {
          that.level1List = res.data.list;
        } else {
          that.$toast(res.message, 3000);
        }
      });
    },
    //获取作业详情
    getStudentJobDetail(val) {
      let that = this;
      let obj = {};
      obj.perPage = 100;
      obj.page = 1;
      obj.userId = val.userId;
      obj.assignmentId = val.assignmentId;

      getStudentJobDetail(obj).then((res) => {
        console.log(JSON.stringify(res));
        if (res.code == 200) {
          that.all_courseList = res.data.list;
        } else {
          that.$toast(res.message, 3000);
        }
      });
    },
    //获取作业列表
    getStudentJobList(val) {
      let that = this;
      let obj = {};
      obj.perPage = that.perPage;
      obj.page = that.curPage;
      obj.name = that.searchText;
      obj.classId = "";
      obj.courseId = JSON.stringify(that.level1Name) != "{}" ? that.level1Name.id : "";
      obj.chapterId = "";
      obj.sectionId = "";

      if (that.state.id == "-1") {
        obj.status = "";
      } else {
        obj.status = that.state.id;
      }
      obj.startTime =that.timestart;
      obj.endTime = that.timeend;
      obj.ownerId = sessionStorage.getItem("userId")

      // alert(JSON.stringify(obj));
      console.log(obj)
      getStudentJobList(obj)
        .then((res) => {
          // alert(JSON.stringify(res));
          that.allJob_Nub = res.data.total;
          if (res.code == 200) {
            that.jobList = res.data.list;
             that.hasData=res.data.list.length==0?false:true
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((error) => {
          // alert(JSON.stringify(error));
        });
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/coursework.less);
.reportMain {
  padding: 20px 20px 40px 20px;
  border: 1px solid @border;
  .borderRadius(5px,5px,5px,5px);
  -moz-box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04);
  -webkit-box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04);
  box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04);

  .pic {
    background: #fff;
  }
}
.report_detail_btnbox {
  a {
    vertical-align: middle;
    margin-left: 20px;
  }
}

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

  .score_box {
    .din {
      display: inline-block;
      vertical-align: middle;
    }
    input {
      width: 80px;
      text-align: center;
      height: 30px;
      line-height: 30px;
    }
    .abtn {
      display: inline-block;
      width: 28px;
      height: 28px;
      line-height: 30px;
      font-size: 16px;
      color: #000;
      text-align: center;
      vertical-align: top;
      border: 1px solid @border;
      background: #fff;
      margin: 0 8px;
      .borderRadius(5px,5px,5px,5px);
    }
    .a_increase {
      background: url(../../assets/img/quest_add.png) center no-repeat;
      background-size: 14px 14px;
      -webkit-background-size: 14px 14px;
    }
    .a_reduce {
      background: url(../../assets/img/quest_reduce.png) center no-repeat;
      background-size: 14px 14px;
      -webkit-background-size: 14px 14px;
    }
  }
}
.report_detail_btnbox {
  text-align: center;
  padding-top: 20px;
}
</style>