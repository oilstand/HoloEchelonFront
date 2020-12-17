<template>
    <div class="video-player-main">
        <div class="player-control-bar">
            <button
                v-on:click="$emit('close')"
                >close</button>
            <button
                v-on:click="$emit('close'),$emit('wipe',data)"
                >wipe</button>
        </div>
        <YouTubeIFrame
            class="player-video-iframe"
            :vid="videoId"
            autoplay="1" mute="0"
            :style="`width:${videoWidth};`" />
        <iframe
            class="player-chat-iframe"
            v-if="displayChat"
            :src="`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}&embed_domain=${siteHostName}`"
            :style="`width:${chatWidth};`"></iframe>
    </div>
</template>
<style scoped>
.video-player-main {
    display:flex;
    flex-wrap:wrap;
    background-color:gray;
}
.player-control-bar {
    width:100%;
    height:60px;
}
.player-control-bar button {
    height:60px;
    border:0;
}
.player-chat-iframe {
    height:calc(100% - 60px);
    border:0;
}
.player-video-iframe {
    height:calc(100% - 60px);
}
</style>
<script>
import YouTubeIFrame from '~/components/YouTubeIFrame.vue'

export default {
    data() {
        return {
        }
    },
    methods: {
    },
    computed: {
        videoId() {
            return this.data && this.data.id ? this.data.id : '';
        },
        siteHostName() {
            if(!process.server) {
                return window.location.hostname;
            }
            return 'holoechelon.com';
        },
        videoWidth() {
            return this.displayChat ? '70%':'100%' 
        },
        chatWidth() {
            return this.displayChat ? '30%':'0' 
        },
        displayChat() {
            return this.data.liveBroadcastContent == 'live';
        }
    },
    watch: {
    },
    components: { YouTubeIFrame },
    props: ['data'],
    mounted() {
    }
}
</script>

