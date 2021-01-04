<template>
    <div class="pagewrap">
        <comheader></comheader>
         <router-view/>
    </div>
</template>
<script>
import comheader from "@/components/header.vue";
export default {
    data(){
        return{

        }
    },
    components:{
        comheader
    },
    methods:{

    }
}
</script>