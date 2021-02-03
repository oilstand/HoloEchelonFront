<template>
    <div
        class="overlay-window channel-videos-window"
        style="background-color:rgba(0,0,0,.8);">
        <ul class="channel-videos">
            <li
                class="video_holder"
                v-for="video in cVideoList"
                v-on:click="$nuxt.$emit('focus',video)"
                :key="`cv_${video.id}`"
                >
                <div class="video-thumbnail">
                    <img :src="video.thumbnails.high.url">
                </div>
                <h4>{{ video.title }}</h4>
                <p>{{ $formatDate(new Date(video.actualStartTime ? video.actualStartTime : video.scheduledStartTime), 'yyyy-MM-dd HH:mm:ss') }}</p>
            </li>
        </ul>
        <NuxtLink to="/channels" class="close-button">×</NuxtLink>
    </div>
</template>
<style scoped>
.overlay-window {
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
}
@media screen and (max-width:599px) {
}
@media screen and (min-width:600px) {
}
.close-button {
    display:block;
    text-decoration:none;
    color:black;
    width:50px;
    height:50px;
    position:absolute;
    right:30px;
    top:30px;
    border:solid 1px black;
    background-color:rgba(255,255,255,.3);
    text-align:center;
    line-height:50px;
    cursor:pointer;
}

.channel-videos {
    position:absolute;
    left:0;
    bottom:0;
    height:calc(100% - 52px);
    display:flex;
    flex-wrap:wrap;
    overflow-y: scroll;
    color:white;
}
.video_holder {
    display:flex;
    flex-wrap:wrap;
    cursor:pointer;
}
.video_holder > h4 {
    width:100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
@media screen and (max-width:599px) {
    .channel-videos {
        width:100%;
    }
    .video_holder {
        width:calc(50% - 16px);
        padding:8px;        
    }
    .video_holder > h4 {
        font-size:0.85em;
    }
    .video_holder > p {
        font-size:0.8em;
    }
}
@media screen and (min-width:600px) {
    .channel-videos {
        width:84%;
        padding:0 8%;
    }
    .video_holder {
        width:calc(20% - 32px);
        padding:16px;        
    }
    .video_holder > h4 {
        font-size:0.9em;
    }
}
.channel-videos-window {

}
.close-button {
    z-index:1;
    width:50px;
    height:50px;
    position:absolute;
    right:0;
    top:0;
    border:solid 1px black;
    background-color:rgba(255,255,255,.5);
    text-align:center;
    line-height:50px;
    cursor:pointer;
}
.video_holder:hover {
    background-color: rgba(255,255,255,.3);
}
.video-thumbnail {
    width:100%;
    padding-top:57%;
    overflow:hidden;
    position:relative;
}
.video-thumbnail > img {
    width:100%;
    position:absolute;
    left:0;
    top:50%;
    transform:translate(0,-50%);
}
</style>
<script>

export default {
    data() {
        return {
            cVideoList: []
        }
    },
    methods: {
    },
    computed: {
    },
    watch: {
    },
    components: {},
    async mounted() {
        let res;
        if(res = await this.$api.cRequest("channelVideos/"+this.$route.params.id, 60 * 15)) {
            if(res.data) {
                this.cVideoList = res.data;
            }
        }
    }
}
</script>

