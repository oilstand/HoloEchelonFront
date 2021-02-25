<template>
    <div
        class="overlay-window channel-videos-window"
        style="background-color:rgba(0,0,0,.8);">
        <div class="channel-info">
            <h1>{{ channelTitle }}</h1>
            <a v-if="channelLink != '#'" :href="channelLink" target="_blank">YouTube Channel</a>
            <a v-if="twitterLink != '#'" :href="twitterLink" target="_blank">
                <img src="~/assets/twitter_logo.svg" style="width:24px;height:24px;vertical-align: bottom;">
            </a>
            <NuxtLink :to="`/channel/${channelId}/calendar`">
                カレンダー
            </NuxtLink>
        </div>
        <ul class="channel-videos" v-on:scroll="handleOnScroll">
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
        <div v-if="loading" style="position:absolute;width:100%;height:100%;left:0;top:0;background-color:rgba(0,0,0,.3);display: flex;align-items: center;justify-content: center;">
            <div class="loader">Loading...</div>
        </div>
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
.channel-info {
    height:80px;
}
.channel-info h1 {
    color:#f3f3f3;
}
.channel-info a {
    color:#f3f3f3;
    font-weight:bold;
}
.channel-info a:hover {
    color:lightpink;
}
@media screen and (max-width:599px) {
}
@media screen and (min-width:600px) {
}

.channel-videos {
    position:absolute;
    left:0;
    bottom:0;
    height:calc(100% - 80px);
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
    .channel-info {
        width:100%;
    }
    .channel-info h1 {
        font-size:1.2em;
    }
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
    .channel-info {
        margin:0 8%;
        padding:0 16px;
    }
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
    right:50px;
    top:50px;
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
    head() {
        return {
            htmlAttrs: {
                lang: 'ja'
            },
            title: `${this.pageTitle}`,
            meta: [
                { hid: 'description', name: 'description', content: `ホロライブの配信スケジュールをチェック！切り抜き動画のチェックや複窓再生もできます。` },
                { hid: 'keywords', name: 'keywords', content: 'ホロライブ,配信スケジュール,複窓ツール,VTuber,切り抜き動画' },
                { hid: 'og:site_name', property: 'og:site_name', content: 'HoloEchelon ホロライブスケジュール' },
                { hid: 'og:type', property: 'og:type', content: 'website' },
                { hid: 'og:url', property: 'og:url', content: 'https://holoechelon.com/' + this.$nuxt.$route.path },
                { hid: 'og:title', property: 'og:title', content: `${this.pageTitle}| HoloEchelon ホロライブスケジュール` },
                { hid: 'og:description', property: 'og:description', content: 'ホロライブの配信スケジュールをチェック！切り抜き動画のチェックや複窓再生もできます。' },
                { name: 'twitter:card', content: 'summary' }
            ],
        }
    },
    data() {
        return {
            channelList: [],
            channel: null,
            cVideoList: [],
            page: 0,
            loading: false,
            stop:false
        }
    },
    methods: {
        async handleOnScroll() {
            let [tmpelm] = document.getElementsByClassName('channel-videos');
            console.log(tmpelm.scrollHeight,tmpelm.scrollTop, tmpelm.clientHeight);
            //let tlWrapper = tmpelm.parentNode;

            if(tmpelm.scrollHeight == (tmpelm.scrollTop + tmpelm.clientHeight) && this.cVideoList.length % 50 == 0 && !this.stop) {
                if(this.loading)return;

                this.loading = true;

                this.page++;
                let res;
                if(res = await this.$api.cRequest("channelVideos/"+this.$route.params.id+'?page='+this.page, 60 * 15)) {
                    if(res.data && res.data.length != 0) {
                        this.cVideoList.push(...res.data);
                    } else {
                        this.stop = true;
                    }
                } else {
                    this.stop = true;
                }
                this.loading = false;

            } else {

            }
        }
    },
    computed: {
        channelTitle() {
            return this.channel === null
                    ? 'Loading...' 
                    : this.channel === -1
                        ? 'Channel Not Found'
                        : this.channel.title;
        },
        pageTitle() {
            return this.channel === null || this.channel === -1
                    ? 'Channel Videos ' 
                    : `${this.channel.title} Videos `;
        },
        channelLink() {
            return this.channel != null && this.channel != -1 ? 'https://www.youtube.com/channel/'+this.channel.id : '#';
        },
        twitterLink() {
            return this.channel != null && this.channel != -1 && this.channel.twitter ? 'https://twitter.com/'+this.channel.twitter : '#';
        },
        channelId() {
            return this.channel ? this.channel.id : 'undefined';
        }
    },
    watch: {
    },
    components: {},
    async mounted() {

        this.loading = true;
        let res;
        if(res = await this.$api.cRequest("channelVideos/"+this.$route.params.id, 60 * 15)) {
            if(res.data) {
                this.cVideoList = res.data;
            }
        }
        if(res = await this.$api.cRequest("channelList", 60 * 15)) {
            if(res.data) {
                this.channelList = res.data;
                for(let channel of this.channelList) {
                    if(channel.id === this.$route.params.id) {
                        this.channel = channel;
                        break;
                    }
                }
            }
        }
        if(this.channel === null) {
            this.channel = -1;
        }
        this.loading = false;
    }
}
</script>

