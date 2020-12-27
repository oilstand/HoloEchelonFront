<template>
    <div class="desc-window">
        <div class="close-button"
            v-on:click="$emit('close',data)">x</div>
        <div class="description_wrapper">
            <div>{{ data.description }}</div>
        </div>
        <div class="resize-lb"
            style="left:0;bottom:0;"></div>
        <div class="resize-rb"
            style="right:0;bottom:0;"></div>

    </div>
</template>
<style scoped>
.desc-window {
    width:30%;
    height:400px;
    background-color:rgba(0,0,0,.8);
    font-size:0.8em;
    color:white;
}
.close-button {
    position:absolute;
    left:100%;
    top:0;
    width:20px;
    height:20px;
    line-height:20px;
    text-align:center;
    background-color:rgba(0,0,0,.4);
    cursor:pointer;
}
.description_wrapper {
    width:100%;
    height:calc(100% - 20px);
    overflow-y:scroll;
    oberflow-x:hidden;
}
.description_wrapper > div {
    white-space:pre-wrap;
    word-break:break-all;
    padding:8px;
}
.resize-lb,
.resize-rb {
    position:absolute;
    width:20px;
    height:20px;
    background-color:rgba(255,255,255,.4);
}
</style>
<script>

export default {
    data() {
        return {
        }
    },
    methods: {
    },
    computed: {
    },
    watch: {
    },
    components: {  },
    props: ['data'],
    mounted() {
    }
}
</script>

