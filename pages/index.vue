<template>
    <div style="position:relative;overflow:hidden;height: calc(100vh - 64px);">

        <!-- タイムライン -->
        <div class="timeline_wrapper" v-on:wheel="handleOnWheel">
            <div class="timeline" :style="`background-size:${bgsize}px;background-image: linear-gradient(90deg, transparent ${bgsize - 2}px, #333 ${bgsize}px);width: ${timelineBlockWidth};`">
                <client-only placeholder="Loading...">
                <Bar 
                    v-for="(video, index) in videos"
                    v-on:click.native="focusVideo = video"
                    :key="video.id"
                    :data="video"
                    :start="start"
                    :end="end"
                    :style="`top:${video.topOffset + 50}px`"
                    />
                <Label v-for="(label, index) in dateLabels" :key="`d_${index}`" :data="label" :start="start" :end="end" />
                <Label v-for="(label, index) in hoursLabels" :key="`h_${index}`" :data="label" :start="start" :end="end" style="top:1em;" />
                <TimelineCursor :data="{time:new Date().getTime()}" :start="start" :end="end" />
                </client-only>
            </div>
        </div>
        <div class="side-control-area" style="left:0;background-image: linear-gradient(90deg, #333 0%, transparent 100%);" v-on:click="expandPast">←</div>
        <div class="side-control-area" style="right:0;background-image: linear-gradient(90deg, transparent 0%, #333 100%);" v-on:click="expandFuture">→</div>

        <!-- TL表示配信の詳細情報表示 -->
        <TimelineVideoInfo
            v-if="focusVideo"
            v-on:close="focusVideo = null;expandInfomation = 0;"
            v-on:wheel="handleOnWheelInfomation"
            v-on:wipe="wipeAdd"
            v-on:play="videoPlay"
            :data="focusVideo"
            :style="`height:calc(35% + ${expandInfomation}px)`"
            class="video-infomation" />

        <!-- メインビデオプレイヤー -->
        <YouTubePlayer
            style="position:absolute;left:0;top:0;width:100%;height:100%;"
            v-if="playerTarget"
            :data="playerTarget"
            v-on:close="playerTarget = null"
            v-on:wipe="wipeAdd"
            />

        <!-- ワイプビデオプレイヤー -->
        <YouTubeWipeWindow
            v-for="(wipe, index) in wipes"
            v-on:close="wipeClose"
            v-on:play="videoPlayById"
            :key="`w_${wipe}`"
            :wipe="wipe"
            class="wipe-window"
            :style="`top:${200 * index + 20}px;`" />
    </div>
</template>
<style>
.side-control-area {
    position:absolute;
    top:0;
    width:100px;
    height:100%;
    opacity:.2;
}
.video-infomation {
    transition: height .2s;
    position:absolute;
    left:0;
    bottom:0;
    width:100%;
    height:50%;
    max-height:100%;
    color:white;
    background-color:rgba(0,0,0,.7);
}
.timeline_wrapper {
    position:relative;
    width:100%;
    height:100%;
    overflow-x:scroll;
}
.timeline { 
    position:relative;
    overflow:hidden;
    height:100%;
}
.wipe-window {
    position:absolute;
    width:300px;
    height:calc(300px * 36 / 64);
    right:50px;
}
</style>
<script>
import axios from 'axios'
import Bar from '~/components/TimelineBar.vue'
import Label from '~/components/TimelineLabel.vue'
import TimelineCursor from '~/components/TimelineCursor.vue'
import TimelineVideoInfo from '~/components/TimelineVideoInfo.vue'
import YouTubeIFrame from '~/components/YouTubeIFrame.vue'
import interact from 'interactjs'
import YouTubeWipeWindow from '~/components/YouTubeWipeWindow.vue'
import YouTubePlayer from '~/components/YouTubePlayer.vue'

