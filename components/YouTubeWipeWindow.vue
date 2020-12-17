<template>
    <div class="wipe-window"
        v-on:mousedown.stop="move_mode = 1"
        v-on:mouseup.stop="move_mode = 0">

        <div class="close-button"
            v-on:click="$emit('close', wipe)">x</div>
        <div class="play-button"
            v-on:click="$emit('play', wipe)">▶</div>

        <YouTubeIFrame :vid="wipe" autoplay="1" mute="1" style="width:100%;height:100%;" />

        <div class="move-mask"
            v-on:mousedown.stop="move_mode = 1"
            v-on:mouseup.stop="move_mode = 0"
            :style="`${move_mode == 1 ? 'width:100%;height:100%;':'width:0;height:0;'}`" />

        <div class="resize-lb"
            v-on:mousedown.stop="resize_mode = 1"
            v-on:mouseup.stop="resize_mode = 0"
            :style="`${resize_mode == 1 ? 'width:100%;height:100%;':''}`" />
    </div>
</template>
<style scoped>
.wipe-window {
    background-color:rgba(0,0,0,.4);
    padding:16px;
}
.play-button,
.close-button {
    position:absolute;
    width:30px;height:30px;
    left:100%;top:0;
    line-height:30px;
    text-align:center;
    background-color:gray;
    color:white;
    font-weight:bold;
    cursor:pointer;
}
.play-button {
    top:30px;
}
.move-mask {
    position:absolute;
    background-color:rgba(0,0,0,.4);
    left:0;top:0;
}
.resize-lb {
    position:absolute;
    width:16px;
    height:16px;
    left:0;
    bottom:0;
    background-color:rgba(0,0,0,.4);
}
</style>
<script>
import YouTubeIFrame from '~/components/YouTubeIFrame.vue'

export default {
    data() {
        return {
            resize_mode: false,
            move_mode: false
        }
    },
    methods: {
    },
    computed: {
    },
    watch: {
    },
    components: { YouTubeIFrame },
    props: ['wipe'],
    mounted() {
    }
}
</script>

