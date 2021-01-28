<template>
    <div style="position:relative;overflow:hidden;height: calc(100vh - 64px);">

        <!-- タイムライン -->
        <div class="timeline_wrapper" v-on:wheel="handleOnWheel">
            <div class="timeline" :style="`background-size:${bgsize}px;background-image: linear-gradient(90deg, transparent ${bgsize - 2}px, #333 ${bgsize}px);width: ${timelineBlockWidth};`">
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
            </div>
        </div>
        <div class="side-control-area" style="left:0;background-image: linear-gradient(90deg, #333 0%, transparent 100%);" v-on:click="expandPast">←</div>
        <div class="side-control-area" style="right:0;background-image: linear-gradient(90deg, transparent 0%, #333 100%);" v-on:click="expandFuture">→</div>
        <div
            v-on:click="loadCurrentVideos(),intervalCounter=0;"
            style="position:absolute;right:50px;top:50px;width:150px;height:50px;background-color:rgba(0,0,0,.4);color:white;line-height:50px;text-align:center;cursor:pointer;">{{ lastUpdate ? $formatDate(lastUpdate, 'HH:mm:ss') : "----" }} 更新</div>

        <input type="checkbox" id="left-control_checkbox" style="">
        <div class="left-control" style="color:white;">
            <label class="left-control_toggle" for="left-control_checkbox"></label>

            <h3>フィルター</h3>
            <ul style="padding-left:30px;">
                <li v-for="country in ['JP','EN','ID']" :key="country">
                    <input
                        type="checkbox"
                        :id="`hl_${country}`"
                        :value="country"
                        v-on:change="filterChangeCountry"
                        checked="checked">
                    <label class="" :for="`hl_${country}`">{{country}}</label>
                </li>
            </ul>
            <input
                type="checkbox"
                id="filtersort"
                v-on:change="dispFilterSort = !dispFilterSort"
                >
            <label class="" for="filtersort">フィルター再整列</label>
            <ul class="filter-channel-list" style="">
                <li
                    v-for="channel in channelList"
                    :key="channel.id">
                        <input
                            type="checkbox"
                            v-on:change="filterChangeChannel"
                            :id="`cb_${channel.id}`"
                            :value="channel.id">
                        <label
                            class=""
                            :for="`cb_${channel.id}`"
                            >{{ channel.title }}</label>
                    </li>
            </ul>
        </div>

        <!-- TL表示配信の詳細情報表示 -->
        <TimelineVideoInfo
            v-if="focusVideo"
            v-on:close="focusVideo = null;expandInfomation = 0;"
            v-on:wheel="handleOnWheelInfomation"
            v-on:wipe="wipeAdd"
            v-on:play="videoPlay"
            v-on:openDescription="descAdd"
            v-on:openChannel="(cId)=>{dispChannelVideosTarget = cId;}"
            :data="focusVideo"
            :channelList="channelList"
            :style="`height:calc(${videoInfomationOffset}px + ${expandInfomation}px)`"
            class="video-infomation" />

        <!-- メインビデオプレイヤー -->
        <YouTubePlayer
            class="overlay-window"
            v-if="playerTarget"
            :data="playerTarget"
            v-on:close="playerTarget = null"
            v-on:wipe="wipeAdd"
            />

        <!-- チャンネル一覧 -->
        <ChannelList
            class="overlay-window"
            v-if="dispChannelListView"
            v-on:close="dispChannelListView = false"
            v-on:openChannel="(cId)=>{dispChannelVideosTarget = cId;}"
            :channelList="channelList"
        />

        <!-- チャンネル動画一覧 -->
        <ChannelVideosList
            class="overlay-window"
            v-if="dispChannelVideosTarget"
            v-on:wipe="wipeAdd"
            v-on:close="dispChannelVideosTarget = null"
            :cId="dispChannelVideosTarget"
            style="background-color:rgba(0,0,0,.8);"
            />

        <!-- descriptionポップアップ -->
        <VideoDescription
            class="drag-resize"
            v-for="(desc, index) in descs"
            v-on:close="descClose"
            :data="desc"
            :key="`dw_${desc.id}`"
            :style="`position:absolute;left:100px;top:${index * 100 + 100}px;`"/>

        <div v-if="false" class="drag-resize" style="position: absolute;left: 0px;top: 0px;width: 400px;padding: 20px;">
            <a class="twitter-timeline" href="https://twitter.com/minatoaqua?ref_src=twsrc%5Etfw">Tweets by minatoaqua</a>
        </div>

        <!-- ワイプビデオプレイヤー -->
        <YouTubeWipeWindow
            v-for="(wipe, index) in wipes"
            v-on:close="wipeClose"
            v-on:play="videoPlay"
            :key="`w_${wipe.id}`"
            :wipe="wipe"
            class="wipe-window drag-resize_aspect"
            :style="`top:${200 * index + 20}px;`" />


        <div
            v-if="firstNotice"
            class="first-notice">
            <div
                v-on:click="firstNotice = false"
                style="width:30px;height:30px;line-height:30px;text-align:center;position:absolute;top:0;right:0;background-color:rgba(255,255,255,.3);color:black;">x</div>
            <h2>はじめに</h2>
            <ul style="">
                <li>このサイトは現在PC専用です。</li>
                <li>ホロライブの配信予定・配信履歴を確認できます。</li>
                <li>左の&gt;から配信の絞り込みができます。</li>
                <li>配信を選択すると情報がみれます。</li>
                <li>マウスホイールで時系列の移動ができます。</li>
                <li>ワイプボタンやプレイヤーボタンを押すとサイト内で動画を観ることができます</li>
                <li>右上の「チャンネル一覧」からチャンネル毎の動画一覧を確認できます。</li>
                <li>これは開発中のものです。</li>
                <li>この画面は右上の×で閉じられます。</li>
            </ul>
        </div>

    </div>
