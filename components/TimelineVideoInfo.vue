<template>
    <div v-on:wheel="handleOnWheel">
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
                            <a class="yt_link" :href="`https://www.youtube.com/watch?v=${data.id}`" target="_blank">YouTube</a>
                            <NuxtLink
                                :to="`/channel/${channel.id}`"
                                class="channel-info_holder">
                                <img class="channel-thumbnail" :src="channelThumbnail">
                                <h5>{{ channelTitle }}</h5>
                            </NuxtLink>
                            <div
                                class="video-description_holder"
                                v-on:wheel.stop="">
                                <input type="checkbox" id="desc_accordion_checkbox">
                                <div>{{ data.description }}</div>
                                <label for="desc_accordion_checkbox" class="desc_accordion_label">クリックで展開</label>
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
                    <h5>{{ quoteVideo.title }}</h5>
                    <button v-on:click="$emit('wipe', quoteVideo)">ワイプ</button>
                    <a :href="`https://www.youtube.com/watch?v=${quoteVideo.id}`" target="_blank">YouTube</a>
                </div>
            </li>
        </ul>
        <div class="close-button" v-on:click="$emit('close')">x</div>
    </div>
</template>
<style scoped>
.scroll-message {
    text-align:center;
    color:white;
    font-weight:bold;
    width:100%;
    padding:16px 0;
}
.video_holder {
    display:flex;
    align-items:center;
    overflow:hidden;
}
.video-info_holder > div {
    position:relative;
}
.video-info_holder > div > div {
    display:flex;
    align-items:center;
}
.close-button {
    width:50px;
    height:50px;
    border:solid 1px #404040;
    background-color:rgba(255,255,255,.3);
    text-align:center;
    line-height:50px;
}
.video-description_holder {
    width:100%;
}
.video-description_holder > div {
    word-break:break-all;
    white-space:pre-wrap;
    font-size:0.8em;
}
#desc_accordion_checkbox {
    position:absolute;
    width:0;height:0;
    overflow:hidden;
}
.quote-video-list {
    list-style:none;
    overflow-y:scroll;
}
.quote-video-list li {
    display:flex;
}
@media screen and (max-width:599px) {
    .scroll-message {
        display:none;
    }
    .video_holder {
        width:100%;
        padding:0 16px;
    }
    .video-info_holder {
        width:100%;
        padding: 12px 16px;
    }
    .close-button {
        position:fixed;
        right:30px;
        bottom:30px;
        border-radius:25px;
    }
    #desc_accordion_checkbox~div {
        max-height:200px;
    }
    #desc_accordion_checkbox:checked~div {
        max-height:initial;
    }
    .video-description_holder {
        position:relative;
        overflow-y:hidden;
    }
    .desc_accordion_label {
        position:absolute;
        bottom:0;left:0;
        display:block;
        width:100%;
        padding:16px 0;
        text-align:center;
        background-color: #383838;
    }
    #desc_accordion_checkbox:checked~.desc_accordion_label {
        display:none;
    }
    .quote-video-list {
        width:calc(100% - 24px);
        padding:0 12px;
    }
    .quote-video-list li {
        margin-top: 8px;
    }
    .quote-video-list h5 {
        overflow: hidden;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
    }
}
@media screen and (min-width:600px) {
    .video_holder {
        width:30%;
        padding:0 20px;
    }    
    .video-info_holder {
        width:50%;
    }
    .video-info_holder > div {
        padding-top:34.2%;
    }
    .video-info_holder > div > div {
        position:absolute;
        height:100%;
        width:100%;
        left:0;top:0;
    }
    .close-button {
        position:absolute;
        right:30px;
        top:30px;
    }
    .video-description_holder {
        height:calc(100% - 4em - 60px);
        overflow-y:scroll;
    }
    .video-description_holder > div {
        padding:4px;
    }
    .quote-video-list {
        width:80%;
        margin:16px auto;
    }
}
.video-infomation-unit {
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    align-items:center;
    width:100%;
    padding:24px 0 12px;
}
.video_holder > div {
    position:relative;
    width:100%;
    padding-top:57%;
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
    display:block;
    text-decoration:none;
    color:white;
    width:100%;
    display:flex;
    padding:12px 8px;
    cursor:pointer;
}
.channel-thumbnail {
    width:36px;
    height:36px;
    border-radius:18px;
}
.channel-info_holder h5 {
    font-size:16px;
    line-height:36px;
    margin-left:16px;
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
            this.$api.cRequest("quoteVideos/"+vId, 60 * 15)
                .then(res => {
                    if(res.result == 'success') {
                        this.quoteVideos = res.data;
                    } else {
                        this.quoteVideos = [];
                    }
                    console.log(`quoteVideo(${vId}):`+res.result);
                    return res;
                })
                .catch(e=>{

                });

        },
        handleOnWheel(e) {
            this.$emit('wheel',e);
            this.quoteVideoListHeightUpdate();
        },
        quoteVideoListHeightUpdate() {
            if(this.initialHeight !== undefined && !this.$isSP()) {
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

