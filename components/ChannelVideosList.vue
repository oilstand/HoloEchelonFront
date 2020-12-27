<template>
    <div class="channel-videos-window">
        <ul class="channel-videos">
            <li
                class="video_holder"
                v-for="video in cVideoList"
                v-on:click="$emit('wipe', video)"
                :key="`cv_${video.id}`"
                >
                <div class="video-thumbnail">
                    <img :src="video.thumbnails.high.url">
                </div>
                <h4>{{ video.title }}</h4>
                <p>{{ $formatDate(new Date(video.actualStartTime ? video.actualStartTime : video.scheduledStartTime), 'yyyy-MM-dd HH:mm:ss') }}</p>
            </li>
        </ul>
        <div class="close-button"
            v-on:click="$emit('close')"
            >x
        </div>
    </div>
</template>
<style scoped>
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
.channel-videos {
    position:absolute;
    left:0;
    bottom:0;
    width:84%;
    height:calc(100% - 52px);
    display:flex;
    flex-wrap:wrap;
    overflow-y: scroll;
    color:white;
    padding:0 8%;
}
.video_holder {
    width:calc(20% - 32px);
    padding:16px;
    display:flex;
    flex-wrap:wrap;
    cursor:pointer;
}
.video_holder:hover {
    background-color: rgba(255,255,255,.3);
}
.video_holder > h4 {
    width:100%;
    font-size:0.9em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
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
    components: {  },
    props: ['cId'],
    async mounted() {
        let res = await this.$api.request("channelVideos/"+this.cId)
            .then(res => { return res.data; });
        if(res && res.data) {
            this.cVideoList = res.data;
        }
    }
}
</script>

