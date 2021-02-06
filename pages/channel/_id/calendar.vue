<template>
    <div
        class="overlay-window"
        style="background-color:rgba(0,0,0,.8);">
        <div class="calendar-info">
            <h2>
                <NuxtLink :to="`/channel/${channelId}`">
                    {{ `${year}年${month + 1}月 ${channelTitle}` }}
                </NuxtLink>
            </h2>
            <div class="calendar_navigation">
                <div class="prev" v-on:click="prev">&lt;&lt; prev</div>
                <div class="next" v-on:click="next">next&gt; &gt;</div>
            </div>
        </div>
        <ul class="calendar">
            <li
                v-for="cell in cells"
                :key="`cell_${year}_${cell.date}`"
                :class="cell.current"
                :style="`margin-left:calc(100% / 7 * ${cell.offset});`">

                
                {{ cell.date }}
                <ul class="video-list" v-if="cell.videos">
                    <li
                        v-for="video of cell.videos"
                        :key="video.id"
                        v-on:click="$nuxt.$emit('focus',video)"
                        >{{ `${video.displayTime}- ${video.title}` }}</li>
                </ul>
                
            </li>
        </ul>
    </div>
</template>
<style scoped>
.calendar-info {
    height:80px;
    color: #cecece;
}
.calendar-info a {
    color: #cecece;
}
.calendar_navigation {
    position:relative;
    display:flex;
    justify-content:space-between;
}
.calendar_navigation .prev {
    text-decoration: underline;
    cursor:pointer;
}
.calendar_navigation .next {
    text-decoration: underline;
    cursor:pointer;
}
.calendar_navigation .prev:hover {
    color:lightblue;
}
.calendar_navigation .next:hover {
    color:lightblue;
}
.calendar {
    display:flex;
    flex-wrap:wrap;
    height:calc(100% - 80px);
    list-style:none;
    color: #cecece;
    align-content: flex-start;
}
.calendar > li {
    width: calc(100% / 7 - 2px);
    height: calc(100% / 6 - 2px);
    border: solid 1px #cecece;
}
.calendar > li.current {
    background-color: rgba(255,0,0,.1);
}
.calendar > li a {
    display:block;
    width:calc(100% - 32px);
    height:calc(100% - 32px);
    text-decoration:none;
    color:#cecece;
    padding:16px;
}
.calendar > li a:hover {
    background-color: rgba(255,255,255,.2);
}
.channel-list {
    display:flex;
    overflow-y:scroll;
    color:white;
    flex-wrap: wrap;
    list-style: none;
}
.channel-list > li {
    transition:all 0.3s;
}
.channel-list > li a {
    display:flex;
    text-decoration:none;
    color:white;
    cursor:pointer;
    width:100%;
    height:100%;
}
.channel-list > li p {
    margin-left:8px;
}
.overlay-window {
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
}
.video-list {
    list-style:none;
    font-size:0.8em;
}
.video-list > li {
    cursor:pointer;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
@media screen and (max-width:599px) {
    .channel-list {
        padding:8px 0;
        width:calc(100%);
        height:calc(100% - 16px);
    }
    .channel-list > li {
        width:calc(50% - 16px);
        padding:8px 8px;
    }
    .channel-list > li p {
        font-size: 0.8em;
        word-break: break-all;
    }
    .video-list > li {
        -webkit-line-clamp: 1;
    }
}
@media screen and (min-width:600px) {
    .channel-list {
        padding:8px 32px;
        width:calc(100% - 64px);
        height:calc(100% - 16px);
    }
    .channel-list > li {
        width:calc(50% - 32px);
        padding:8px 16px;
    }
    .channel-list > li p {
        line-height:36px;
    }
    .video-list > li {
        -webkit-line-clamp: 2;
    }
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
.channel-list > li:hover {
    background-color:rgba(255,255,255,.3);
}
.channel-list > li img {
    width:36px;
    height:36px;
    border-radius:18px;
}
</style>
<script>

export default {
    head() {
        return {
            htmlAttrs: {
                lang: 'ja'
            },
            title: 'Calendar',
            meta: [
                { hid: 'description', name: 'description', content: `ホロライブの配信スケジュールを24h更新中。切り抜き動画・複窓ツール` },
                { hid: 'keywords', name: 'keywords', content: 'ホロライブ,配信スケジュール,複窓ツール,VTuber,切り抜き動画' },
                { hid: 'og:site_name', property: 'og:site_name', content: 'HoloEchelon ホロライブスケジュールツール' },
                { hid: 'og:type', property: 'og:type', content: 'website' },
                { hid: 'og:url', property: 'og:url', content: 'https://holoechelon.com/' + this.$nuxt.$route.path },
                { hid: 'og:title', property: 'og:title', content: `schedule | HoloEchelon ホロライブスケジュールツール` },
                { hid: 'og:description', property: 'og:description', content: 'ホロライブの配信スケジュールを24h更新。切り抜き動画・複窓ツール' },
                { hid: 'og:image', property: 'og:image', content: this.thumbnailUrl },
                { name: 'twitter:card', content: 'summary' }
            ],
        }
    },
    data() {
        return {
            year: 0,
            month: 0,
            time: 0,
            channelList: [],
            channel: null,
            cVideoList: []
        }
    },
    methods: {
        prev() {
            let tmp = new Date(Date.UTC(this.year, this.month));
            tmp.setMonth(tmp.getMonth() - 1);
            this.year = tmp.getUTCFullYear();
            this.month = tmp.getUTCMonth();
        },
        next() {
            let tmp = new Date(Date.UTC(this.year, this.month));
            tmp.setMonth(tmp.getMonth() + 1);
            this.year = tmp.getUTCFullYear();
            this.month = tmp.getUTCMonth();
        }
    },
    computed: {
        dayNum() {
            return (new Date(this.year, this.month + 1, 0)).getDate();
        },
        day() {
            return (new Date(this.year, this.month)).getDay();
        },
        cells() {
            let tmpDays = [];
            let date = new Date(Date.UTC(this.year, this.month, 1));
            let now = new Date(this.time);
            let currentYM = now.getUTCFullYear() === this.year && now.getUTCMonth() === this.month;

            for(let i = 0; i < this.dayNum; i++) {
                tmpDays.push({
                    date:(i+1),
                    offset:(i == 0)?this.day:0,
                    time:date.getTime(),
                    current: currentYM && (i + 1) == now.getUTCDate() ? 'current' : '',
                    videos: []
                });
                date.setDate(date.getDate() + 1);
            }
            let since = new Date(Date.UTC(this.year, this.month, 1));
            let until = new Date(Date.UTC(this.year, this.month + 1, 1));
            for(let video of this.cVideoList) {
                let videoDateStr = video.actualStartTime
                    ? video.actualStartTime
                    : video.scheduledStartTime
                        ? video.scheduledStartTime
                        : video.publishedAt;
                if(videoDateStr == false || video.liveBroadcastContent === 'suspended')continue;
                let videoDate = new Date(videoDateStr);
                videoDate.setHours(videoDate.getHours() + 9);
                if(since <= videoDate && videoDate < until) {
                    video.displayTime = videoDate.getUTCHours() + ':' + ('0' + videoDate.getUTCMinutes()).slice(-2);
                    tmpDays[videoDate.getUTCDate() - 1].videos.push(video);
                }
            }
            return tmpDays;
        },
        channelTitle() {
            return this.channel && this.channel.title ? this.channel.title : 'channel not found';
        },
        channelId() {
            return this.channel ? this.channel.id : 'undefined';
        }
    },
    watch: {
    },
    components: {  },
    async mounted() {
        let day = new Date();
        day.setHours(day.getHours() + 9);
        this.year = day.getUTCFullYear();
        this.month = day.getUTCMonth();
        this.time = day.getTime();

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

    }
}
</script>

