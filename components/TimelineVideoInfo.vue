<template>
    <div class="" style="">
        <div class="close-button" v-on:click="$emit('close')" style="">x</div>
        <div class="video-infomation-unit" style="">
            <div :style="`width:30%;padding:0 20px;display:flex;align-items:center;`">
                <YouTubeIFrame :vid="data.id" style="width:100%;" />
            </div>
            <div style="width:50%;">
                <h4>{{ title }}</h4>
                <div style="width:300px;background-color:white;color:red;">
                    <p>idx:{{ data.idx }}</p>
                    <p>start:{{ data.actualStartTime }}</p>
                    <p>end:{{ data.actualEndTime }}</p>
                    <p>scheduled:{{ data.scheduledStartTime }}</p>
                    <p>channelId:{{ data.channelId }}</p>
                </div>
            </div>
        </div>
        <ul class="quote-video-list">
            <li v-for="quoteVideo in quoteVideos" :key="quoteVideo.id">
                <img :src="quoteVideo.thumbnails.default.url">
                <p>{{ quoteVideo.title + `(${quoteVideo.id})`}}</p>
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

}
</style>
<script>
import YouTubeIFrame from '~/components/YouTubeIFrame.vue'
export default {
    data() {
        return {
            quoteVideos: []
        }
    },
    methods: {
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
    }
}
</script>

