<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab">
        <div class="clearfix">
          <div class="fl">
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
          </div>

          <div class="fr">
            <div class="d-serach">
              <input
                :placeholder="inplaceholder"
                type="text"
                autocomplete="off"
                v-model="searchText"
                maxlength="25"
                v-emoji
                @keyup.enter="click_search"
              />
              <a class="searchBtn pointer" @click="click_search"></a>
            </div>
          </div>
        </div>
      </div>
      <noData
        :noDataType="noDataType"
        :dataMess="dataMess"
        v-if="!hasData"
      ></noData>
      <template v-if="hasData">
        <div class="tea_list">
          <ul class="tab_box courseList_ul lp_courseList_ul">
            <li v-for="(item, index) in courseList" :key="index">
              <div class="pic">
                <img :src="item.pic_url"/>
              </div>
              <div class="course-info boxsizing">
                <div class="info_box">
                  <div class="cell-info boxsizing">
                    <p class="p-name textline1">{{ item.name }}</p>
                    <p class="p-text textline1">
                      共有{{ item.chapter_number }}个章节，共{{
                        item.small_section_number
                      }}个知识点
                    </p>
                    <p class="p-text textline1">
                      课程简介：{{ item.introduction }}
                    </p>
                    <div class="data-box">
                      <span class="s-time"
                        >课程时间：{{
                          item.start_at != null && item.end_at != null
                            ? item.start_at.replace("T", " ") +
                              "-" +
                              item.end_at.replace("T", " ")
                            : "暂未设置时间"
                        }}</span
                      >
                      <span class="s-number"
                        >参与人数：共有{{
                          item.numbers == null ? "0" : item.numbers
                        }}人参加该门课程</span
                      >
                    </div>
                  </div>
                  <div class="cell-fun boxsizing">
                    <a
                      class="btnDefault btn-fun pointer"
                      @click="linkDetail(item.id)"
                      >查看详情</a
                    >
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="tab-pagination">
          <el-pagination
            background
            :current-page="dataObj.page"
            :page-size="dataObj.per_page"
            @current-change="handleCurrentChange"
            layout="prev, pager, next,jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import noData from "@/components/noData.vue";
import { student_getCourseList } from "@/API/api";

export default {
  data() {
    return {
      inplaceholder: "请输入课程名称",
      courseList: [],

      searchText: "",
      pickerOptions: {},

      value2: "",
      noDataType: 1, //没有数据展示的样式
      dataMess: "当前暂无课程列表",
      hasData: true,

      total: 1,

      dataObj:{
         user_id:'',
         per_page:8, //每页条数
         page:1, //当前页
         start:'', //开始时间
         end:'', //结束时间
         name:'' //搜索关键词
      }
    }
  },
  components: { noData },
  created() {
    let that = this;
    that.dataObj.user_id = sessionStorage.getItem("userId");
    that.getDataList();
  },
  methods: {
    //底部分页
    handleCurrentChange(val) {
      let that = this;
      that.dataObj.page = val
      that.getDataList();

    },
    //查看详情
    linkDetail(id) {
      let that = this;
     // id="13d0567f-a196-43ab-a7ac-d72f5b2915e5"
      that.$router
        .push({ path: "/student/courseDetail", query: { courseId: id } })
        .catch((err) => {});
    },
    changeDate(val) {
      let that = this;

      if (val != null && val != undefined) {
        that.dataObj.start = val[0];
        that.dataObj.end = val[1];
      } else {
         that.dataObj.start = "";
         that.dataObj.end = "";
      }
      that.getDataList();
    },
    //搜索
    click_search() {
      let that = this;
      let obj = {};
      that.dataObj.name = that.searchText;

      that.getDataList();
    },
    //获取我的课程列表
    getDataList() {
      let that = this;
      student_getCourseList(that.dataObj).then((res) => {
          //console.log(res.data)
        if (res.code == 200) {
          that.courseList = res.data.list;
          that.total = res.data.total;
             for (let index = 0; index <  that.courseList.length; index++) {
                        that.courseList[index].pic_url = that.$store.state.pic_Url+ that.courseList[index].pic_url
                    }
          if (res.data.list.length == 0) {
            that.hasData = false;
          } else {
            that.hasData = true;
          }
        } else {
          this.$toast(res.message, 3000);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>
