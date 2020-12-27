<template>
    <div class="wipe-window"
        v-on:mousedown.stop="move_mode = 1"
        v-on:mouseup.stop="move_mode = 0">

        <div class="close-button"
            v-on:click="$emit('close', wipe)">x</div>
        <div class="play-button"
            v-on:click="$emit('play', wipe)">▶</div>
        <div class="info-button"
            v-on:click="dispInfo = !dispInfo">i</div>

        <YouTubeIFrame :vid="wipe.id" autoplay="1" mute="1" style="width:100%;height:100%;" />

        <div class="move-mask"
            v-on:mousedown.stop="move_mode = 1"
            v-on:mouseup.stop="move_mode = 0"
            :style="`${move_mode == 1 ? 'width:100%;height:100%;':'width:0;height:0;'}`" />

        <div class="resize-lb"
            v-on:mousedown.stop="resize_mode = 1"
            v-on:mouseup.stop="resize_mode = 0"
            :style="`${resize_mode == 1 ? 'width:100%;height:100%;':''}`" />

        <div v-show="dispInfo" class="wipe-infomation">
            <h4>{{ wipe.title }}</h4>
            <div>
                <div>{{ wipe.description }}</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.wipe-window {
    background-color:rgba(0,0,0,.4);
    padding:16px;
}
.info-button,
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
.info-button {
    top:60px;
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
.wipe-infomation {
    position:absolute;
    top:100%;
    left:0;
    width:100%;
    height:100%;
    overflow:hidden;
    background-color:rgba(0,0,0,.8);
    color:white;
}
.wipe-infomation > h4 {
    font-size: 0.9em;
    line-height:1.5em;
    min-height:3em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.wipe-infomation > div {
    overflow-y: scroll;
    height: calc(100% - 2.7em);
}
.wipe-infomation > div > div {
    word-break: break-all;
    white-space: pre-wrap;
    font-size: 0.8em;
    padding: 8px 28px 8px 12px;
}
</style>
<script>
import YouTubeIFrame from '~/components/YouTubeIFrame.vue'

export default {
    data() {
        return {
            resize_mode: false,
            move_mode: false,
            dispInfo: false
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