</template>
<style>
#left-control_checkbox {
    position:absolute;
    left:0;top:0;
    width:0;
    height:0;
    overflow:hidden;
    opacity:0;
}
.left-control {
    position:absolute;
    width:240px;
    height:100%;
    left:-220px;top:0;
    background-color:rgba(0,0,0,.5);
    transition: all .3s;
}
#left-control_checkbox:checked~.left-control {
    left:0px;
}
.left-control_toggle {
    display:block;
    height:100%;
    width:20px;
    background-color:rgba(0,0,0,.3);
    position:absolute;
    right:0;
    top:0;
    color:white;
    font-weight:bold;
    line-height: 50vh;
    text-align:center;
}
#left-control_checkbox~.left-control > .left-control_toggle:before {
    content: ">";
}
#left-control_checkbox:checked~.left-control > .left-control_toggle:before {
    content: "<";
}
.overlay-window {
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
}
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
.filter-channel-list {
    font-size: 0.7em;
    max-height: 50%;
    overflow-y: scroll;
    padding: 12px;
    list-style: none;
    width: calc(100% - 24px - 20px);
    overflow-x: hidden;
}
.filter-channel-list li {
    display:flex;
}
.filter-channel-list li label {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin-left: 4px;
    overflow: hidden;
}
.first-notice {
    position:absolute;
    background-color:rgba(0,0,0,.7);
    color:white;
}
@media screen and (max-width:959px) {
    .first-notice {
        left:0%;
        top:0%;
        width:100%;
        height:100%;
    }
    .first-notice ul {
        padding-left:30px;
    }
}
@media screen and (min-width:960px) {
    .first-notice {
        left:50%;
        top:50%;
        width:50%;
        height:50%;
        transform:translate(-50%,-50%);
    }
    .first-notice ul {
        padding-left:50px;
    }
}
</style>
<script>
import axios from 'axios'
import interact from 'interactjs'
import Bar from '~/components/TimelineBar.vue'
import Label from '~/components/TimelineLabel.vue'
import TimelineCursor from '~/components/TimelineCursor.vue'
import TimelineVideoInfo from '~/components/TimelineVideoInfo.vue'
import VideoDescription from '~/components/VideoDescription.vue'
import ChannelVideosList from '~/components/ChannelVideosList.vue'
import YouTubeWipeWindow from '~/components/YouTubeWipeWindow.vue'
import YouTubePlayer from '~/components/YouTubePlayer.vue'
import ChannelList from '~/components/ChannelList.vue'