export default {
    async asyncData({ params, app }) {

        let until = new Date();
        until.setDate(until.getDate() + 1);
        let timezoneOffset = until.getTimezoneOffset();
        let jstOffset = 540 - timezoneOffset;
        until.setMinutes(until.getMinutes() + jstOffset);

        let since = new Date(until.getTime());
        since.setDate(since.getDate() - 3);
        let loadRange = {
            since: app.$formatDate(since, 'yyyy-MM-dd 23:59:59+09:00'),
            until: app.$formatDate(until, 'yyyy-MM-dd 23:59:59+09:00')
        };

        let res = await app.$api.request("videos?date="+app.$formatDate(until, 'yyyy-MM-dd')+"&range=3")
            .then(res => { return res.data; })
            .catch((e) => {
                console.log("catch request error", e);
                return false;
            });

        let channelRes = await app.$api.request("channelList")
            .then(res => { return res.data; })
            .catch(e=>{
                console.log("catch request error", e);
                return false;
            });

        let colorIdx = [];
        for(let channel of channelRes.data) {
            colorIdx.push({id: channel.id, color: channel.color});
        }

        let videos = [];
        if(res && res.data ) {
            videos = app.$initializeVideos(res.data, colorIdx);
        }

        return {videos:videos, range:loadRange, colorIdx:colorIdx};
    },
    head() {
        return {
            htmlAttrs: {
                lang: 'ja'
            },
            title: 'Schedule',
            meta: [
                { hid: 'description', name: 'description', content: `hololive schedule tool` },
                { hid: 'keywords', name: 'keywords', content: 'hololive' },
                { hid: 'og:site_name', property: 'og:site_name', content: 'HoloEchelon' },
                { hid: 'og:type', property: 'og:type', content: 'website' },
                { hid: 'og:url', property: 'og:url', content: 'https://holoshift.appspot.com' + this.$nuxt.$route.path },
                { hid: 'og:title', property: 'og:title', content: `schedule | HoloEchelon` },
                { hid: 'og:description', property: 'og:description', content: 'hololive stream schedule' },
                { hid: 'og:image', property: 'og:image', content: this.thumbnailUrl },
                { name: 'twitter:card', content: 'summary' }
            ],
        }
    },
    data: function(){
        return {
            //postで送信するためのリクエストデータ初期化
            videos: [],
            elmTimeline: null,
            pastOffset: 12,
            futureOffset: 24,
            timelineLength: 1.5,
            focusVideo: null,
            playerTarget: null,
            expandInfomation: 0,
            wipes: [],
            wipeVideoBuffer: []
        }
    },
    methods: {
        wipeAdd(videoData){
            if(this.wipes.indexOf(videoData.id) == -1) {
                this.wipes.push(videoData.id);
                this.wipeVideoBuffer.push(videoData);
            }
        },
        videoPlay(videoData) {
            this.playerTarget = videoData;
        },
        async videoPlayById(vId) {
            let vData = false;
            for(let video of this.wipeVideoBuffer) {
                if(video.id == vId) {
                    vData = video;
                    break;
                }
            }
            if(vData) {
                this.wipeClose(vData.id);
                this.playerTarget = vData;
            }
        },
        wipeClose(vId) {
            let index = this.wipes.indexOf(vId);
            if(index == -1)return;
            if(index == 0) {
                this.wipes.shift();
            } else if(index == (this.wipes.length - 1)) {
                this.wipes.pop();
            } else {
                this.wipes = this.wipes.filter(id => id != vId)
            }
            this.wipeVideoBuffer = this.wipeVideoBuffer.filter(video => video.id != vId)
        },
        handleOnWheel(e) {
            
            let [tmpelm] = document.getElementsByClassName('timeline');
            let tlWrapper = tmpelm.parentNode;

            if(tlWrapper.scrollLeft == 0
                && e.deltaY < 0) {

                this.expandPast();

                let dateSince = new Date(this.range.since);
                dateSince.setHours(dateSince.getHours() + 12);
                let dateTimelineHead = new Date(this.startTimeStr);
                if(dateTimelineHead < dateSince) {
                    this.loadPastVideos();
                }
            } else if(tlWrapper.scrollLeft == this.timelineWidth * (this.timelineLength - 1)
                && e.deltaY > 0) {

                this.expandFuture();

                let dateUntil = new Date(this.range.until);
                let dateTimelineTail = new Date(this.endTimeStr);
                if(dateTimelineTail > dateUntil) {
                    this.loadFutureVideos();
                }
            }
            
            tmpelm.parentNode.scrollLeft += e.deltaY;

        },
        async requestMoreVideos(targetDate) {
            return await this.$api.request("videos?date="+this.$formatDate(targetDate, 'yyyy-MM-dd'));
        },
        async loadPastVideos() {
            let dateTimelineHead = new Date(this.startTimeStr);
            dateTimelineHead.setHours(dateTimelineHead.getHours() - 12);

            let dateNewSince = new Date(dateTimelineHead.getTime());
            dateNewSince.setDate(dateNewSince.getDate() - 1);
            this.range.since = this.$formatDate(dateNewSince, 'yyyy-MM-dd 23:59:59+09:00');

            let res = await this.requestMoreVideos(dateTimelineHead)
                .then(res => { return res.data; })
                .catch((e) => {
                    console.log("catch request error", e);
                    return false;
                });
                
            if(res && res.data ) {
                this.videos.unshift(...res.data);

                this.$initializeVideos(
                    this.videos,
                    this.colorIdx
                );
            }
        },
        async loadFutureVideos() {
            let dateTimelineTail = new Date(this.endTimeStr);
            let dateNewUntil = new Date(dateTimelineTail.getTime());

            dateNewUntil.setDate(dateNewUntil.getDate());
            this.range.until = this.$formatDate(dateNewUntil, 'yyyy-MM-dd 23:59:59+09:00');

            let res = await this.requestMoreVideos(dateTimelineTail)
                .then(res => { return res.data; })
                .catch((e) => {
                    console.log("catch request error", e);
                    return false;
                });
                
            if(res && res.data ) {
                this.videos.push(...res.data);

                this.$initializeVideos(
                    this.videos,
                    this.colorIdx
                );
            }
        },
        handleOnWheelInfomation(e) {
            let [tmpelm] = document.getElementsByClassName('video-infomation');
            let infoWrapper = tmpelm.parentNode;

            this.expandInfomation += e.deltaY;

            if(this.expandInfomation < 0) {
                this.expandInfomation = 0;
            } else if(this.expandInfomation > infoWrapper.clientHeight * 0.65) {
                this.expandInfomation = infoWrapper.clientHeight * 0.65;
            }
        },
        expandPast() {
            this.pastOffset += 12;this.timelineLength += 0.5;
            let [tmpelm] = document.getElementsByClassName('timeline');
            let tlWrapper = tmpelm.parentNode;
            tlWrapper.scrollLeft += this.timelineWidth * 0.5;
        },
        expandFuture() {
            this.futureOffset += 12;this.timelineLength += 0.5;
        }
    },
    computed: {
        timelineBlockWidth() {
            return (this.timelineLength * 100).toString() + '%';
        },
        startTimeStr() {
            let now = new Date();
            now.setHours(now.getHours() - this.pastOffset);
            return this.$formatDate(now, 'yyyy-MM-dd HH:00:00+09:00');
        },
        endTimeStr() {
            let now = new Date();
            now.setHours(now.getHours() + this.futureOffset);
            return this.$formatDate(now, 'yyyy-MM-dd HH:00:00+09:00');
        },
        start() {
            return new Date(this.startTimeStr).getTime();
        },
        end() {
            return new Date(this.endTimeStr).getTime();
        },
        bgsize() {
            return 3600000/(this.end - this.start) * this.timelineWidth * this.timelineLength;
        },
        timelineWidth() {
            return this.elmTimeline ? this.elmTimeline.clientWidth : 0;
        },
        dateLabels() {
            let dateLabels = [];
            let startDate = new Date(this.startTimeStr);
            let endDate = new Date(this.endTimeStr);
            let tmpDate = new Date( this.$formatDate(startDate, 'yyyy-MM-dd 00:00:00') );
            do {
                dateLabels.push({
                    text:this.$formatDate(tmpDate, 'MM/dd'),
                    time:this.$formatDate(tmpDate, 'yyyy-MM-dd HH:mm:ss')
                });
                tmpDate.setDate(tmpDate.getDate() + 1);

            } while(tmpDate < endDate);
            return dateLabels;
        },
        hoursLabels() {
            let hoursLabels = [];
            let startDate = new Date(this.startTimeStr);
            let endDate = new Date(this.endTimeStr);
            let tmpDate = new Date( this.$formatDate(startDate, 'yyyy-MM-dd 00:00:00') );
            do {
                hoursLabels.push({
                    text:this.$formatDate(tmpDate, 'HH'),
                    time:this.$formatDate(tmpDate, 'yyyy-MM-dd HH:mm:ss')
                });
                tmpDate.setHours(tmpDate.getHours() + 1);

            } while(tmpDate < endDate);
            return hoursLabels;
        }
    },
    components: {
        Bar,    Label,  TimelineCursor, TimelineVideoInfo,
        YouTubeIFrame,  YouTubeWipeWindow,  YouTubePlayer
    },
    mounted() {
        let [tmpelm] = document.getElementsByClassName('timeline');
        this.elmTimeline = tmpelm.parentNode;

        // initialize interactjs
        interact('.wipe-window')
        .resizable({
            edges: {
                top   : false,
                left  : '.resize-lb',
                bottom: '.resize-lb',
                right : false
            },
            modifiers: [
                interact.modifiers.aspectRatio({
                    ratio: (64/36)
                })
            ]
        })
        .draggable({
            listeners: {
                start (event) {
                    //@console.log(event.type, event.target);
                },
                move: (event) => {
                    let { x, y } = event.target.dataset;

                    x = parseFloat(x) || 0; x += event.dx - 0;
                    y = parseFloat(y) || 0; y += event.dy - 0;
                    Object.assign(event.target.dataset, { x, y })

                    event.target.style.transform =
                        `translate(${x}px, ${y}px)`
                },
            }
        })
        .on('resizemove', event => {
            let { x, y } = event.target.dataset;

            x = parseFloat(x) || 0;// x += event.deltaRect.left;
            y = parseFloat(y) || 0; y += event.deltaRect.top;

            Object.assign(event.target.style, {
                width: `calc(${event.rect.width}px)`,
                height: `calc(${event.rect.height}px)`,
                transform: `translate3d(${x}px, ${y}px, 0px)`
            });

            Object.assign(event.target.dataset, { x, y });
        });

    }
}
</script>
