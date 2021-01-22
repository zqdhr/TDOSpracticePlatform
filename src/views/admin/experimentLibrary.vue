<template>
<div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
          <div class="sel-box">
            <el-select v-model="customClass" placeholder="自定义分类" @change="selectType" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>
          <div class="sel-box" v-if="customClass!=''">
            <el-select v-model="i_customClass" placeholder="自定义分类" @change="selectType1" >
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>

           <div class="sel-box" v-if="i_customClass!=''">
            <el-select v-model="ii_customClass" placeholder="自定义分类" @change="selectType2" >
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>
          
        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn"  @click="click_new">新增实验</a>
          
          
          <div class="d-serach"> 
            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
            <a class="searchBtn pointer"></a>
          </div>
        </div>
      </div>
    </div>

    <div class="experimentLibrary_box">
        <div class="container">
            <div class="list_box">
                <ul class="list_ul clearfix">
                    <li v-for="(item,index) in experimentList" :key="index">
                        <div class="info boxShadow">
                           
                            <!--
                            <el-tooltip class="item" effect="dark" content="设置" placement="top">
                                <a class="icon icon_set pointer"></a>
                            </el-tooltip>
                            -->
                            <div class="pic">
                                <div class="pic_box"><img src="../../assets/pic/course.png"/><div class="trans"></div></div>
                            </div>
                            <p class="p-text textline1">{{item.name}}</p>
                             <p class="p-text textline1">虚拟机{{item.num}}台</p>
                            <p class="p-text textline1">实验时长：{{item.duration}}</p>
                             <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <a class="icon icon_close pointer" @click="isDelete=true"></a>
                            </el-tooltip>
                           
                        </div>
                    </li>
                </ul>
            </div>
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
    <!--删除实验弹出框-->
    <el-dialog :visible.sync="isDelete" width="600">
      <div slot="title" class="dialog_header">请注意!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前实验吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteExper">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>
    <newExperiment  ref="newExperiment"></newExperiment>
</div>
</template>
<script>
import newExperiment from '@/components/admin_new_experiment'
export default {
    data(){
        return{
            inplaceholder:'请输入实验名称',
            customClass:'',//自定义分类
            i_customClass:'',//自定义分类,
            ii_customClass:'',//自定义分类
            options:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options1:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options2:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            total:100,//总共条数
            perPage:10,//每页页数
            curPage:1,//当前页
            experimentList:[
               {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'},
               {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'},
               {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'},
               {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'},
               {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'},
               {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'},
               {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'},
               {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'},
            ],
            isDelete:false,//删除实验弹出框
            isNewExperiment:false,
        }
    },
    components:{newExperiment},
    methods:{

        //自定义分类
        selectType(val){

        },
        //自定义分类
        selectType1(val){

        },
        //自定义分类
        selectType2(val){

        },
         //底部分页
        handleCurrentChange(val) {
        let that = this;
       
        console.log(`当前页: ${val}`);
        },

        //实验确认删除
        confirmDeleteExper(){
            let that = this;
            that.isDelete = false;
        },
        //点击新增实验
        click_new(){
          let that = this;
          that.isNewExperiment = true;
          that.$refs.newExperiment.click_new();

        }
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);

</style>