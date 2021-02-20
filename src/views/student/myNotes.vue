<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab">
        <div class="clearfix">
          <div class="fl">
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
            <a class="btnDefault pointer abtn" @click="click_delete">删除</a>
            <div class="d-serach">
              <input
                :placeholder="inplaceholder"
                type="text"
                autocomplete="off"
                v-model="searchRemark"
              />
              <a class="searchBtn pointer" @click="getNote(searchRemark)"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="notes_list">
        <ul class="ul-notes">
          <li v-for="(item, index) in notesList" :key="index">
            <span
              class="check"
              v-if="isShowCheck"
              @click="click_check(item.remark_id)"
              :class="{ checkh: selectNotes.indexOf(item.remark_id) != -1 }"
            ></span>
            <div class="name-box">
              <div class="d-name textline1">{{ item.title }}</div>
              <div class="d-time">{{ item.created_at }}</div>
            </div>
            <p class="intro">{{ item.content }}</p>
            <div class="link-courseware">
              <a
                class="pointer"
                v-if="item.type == 1"
                @click="click_showDetail(1, item)"
                >&lt;{{ item.courseware_name }}&gt;-&lt;第{{
                  item.remark_page
                }}页&gt;</a
              >
              <a
                class="pointer"
                v-if="item.type == 0"
                @click="click_showDetail(0, item)"
                >&lt;{{ item.courseware_name }}&gt;-&lt;观看时间：{{
                  item.remark_at
                }}&gt;</a
              >
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
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!--是否要删除-->
    <el-dialog :visible.sync="isDelete" width="600px">
      <div slot="title" class="dialog_header">请注意!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">{{ mess }}</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDel">确 认</a>
        <a
          class="btnDefault"
          @click="
            isDelete = false;
            isShowCheck = false;
          "
          >取 消</a
        >
      </div>
    </el-dialog>

    <!--视频弹出-->
    <div class="studetTrans" v-if="showvideo">
      <div class="studentMain">
        <div class="dis-table-cell">
          <div class="video_box" v-if="detailType == 0">
            <video-player
              @touchstart.passive="passive"
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :x5-playsinline="true"
              :webkit-playsinline="true"
              :options="playerOptions"
              @play="onPlayerPlay($event)"
              @pause="onPlayerPause($event)"
              @ended="onPlayerEnded($event)"
              @waiting="onPlayerWaiting($event)"
              @playing="onPlayerPlaying($event)"
              @loadeddata="onPlayerLoadeddata($event)"
              @timeupdate="onPlayerTimeupdate($event)"
              @canplay="onPlayerCanplay($event)"
              @canplaythrough="onPlayerCanplaythrough($event)"
              @statechanged="playerStateChanged($event)"
              @ready="playerReadied"
            >
            </video-player>
            <div class="name_box">
              <div class="name textline1">{{ momentMod.courseware_name }}</div>
              <a class="a_close pointer" @click="click_Hidevideo"></a>
            </div>
            <a class="a-record" @click.stop="click_record">
              <i></i>
              <span>记录笔记</span>
            </a>
          </div>
          <div class="video_box pdf_box" v-if="detailType == 1">
            <div class="pdf_name">
              {{ momentMod.courseware_name }}
              <a class="a_close pointer" @click="click_Hidevideo"></a>
            </div>
            <div class="pdf-main">
              <div class="p-main">
                <pdf
                  ref="pdf"
                  :src="url"
                  v-if="url"
                  @loaded="loadPdfHandler"
                  :page="currentPage"
                  @num-pages="pageCount = $event"
                  @page-loaded="currentPage = $event"
                >
                </pdf>
                <div class="pdf_info">
                  <div class="btn_box">
                    <a
                      @click="changePdfPage(0)"
                      class="pointer preve"
                      :class="{ grey: currentPage == 1 }"
                    ></a>
                    <a
                      @click="changePdfPage(1)"
                      class="pointer next"
                      :class="{ grey: currentPage == pageCount }"
                    ></a>
                  </div>
                  <a
                    class="pointer pdf_btnrecord"
                    @click="isRecordNotes = true"
                  ></a>
                  <p>{{ currentPage }} / {{ pageCount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--记录笔记-->
    <el-dialog
      :visible.sync="isRecordNotes"
      width="500px"
      class="dialog_record"
      @close="click_hideRecord"
    >
      <div slot="title" class="dialog_header">保存笔记</div>
      <div class="record_main">
        <p class="location" v-if="detailType == 1">
          已保存当前页数：{{ currentPage }}
        </p>
        <p class="location" v-if="detailType == 0">
          已保存当前视频时间：{{ location }}
        </p>

        <el-form>
          <el-form-item>
            <el-input
              v-model="titleText"
              type="text"
              placeholder="请输入笔记标题"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="contentText"
              type="textarea"
              :rows="5"
              placeholder="请输入该段笔记内容..."
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="submitNote">确 认</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//视频
import { videoPlayer } from "vue-video-player";

import "videojs-flash"; // 如果是直播或者是视频流，注意需要引入这个模块
import "video.js/dist/video.js";

import {
  student_getCourseList,
  getStudentsNotes,
  stduentUploadNotes,
  delete_remark,
} from "@/API/api";

//pdf
import pdf from "vue-pdf";
import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";

export default {
  data() {
    return {
      searchRemark: "",
      titleText: "",
      contentText: "",
      total: 0,
      perPage: 10, //用户列表每页条数
      curPage: 1,

      level1List: [],
      level1Name: "", //选中课程名称

      inplaceholder: "请输入笔记标题",

      notesList: [],
      isShowCheck: false,
      isDelete: false,
      selectNotes: [], //选中的笔记id列表
      mess: "",

      showvideo: false,
      passive: true,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: true, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "",
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      isRecordNotes: false, //记录笔记
      location: "",
      url: "/Vue.pdf", //"/Vue.pdf",
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      detailType: 0, //0---视频   1---文档
      jumpPage: 0,
      jumpTime: 0,
      momentMod: {},
    };
  },
  components: { videoPlayer, pdf },
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
  created() {
    let that = this;
    that.url = pdf.createLoadingTask(that.url);
    that.getCourse();
    that.getNote("");
  },

  methods: {
    //确认删除
    confirmDel() {
      let that = this;

      // that.selectNotes
      // alert(JSON.stringify(that.selectNotes));

      let obj = {};
      obj.remark_id_list = that.selectNotes;

      delete_remark(obj)
        .then((res) => {
          if (res.code == 200) {
            that.selectNotes = [];
            that.isShowCheck = false;
            that.getNote("");
            that.isDelete = false;
            that.$toast("删除成功！", 3000);
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    },
    //保存笔记
    submitNote() {
      let that = this;

      // alert(JSON.stringify(that.momentMod))
      let obj = {};
      obj.courseware_id = that.momentMod.courseware_id;
      obj.course_id = that.level1Name;
      obj.user_id = sessionStorage.getItem("userId");
      if (that.titleText == "") {
        return that.$toast("笔记标题不能为空", 3000);
      }

      if (that.contentText == "") {
        return that.$toast("笔记内容不能为空", 3000);
      }

      if (that.contentText.length > 200) {
        return that.$toast("笔记内容字数不能超过200", 3000);
      }

      obj.title = that.titleText;
      obj.content = that.contentText;

      if (that.detailType == 1) {
        obj.type = 1;
        obj.remark_page = that.currentPage;
      } else {
        obj.type = 0;
        obj.remark_at = that.location;
      }

      // alert(JSON.stringify(obj))
      stduentUploadNotes(obj)
        .then((res) => {
          if (res.code == 200) {
            // alert(JSON.stringify(res));
            that.titleText = "";
            that.contentText = "";
            that.getNote("");
            that.isRecordNotes = false;
            that.$toast("记录成功！", 3000);
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    },
    //获取笔记
    getNote(val) {
      let that = this;

      let obj = {};
      obj.per_page = 10;
      obj.page = that.curPage;
      obj.user_id = sessionStorage.getItem("userId");
      obj.course_id = that.level1Name;
      obj.title = val;

      getStudentsNotes(obj)
        .then((res) => {
          if (res.code == 200) {
            that.total = res.data.total;
            that.notesList = res.data.list;

            // alert(JSON.stringify(res));
          } else {
            that.$toast(res.message, 3000);
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
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
      that.getNote("");
    },
    //选择班级
    changeClass(val) {
      console.log("选择班级");
    },

    //选择课程
    changeLevel1(val) {
      let that = this;
      that.getNote("");
      that.selectNotes = [];
      that.isShowCheck = false;
    },

    //点击删除
    click_delete() {
      let that = this;
      if (!that.isShowCheck) {
        that.isShowCheck = true;
        that.selectNotes = [];
      } else {
        if (that.selectNotes.length == 0) {
          that.isShowCheck = false;
        } else {
          that.isDelete = true;
          that.mess = "确定要删除当前选中的笔记吗？";
        }
      }
      console.log(that.isShowCheck);
    },

    //点击选中
    click_check(id) {
      let that = this;

      if (that.selectNotes.length == 0) {
        that.selectNotes.push(id);
      } else {
        if (that.selectNotes.indexOf(id) != -1) {
          let index = that.selectNotes.indexOf(id);
          that.selectNotes.splice(index, 1);
        } else {
          that.selectNotes.push(id);
        }
      }
    },

    //点击查看视频
    click_showDetail(num, item) {
      let that = this;
      that.momentMod = item;
      that.showvideo = true;
      that.detailType = num;
      var mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", mo, false); //禁止页面滑动
      if (num == 0) {
        that.jumpTime = item.remark_at;
        that.$nextTick(function () {
          that.playerOptions.sources[0].src =
            that.$store.state.pic_Url + that.momentMod.url;
          that.videoPlay();
        });
      } else {
        that.jumpPage = item.remark_page;
        that.$nextTick(function () {
          that.url = this.pdfUrl = pdf.createLoadingTask({
            url: that.$store.state.pic_Url + that.momentMod.url,
            CMapReaderFactory,
          });
          that.loadPdfHandler();
        });
      }
    },

    //视频关闭
    click_Hidevideo() {
      let that = this;
      that.showvideo = false;
      var mo = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", mo, false);
    },

    //视频播放
    videoPlay() {
      this.$refs.videoPlayer.player.play();
    },

    //笔记记录
    click_record() {
      let that = this;
      that.isRecordNotes = true;
      this.$refs.videoPlayer.player.pause();
    },

    //关闭记录弹出框
    click_hideRecord() {
      let that = this;
      if (that.detailType == 0) {
        //表示当前记录的笔记是视频
        that.videoPlay();
      }
    },

    // 播放回调
    onPlayerPlay(player) {
      //console.log("player play!", player);
    },

    // 暂停回调
    onPlayerPause(player) {
      let that = this;
      that.location = player.currentTime();
      //console.log("player pause!", player);
    },

    // 视频播完回调
    onPlayerEnded(player) {
      //console.log(player);
    },

    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting(player) {
      // console.log(player)
    },

    // 已开始播放回调
    onPlayerPlaying(player) {
      // console.log(player)
    },

    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata(player) {
      player.currentTime(this.jumpTime);
      //console.log(player)
    },

    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      //console.log(player)
    },

    //媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },

    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },

    //播放状态改变回调
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
      //   player.currentTime("20.18638");
    },

    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = this.jumpPage; // 加载的时候先加载第一页
    },

    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--;
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
        // console.log(this.currentPage)
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/student.less);
@import url(../../assets/less/attachment.less);
</style>