<template>
  <div id="xterm" class="xterm" />
</template>

<script>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
let that = this;
export default {
  name: "Xterm",
  data() {
    return {
      socket: null,
      term: null,
    };
  },
  props: {
    socketURI: {
      type: String,
      default: "",
    },
  },

  watch: {
    socketURI: {
      handler(val, olVal) {
       
        this.socket = null;
        this.term = null;
        this.initSocket();
      },
      
    },
  },

  mounted() {
    this.initSocket();
  },
  beforeDestroy() {
    this.socket.close();
    this.term.dispose();
  },
  methods: {
    close() {
      this.socket.close();
      this.term.dispose();
    },
    initTerm() {
      const term = new Terminal({
        fontSize: 14,
        cursorBlink: true,
      });
      const attachAddon = new AttachAddon(this.socket);
      const fitAddon = new FitAddon();
      term.loadAddon(attachAddon);
      term.loadAddon(fitAddon);
      term.open(document.getElementById("xterm"));
      fitAddon.fit();
      term.focus();
      this.term = term;
    },
    initSocket() {
     
      this.socket = new WebSocket(this.socketURI);
      this.socketOnClose();
      this.socketOnOpen();
      this.socketOnError();
    },
    socketOnOpen() {
      this.socket.onopen = () => {
        // 链接成功后
        this.initTerm();
      };
    },
    socketOnClose() {
      this.socket.onclose = () => {
        // console.log('close socket')
      };
    },
    socketOnError() {
      this.socket.onerror = () => {
        // console.log('socket 链接失败')
      };
    },
  },
};
</script>

<style lang="less" scoped>
.xterm {
  width: 100%;
  height: 100%;
}
</style>
