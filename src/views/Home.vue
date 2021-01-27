<template>
  <div class="home">
   
    <div class="demo" style="width: 800px; height: auto; margin: 0 auto">
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
    </div>
       <div>
     <pdf ref="pdf" :src="url" v-if="url" @loaded="loadPdfHandler" :page="currentPage"
         @num-pages="pageCount=$event" 
         @page-loaded="currentPage=$event" 
     > </pdf>
        <p class="arrow">
    
    <a @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">Preview</a>
    {{currentPage}} / {{pageCount}}
   
    <a @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">Next</a>

    <button @click="downPDF">下载pdf</button>
    </p>
    </div>
    <p>{{message}}</p>

    <quill-editor 
            v-model="yourContent" 
            ref="myQuillEditor" 
            :options="editorOption" 
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
           >
        </quill-editor>
    
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";



import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import pdf from 'vue-pdf'
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";

import "vue-video-player/src/custom-theme.css";
import "videojs-flash"; // 如果是直播或者是视频流，注意需要引入这个模块
import {getCity} from '@/API/api';
export default {
  name: "Home",
  data() {
    return {
      passive:true,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: require("../assets/video.mp4"), // url地址
            //src:'http://192.168.1.167:8080/data/GH015432.MP4'
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
      url: "http://192.168.1.167:8888/data/test.pdf",//"/Vue.pdf",
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: "pdf", // 文件类型

      gklog: "", //视频观看时长
      yourContent: "",
      message:'欢迎来到这边',
      editorOption: {
         placeholder: "请在这里输入",
          modules:{
            toolbar:[
                      ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                      ['blockquote', 'code-block'],     //引用，代码块
                      [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                      [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                      [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                      [{ 'direction': 'rtl' }],             // 文本方向
                      [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                      [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                      [{ 'font': [] }],     //字体
                      [{ 'align': [] }],    //对齐方式
                      ['clean'],    //清除字体样式
                      ['image','video','link']    //上传图片、上传视频
                      ]
                  }
            }
    }
  },
  components: {
    //HelloWorld,
 
    videoPlayer,
    pdf,
    quillEditor
  },
  created(){
    getCity().then(res => {
      console.log(res)
    })
  },
  mounted(){
    let that = this;

    that.$toast('flkllk',2000)
    
  },
  methods: {
    videoPlay() {
      this.$refs.videoPlayer.player.play();
    },
    back() {
      let that = this;
      that.$router.go(-1);
    },

    // 播放回调
    onPlayerPlay(player) {
      console.log("player play!", player);
    },

    // 暂停回调
    onPlayerPause(player) {
      console.log("player pause!", player);
    },

    // 视频播完回调
    onPlayerEnded(player) {
      console.log(player);
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
      player.currentTime("20.18638");
      //console.log(player)
    },

    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      console.log(player)
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
      player.currentTime("20.18638");

      console.log("example player 1 readied", player);
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

    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 3; // 加载的时候先加载第一页
    },
    downPDF() {
				var url = this.url
				var tempLink = document.createElement("a");
				tempLink.style.display = "none";
        tempLink.href = url;
        //文件名让后台传
				tempLink.setAttribute("download", '213123');
				if (typeof tempLink.download === "undefined") {
					tempLink.setAttribute("target", "_blank");
				}
				document.body.appendChild(tempLink);
				tempLink.click();
				document.body.removeChild(tempLink);
				this.showBottom = false
    },
    onEditorReady(editor) { // 准备编辑器
      },
    onEditorBlur(){}, // 失去焦点事件
    onEditorFocus(){}, // 获得焦点事件
    onEditorChange(){}, // 内容改变事件
  },



};
</script>

<style lang="less" scoped>
div {
  .borderRadius(5px,5px,5px,5px);
}
</style>
