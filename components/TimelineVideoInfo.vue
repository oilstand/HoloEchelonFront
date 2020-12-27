<template>
    <div v-on:wheel="handleOnWheel">
        <div class="close-button" v-on:click="$emit('close')">x</div>
        <div class="video-infomation-unit">
            <div class="video_holder">
                <div>
                    <YouTubeIFrame
                        ref="infoVideo"
                        :vid="data.id"
                        v-on:ready="videoMask = false"
                        v-on:changeStatus="videoChangeStatus"
                        style="width:100%;position:absolute;left:0;top:0;" />
                    <img
                        class="video-thumbnail_dummy"
                        v-if="videoMask"
                        :src="data.thumbnails.high.url">
                </div>
            </div>
            <div class="video-info_holder">
                <div>
                    <div>
                        <div>
                            <h4>{{ title }}</h4>
                            <button v-on:click="wipe">ワイプ</button>
                            <button v-on:click="play">プレイヤー</button>
                            <button v-on:click="$emit('openDescription',data)">詳細</button>
                            <a :href="`https://www.youtube.com/watch?v=${data.id}`" target="_blank">YouTube</a>
                            <div
                                v-on:click="$emit('openChannel', channel.id)"
                                class="channel-info_holder">
                                <img class="channel-thumbnail" :src="channelThumbnail">
                                <h5>{{ channelTitle }}</h5>
                            </div>
                            <div
                                class="video-description_holder"
                                v-on:wheel.stop="">
                                <div>{{ data.description }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="scroll-message" style="">↓↓ホイールスクロールで切り抜き情報↓↓</p>
        </div>
        <ul
            class="quote-video-list"
            :style="`height: ${quoteVideoListHeight};`"
            v-on:wheel="handleOnWheelQuoteVideoList">
            <li
                v-for="quoteVideo in quoteVideos"
                :key="quoteVideo.id">
                <img :src="quoteVideo.thumbnails.default.url">
                <div>
                    <h5>{{ quoteVideo.title + `(${quoteVideo.id})`}}</h5>
                    <button v-on:click="$emit('wipe', quoteVideo)">ワイプ</button>
                    <button v-on:click="$emit('play', quoteVideo)">プレイヤー</button>
                    <a :href="`https://www.youtube.com/watch?v=${quoteVideo.id}`" target="_blank">YouTube</a>
                </div>
            </li>
        </ul>
    </div>
</template>
<style scoped>
.video-infomation-unit {
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    align-items:center;
    width:100%;
    padding:24px 0;
}
.close-button {
    width:50px;
    height:50px;
    position:absolute;
    right:30px;
    top:30px;
    border:solid 1px black;
    background-color:rgba(255,255,255,.3);
    text-align:center;
    line-height:50px;
}
.video_holder {
    width:30%;
    padding:0 20px;
    display:flex;
    align-items:center;
    overflow:hidden;
}
.video_holder > div {
    position:relative;
    width:100%;
    padding-top:57%;
}
.video-info_holder {
    width:50%;
}
.video-info_holder > div {
    padding-top:34.2%;
    position:relative;
}
.video-info_holder > div > div {
    position:absolute;
    height:100%;
    width:100%;
    left:0;top:0;
    display:flex;
    align-items:center;
}
.video-info_holder > div > div > div {
    width:100%;
    height:100%;
}
.video-thumbnail_dummy {
    width:100%;
    position:absolute;
    left:0;top:50%;
    transform: translate(0, -50%);
}
.channel-info_holder {
    width:100%;
    display:flex;
    padding:12px 8px;
    cursor:pointer;
}
.channel-thumbnail {
    width:36px;
    border-radius:18px;
}
.channel-info_holder h5 {
    font-size:16px;
    line-height:36px;
    margin-left:16px;
}
.video-description_holder {
    width:100%;
    height:calc(100% - 4em - 60px);
    overflow-y:scroll;
}
.video-description_holder > div {
    padding:4px;
    word-break:break-all;
    white-space:pre-wrap;
    font-size:0.8em;
}
.quote-video-list {
    width:80%;
    margin:16px auto;
    list-style:none;
    overflow-y:scroll;
}
.quote-video-list li {
    display:flex;
}
.scroll-message {
    text-align:center;
    color:white;
    font-weight:bold;
    width:100%;
    padding:16px 0;
}
</style>
<script>
import YouTubeIFrame from '~/components/YouTubeIFrame.vue'
export default {
    data() {
        return {
            quoteVideoListHeight: 'auto',
            quoteVideos: [],
            elmInfoUnit: false,
            videoMask: true,
            videoStatus: false
        }
    },
    methods: {
        handleOnWheelQuoteVideoList(e) {
            let [elmQVList] = document.getElementsByClassName('quote-video-list');

            if(elmQVList.clientHeight < elmQVList.scrollHeight) {

                if(elmQVList.scrollTop == 0 && e.deltaY < 0) {

                } else if((elmQVList.clientHeight + elmQVList.scrollTop) == elmQVList.scrollHeight && e.deltaY > 0) {

                } else {
                    e.stopPropagation();
                }
            }
        },
        getQuoteVideo(vId) {
            this.$api.request("quoteVideos/"+vId)
                .then(res => {
                    console.log(res.data);
                    if(res.data.result == 'success') {
                        this.quoteVideos = res.data.data;
                    } else {
                        this.quoteVideos = [];
                    }
                    return res.data;
                })
                .catch(e=>{

                });
        },
        handleOnWheel(e) {
            this.$emit('wheel',e);
            this.quoteVideoListHeightUpdate();
        },
        quoteVideoListHeightUpdate() {
            if(this.initialHeight !== undefined) {
                this.quoteVideoListHeight = `calc(100% - ${this.initialHeight}px - 32px)`;
            } else {
                this.quoteVideoListHeight = 'auto';
            }
        },
        videoChangeStatus(status) {
            console.log(status);
            this.videoStatus = status;
        },
        wipe() {
            this.$emit('wipe', this.data);
            if(this.videoStatus == 1) {
                this.$refs.infoVideo.pause();
            }
        },
        play() {
            this.$emit('play', this.data);
            if(this.videoStatus == 1) {
                this.$refs.infoVideo.pause();
            }
        }
    },
    computed: {
        title() {
            return this.data && this.data.title ? this.data.title : 'none';
        },
        initialHeight() {
            return this.elmInfoUnit && this.elmInfoUnit.clientHeight ? this.elmInfoUnit.clientHeight : 0;
        },
        channelThumbnail() {
            return this.channel && this.channel.thumbnails
                ? this.channel.thumbnails.medium.url
                : '/favicon.ico';
        },
        channelTitle() {
            return this.channel && this.channel.title
                ? this.channel.title
                : 'not found';
        },
        channel() {
            let channelDat = {id:false,thumbnails:false,title:'error'};
            for(let channel of this.channelList) {
                if(channel.id === this.data.channelId) {
                    channelDat = channel;
                    break;
                }
            }
            return channelDat;
        }
    },
    watch: {
        data(newdata, olddata) {
            this.getQuoteVideo(newdata.id);
        }
    },
    props: ['data','channelList'],
    components: {
        YouTubeIFrame
    },
    mounted() {
        this.getQuoteVideo(this.data.id);
        this.quoteVideoListHeightUpdate();
        [this.elmInfoUnit] = document.getElementsByClassName('video-infomation-unit');
        this.$parent.videoInfomationOffset = this.initialHeight;
    }
}
</script>

