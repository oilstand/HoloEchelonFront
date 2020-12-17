<template>
    <div v-on:wheel="handleOnWheel" class="" style="">
        <div class="close-button" v-on:click="$emit('close')" style="">x</div>
        <div class="video-infomation-unit" style="">
            <div :style="`width:30%;padding:0 20px;display:flex;align-items:center;`">
                <YouTubeIFrame :vid="data.id" style="width:100%;" />
            </div>
            <div style="width:50%;">
                <h4>{{ title }}</h4>
                <button v-on:click="$emit('wipe', data)">ワイプ</button>
                <button v-on:click="$emit('play', data)">プレイヤー</button>
                <a :href="`https://www.youtube.com/watch?v=${data.id}`" target="_blank">YouTube</a>
                <div style="width:300px;background-color:white;color:red;">
                    <p>idx:{{ data.idx }}</p>
                    <p>start:{{ data.actualStartTime }}</p>
                    <p>end:{{ data.actualEndTime }}</p>
                    <p>scheduled:{{ data.scheduledStartTime }}</p>
                    <p>channelId:{{ data.channelId }}</p>
                    <p>vid:{{ data.id }}</p>
                </div>
            </div>
        </div>
        <p style="text-align:center;color:white;font-weight:bold;width:100%;">↓↓ホイールスクロールで切り抜き情報↓↓</p>
        <ul class="quote-video-list" :style="`height: ${quoteVideoListHeight};`" v-on:wheel="handleOnWheelQuoteVideoList">
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
.quote-video-list {
    width:80%;
    margin:16px auto;
    list-style:none;
    overflow-y:scroll;
}
.quote-video-list li {
    display:flex;
}
</style>
<script>
import YouTubeIFrame from '~/components/YouTubeIFrame.vue'
export default {
    data() {
        return {
            quoteVideoListHeight: 'auto',
            quoteVideos: []
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
            let [elmInfoUnit] = document.getElementsByClassName('video-infomation-unit');
            if(elmInfoUnit) {
                this.quoteVideoListHeight = `calc(100% - ${elmInfoUnit.clientHeight}px - 32px)`;
            } else {
                this.quoteVideoListHeight = 'auto';
            }
        }
    },
    computed: {
        title() {
            return this.data && this.data.title ? this.data.title : 'none';
        }
    },
    watch: {
        data(newdata, olddata) {
            this.getQuoteVideo(newdata.id);
        }
    },
    props: ['data'],
    components: {
        YouTubeIFrame
    },
    mounted() {
        this.getQuoteVideo(this.data.id);
        this.quoteVideoListHeightUpdate();
    }
}
</script>

