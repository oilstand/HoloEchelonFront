<template>
    <div style="position:relative;overflow:hidden;height: calc(100vh - 64px);">
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
        <TimelineVideoInfo
            v-if="focusVideo"
            v-on:close="focusVideo = null"
            :data="focusVideo"
            :style="`height:calc(50%)`"
            class="video-infomation" />
        <table v-if="false">
            <tbody>
                <tr v-for="video in videos" :key="video.id"><td><img :src="video.thumbnails.medium.url"></td><td>{{video.title}}</td><td>{{video.id}}</td><td>{{video.publishedAt}}</td><td></td></tr>
            </tbody>
        </table>
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
    position:absolute;
    left:0;
    bottom:0;
    width:100%;
    height:50%;
    background-color:rgba(0,0,0,.3);
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
</style>
<script>
import axios from 'axios'
import Bar from '~/components/TimelineBar.vue'
import Label from '~/components/TimelineLabel.vue'
import TimelineCursor from '~/components/TimelineCursor.vue'
import TimelineVideoInfo from '~/components/TimelineVideoInfo.vue'

export default {
    async asyncData({ params, app }) {

        let res = await app.$api.request("newVideos/0")
            .then(res => {
                return res.data;
            })
            .catch((e) => {
                console.log("catch request error");
                console.log(e);
                return false;
            });

        let channelRes = await app.$api.request("channelList")
            .then(res => {
                return res.data;
            })
            .catch(e=>{
                console.log("catch request error");
                console.log(e);
                return false;
            });

        let colorIdx = [];
        for(let channel of channelRes.data) {
            colorIdx[channel.id] = channel.color;
        }
        console.log(colorIdx);

        function getStartEndTime(video) {

            switch(video.liveBroadcastContent) {
                case 'suspended':
                case 'upcoming':
                    if(video.scheduledStartTime) {
                        let endD = new Date(video.scheduledStartTime);
                        endD.setHours(endD.getHours() + 2);
                        return [new Date(video.scheduledStartTime), endD]
                    }
                case 'live':
                    if(video.actualStartTime) {
                        let startD = new Date(video.actualStartTime);
                        let now = new Date();
                        let diff = now.getTime() - startD.getTime();
                        if(diff < 2 * 60 * 60 * 1000) {
                            let endD = new Date(startD.getTime());
                            endD.setHours(endD.getHours() + 2);
                            diff = endD.getTime() - now.getTime();
                            if(diff < 0.5 * 60 * 60 * 1000) {
                                now.setMinutes(now.getMinutes() + 30);
                                endD = now;
                            }
                            return [startD, endD];
                        } else {
                            now.setMinutes(now.getMinutes() + 30);
                            return [startD, now];
                        }
                    }
                default:
                    if(video.actualStartTime && video.actualEndTime) {
                        return [new Date(video.actualStartTime), new Date(video.actualEndTime)]
                    }
                    break;
            }
        }

        let videos = [];
        if(res && res.data ) {
            res.data.reverse();
            let idx = 0;
            for(let video of res.data) {
                video.idx = idx;idx++;
                let [date1, date2] = getStartEndTime(video);
                video.startTime = date1.getTime();
                video.endTime = date2.getTime();
                let date1_border = new Date(date1.getTime());
                let date2_border = new Date(date2.getTime());
                date1_border.setHours(date1_border.getHours() - 12);
                date2_border.setHours(date2_border.getHours() + 12);
                let nglist = [];

                for(let i = 0; i < videos.length ; i++) {
                    let [start, end] = getStartEndTime(videos[i]);

                    if(date1_border < start && start <= date1 && date1 < end) {
                        nglist.push(videos[i].topIndex);
                    } else if(date2_border > end && start <= date2 && date2 < end) {
                        nglist.push(videos[i].topIndex);
                    } else if(start >= date1 && date2 >= end) {
                        nglist.push(videos[i].topIndex);
                    }
                }
                video.topIndex = 0;
                while(nglist.indexOf(video.topIndex) !== -1) {
                    video.topIndex++;
                }
                video.topOffset = video.topIndex * 54;
                if(video.liveBroadcastContent !== 'live') {
                    video.topOffset++;
                }

                video.color = colorIdx[video.channelId];

                videos.push(video);
            }
        }

        return {videos:videos};
    },
    head() {
        return {
            title: 'schedule',
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
            focusVideo: null
        }
    },
    methods: {
        test(e){
            console.log(e);
        },
        handleOnWheel(e) {
            
            let [tmpelm] = document.getElementsByClassName('timeline');
            let tlWrapper = tmpelm.parentNode;
            //console.log(tmpelm.parentNode.scrollLeft, this.timelineWidth * this.timelineLength);

            if(tlWrapper.scrollLeft == 0
                && e.deltaY < 0) {

                this.expandPast();
                //tlWrapper.scrollLeft = this.timelineWidth * 0.5;
            } else if(tlWrapper.scrollLeft == this.timelineWidth * (this.timelineLength - 1)
                && e.deltaY > 0) {

                this.expandFuture();
            } else {

            }
            tmpelm.parentNode.scrollLeft += e.deltaY;
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
        Bar,    Label,  TimelineCursor, TimelineVideoInfo
    },
    mounted() {
        let [tmpelm] = document.getElementsByClassName('timeline');
        this.elmTimeline = tmpelm.parentNode;
        console.log(this.videos);
    }
}
</script>