export default {
    head() {
        return {
            htmlAttrs: {
                lang: 'ja'
            },
            title: 'Schedule',
            meta: [
                { hid: 'description', name: 'description', content: `ホロライブの配信スケジュールを24h更新中。切り抜き動画や複窓も` },
                { hid: 'keywords', name: 'keywords', content: 'ホロライブ,配信スケジュール,複窓ツール,VTuber,切り抜き動画' },
                { hid: 'og:site_name', property: 'og:site_name', content: 'HoloEchelon ホロライブスケジュールツール' },
                { hid: 'og:type', property: 'og:type', content: 'website' },
                { hid: 'og:url', property: 'og:url', content: 'https://holoechelon.com/' + this.$nuxt.$route.path },
                { hid: 'og:title', property: 'og:title', content: `schedule | HoloEchelon ホロライブスケジュールツール` },
                { hid: 'og:description', property: 'og:description', content: 'ホロライブの配信スケジュールを24h更新中。切り抜き動画や複窓も' },
                { hid: 'og:image', property: 'og:image', content: this.thumbnailUrl },
                { name: 'twitter:card', content: 'summary' }
            ],
        }
    },
    data: function(){
        return {
            elmTimeline: null,
            pastOffset: 12,
            futureOffset: 24,
            timelineLength: 1.5,
            focusVideo: null,
            videoInfomationOffset: 0,
            playerTarget: null,
            expandInfomation: 0,
            dispChannelListView: false,
            dispChannelVideosTarget: null,
            wipes: [],
            descs: [],
            dispFilterCountry: ['JP','ID','EN'],
            dispFilterSort: false,
            dispFilterSortLast: "",
            dispFilterChannel: [],
            firstNotice: true,
            intervalCounter: 0,
            lastUpdate: null,
            rawVideos: [],
            range: {since:'',until:""},
            channelList: [],
            vpScale: 1
        }
    },
    methods: {
        wipeAdd(videoData){
            for(let wipe of this.wipes) {
                if(videoData.id === wipe.id) {
                    return;
                }
            }
            this.wipes.push(videoData);
        },
        videoPlay(videoData) {
            this.playerTarget = videoData;
        },
        wipeClose(vData) {
            let index = -1;
            for(let [idx, wipe] of this.wipes.entries()) {
                if(wipe.id === vData.id) {
                    index = idx;
                    break;
                }
            }
            if(index == -1)return;
            if(index == 0) {
                this.wipes.shift();
            } else if(index == (this.wipes.length - 1)) {
                this.wipes.pop();
            } else {
                this.wipes.splice(index, 1);
            }
        },
        descAdd(videoData){
            for(let desc of this.descs) {
                if(videoData.id === desc.id) {
                    return;
                }
            }
            this.descs.push(videoData);
        },
        descClose(vData) {
            let index = -1;
            for(let [idx, desc] of this.descs.entries()) {
                if(desc.id === vData.id) {
                    index = idx;
                    break;
                }
            }
            if(index == -1)return;
            this.descs.splice(index, 1);
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
        async requestMoreVideos(targetDate, range = 1) {
            return await this.$api.request("videos?date="+this.$formatDate(targetDate, 'yyyy-MM-dd')+ (range == 1 ? '' : '&range='+range));
        },
        async loadPastVideos() {
            let dateTimelineHead = new Date(this.startTimeStr);
            dateTimelineHead.setHours(dateTimelineHead.getHours() - 12);

            let dateNewSince = new Date(dateTimelineHead.getTime());
            dateNewSince.setDate(dateNewSince.getDate() - 1);
            this.range.since = this.$formatDate(dateNewSince, 'yyyy/MM/dd 23:59:59+09:00');

            let res = await this.requestMoreVideos(dateTimelineHead)
                .then(res => { return res.data; })
                .catch((e) => {
                    console.log("catch request error", e);
                    return false;
                });
                
            if(res && res.data ) {
                this.rawVideos.unshift(...res.data);

                this.$initializeVideos(
                    this.rawVideos,
                    this.channelList
                );
            }
        },
        async loadFutureVideos() {
            let dateTimelineTail = new Date(this.endTimeStr);
            let dateNewUntil = new Date(dateTimelineTail.getTime());

            dateNewUntil.setDate(dateNewUntil.getDate());
            this.range.until = this.$formatDate(dateNewUntil, 'yyyy/MM/dd 23:59:59+09:00');

            let res = await this.requestMoreVideos(dateTimelineTail)
                .then(res => { return res.data; })
                .catch((e) => {
                    console.log("catch request error", e);
                    return false;
                });
                
            if(res && res.data ) {
                this.rawVideos.push(...res.data);

                this.$initializeVideos(
                    this.rawVideos,
                    this.channelList
                );
            }
        },
        async loadCurrentVideos() {
            this.intervalCounter++;
            if(this.intervalCounter > 10)return;

            let until = new Date();
            until.setHours(until.getHours() + 12);

            let res = await this.requestMoreVideos(until, 2)
                .then(res => { return res.data; })
                .catch((e) => {
                    console.log("catch request error", e);
                    return false;
                });
                
            if(res && res.data ) {
                this.lastUpdate = new Date();

                for(let updVideo of res.data) {
                    this.rawVideos = this.rawVideos.filter(video => video.id != updVideo.id);
                    this.rawVideos.push(updVideo);
                    console.log(updVideo.title,updVideo.id,updVideo);
                }
                this.$initializeVideos(
                    this.rawVideos,
                    this.channelList
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
            tlWrapper.scrollLeft += this.timelineWidth * 0.5 * this.vpScale;
        },
        expandFuture() {
            this.futureOffset += 12;this.timelineLength += 0.5;
        },
        filterChangeCountry(e) {
            if(this.dispFilterCountry.indexOf(e.target.value) !== -1 && e.target.checked == false) {
                this.dispFilterCountry = this.dispFilterCountry.filter(country => country != e.target.value);
            } else if(this.dispFilterCountry.indexOf(e.target.value) === -1 && e.target.checked == true) {
                this.dispFilterCountry.push(e.target.value);
            }
        },
        filterChangeChannel(e) {
            if(this.dispFilterChannel.indexOf(e.target.value) !== -1 && e.target.checked == false) {
                this.dispFilterChannel = this.dispFilterChannel.filter(country => country != e.target.value);
            } else if(this.dispFilterChannel.indexOf(e.target.value) === -1 && e.target.checked == true) {
                this.dispFilterChannel.push(e.target.value);
            }
        },
        selectChannel(channel) {
            this.dispFilterChannel.push(channel.id);
        },
        twitterWidgetLoad() {
            if(!window.twttr) {
                window.twttr = (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0],
                        t = window.twttr || {};
                    if (d.getElementById(id)) return t;
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "https://platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js, fjs);

                    t._e = [];
                    t.ready = function(f) {
                        t._e.push(f);
                    };

                    return t;
                }(document, "script", "twitter-wjs"));
            } else {
                twttr.widgets.load();
            }
        },
        openChannelListView() {
            this.dispChannelListView = true;
        },
        formatDate(date, format) {
            format = format.replace(/yyyy/g, date.getUTCFullYear());
            format = format.replace(/MM/g, ('0' + (date.getUTCMonth() + 1)).slice(-2));
            format = format.replace(/dd/g, ('0' + date.getUTCDate()).slice(-2));
            format = format.replace(/HH/g, ('0' + date.getUTCHours()).slice(-2));
            format = format.replace(/mm/g, ('0' + date.getUTCMinutes()).slice(-2));
            format = format.replace(/ss/g, ('0' + date.getUTCSeconds()).slice(-2));
            format = format.replace(/SSS/g, ('00' + date.getUTCMilliseconds()).slice(-3));
            return format;
        },
        async datainitialize() {
            let until = new Date();
            until.setDate(until.getDate() + 1);

            until.setHours(until.getHours() + 9);// GMT+900

            let since = new Date(until.getTime());
            since.setDate(since.getDate() - 3);
            let loadRange = {
                since: this.formatDate(since, 'yyyy/MM/dd 23:59:59+09:00'),
                until: this.formatDate(until, 'yyyy/MM/dd 23:59:59+09:00')
            };

            let until2 = new Date(until.getTime());
            until2.setDate(until2.getDate() - 2);
            let vraw1 = await this.$api.request("videos?date="+this.formatDate(until2, 'yyyy-MM-dd'))
                .then(res => { return res.data; })
                .catch((e) => {
                    console.log("catch request error", e);
                    return false;
                });

            let vraw2 = await this.$api.request("videos?date="+this.formatDate(until, 'yyyy-MM-dd')+"&range=2")
                .then(res => { return res.data; })
                .catch((e) => {
                    console.log("catch request error", e);
                    return false;
                });

            let videolist = [];
            if(vraw1 && vraw1.data) {
                videolist.push(...vraw1.data);
            }
            if(vraw2 && vraw2.data) {
                videolist.push(...vraw2.data);
            }

            let channelRes = await this.$api.request("channelList")
                .then(res => { return res.data; })
                .catch(e=>{
                    console.log("catch request error", e);
                    return false;
                });

            let channelList = [];
            if(channelRes.data) {
                channelList = channelRes.data;
            }

            let videos = [];
            if( videolist ) {
                videos = this.$initializeVideos(videolist, channelList);
            }
            this.rawVideos = videos;
            this.range = loadRange;
            this.channelList = channelList;

        }
    },
    computed: {
        videos() {
            let videoList = this.rawVideos.filter(video => {
                let ch = false;
                for(let channel of this.channelList) {
                    if(video.channelId === channel.id) {
                        ch = channel;
                        break;
                    }
                }
                if(this.dispFilterChannel.length > 0) {
                    return (ch && this.dispFilterChannel.indexOf(ch.id) !== -1);
                }

                return (ch && ch.country && this.dispFilterCountry.indexOf(ch.country) !== -1);
            });

            let needSort = () => {
                if(this.dispFilterChannel.length > 0) {
                    return true;
                }
                for(let country of this.dispFilterCountry) {
                    if(this.dispFilterSortLast.indexOf(country) == -1) {
                        return true;
                    }
                }
                return false;
            }

            if(this.dispFilterSort || needSort()) {
                this.$initializeVideos(
                    videoList,
                    this.channelList
                );
                this.dispFilterSortLast = this.dispFilterChannel.length == 0
                                        ? this.dispFilterCountry.join()
                                        : "";
            }
            return videoList;
        },
        timelineBlockWidth() {
            return (this.timelineLength * 100 * this.vpScale).toString() + '%';
        },
        startTimeStr() {
            let now = new Date();
            now.setHours(now.getHours() - this.pastOffset);
            return this.$formatDate(now, 'yyyy/MM/dd HH:00:00+09:00');
        },
        endTimeStr() {
            let now = new Date();
            now.setHours(now.getHours() + this.futureOffset);
            return this.$formatDate(now, 'yyyy/MM/dd HH:00:00+09:00');
        },
        start() {
            return new Date(this.startTimeStr).getTime();
        },
        end() {
            return new Date(this.endTimeStr).getTime();
        },
        bgsize() {
            return 3600000/(this.end - this.start) * this.timelineWidth * this.timelineLength * this.vpScale;
        },
        timelineWidth() {
            return this.elmTimeline ? this.elmTimeline.clientWidth : 0;
        },
        dateLabels() {
            let dateLabels = [];
            let startDate = new Date(this.startTimeStr);
            let endDate = new Date(this.endTimeStr);
            let tmpDate = new Date( this.$formatDate(startDate, 'yyyy/MM/dd 00:00:00') );
            do {
                dateLabels.push({
                    text:this.$formatDate(tmpDate, 'MM/dd'),
                    time:this.$formatDate(tmpDate, 'yyyy/MM/dd HH:mm:ss')
                });
                tmpDate.setDate(tmpDate.getDate() + 1);

            } while(tmpDate < endDate);
            return dateLabels;
        },
        hoursLabels() {
            let hoursLabels = [];
            let startDate = new Date(this.startTimeStr);
            let endDate = new Date(this.endTimeStr);
            let tmpDate = new Date( this.$formatDate(startDate, 'yyyy/MM/dd 00:00:00') );
            do {
                hoursLabels.push({
                    text:this.$formatDate(tmpDate, 'HH'),
                    time:this.$formatDate(tmpDate, 'yyyy/MM/dd HH:mm:ss')
                });
                tmpDate.setHours(tmpDate.getHours() + 1);

            } while(tmpDate < endDate);
            return hoursLabels;
        }
    },
    components: {
        Bar,    Label,  TimelineCursor, TimelineVideoInfo,
        YouTubeWipeWindow,  YouTubePlayer,  VideoDescription,
        ChannelVideosList,  ChannelList
    },
    mounted() {
        let [tmpelm] = document.getElementsByClassName('timeline');
        this.elmTimeline = tmpelm.parentNode;

        this.datainitialize();

        this.vpScale = 1;
        if(window.innerWidth <= 600) {
            this.vpScale = 5;
        }

        // initialize interactjs
        interact('.drag-resize_aspect')
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

        interact('.drag-resize')
        .resizable({
            edges: {
                top   : false,
                left  : '.resize-lb',
                bottom: ['.resize-lb','.resize-rb'],
                right : '.resize-rb'
            }
        })
        .draggable({
            listeners: {
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

            x = parseFloat(x) || 0; x += event.deltaRect.left;
            y = parseFloat(y) || 0; y += event.deltaRect.top;

            Object.assign(event.target.style, {
                width: `calc(${event.rect.width}px)`,
                height: `calc(${event.rect.height}px)`,
                transform: `translate3d(${x}px, ${y}px, 0px)`
            });

            Object.assign(event.target.dataset, { x, y });
        });

        this.twitterWidgetLoad();
        this.$nuxt.$on('headerControlChannel', this.openChannelListView);
        setInterval(this.loadCurrentVideos, 1000 * 60 * 10);
        this.lastUpdate = new Date();
    }
}
</script>
