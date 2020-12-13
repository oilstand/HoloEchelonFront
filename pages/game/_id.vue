<template>
    <div>
        <h2>ゲーム: 「Minecraft」の配信</h2>
        <div class="timeline_wrapper">
            <div class="timeline" :style="`background-size:${bgsize}px;background-image: linear-gradient(90deg, transparent ${bgsize - 2}px, #333 ${bgsize}px);height:500px;`">
                <client-only placeholder="Loading...">
                <Bar v-for="(video, index) in videos" :key="video.id" :data="video" :start="start" :end="end" :style="`top:${video.topIndex * 52 + 50}px`"/>
                <Label v-for="(label, index) in dateLabels" :key="`d_${index}`" :data="label" :start="start" :end="end" />
                <Label v-for="(label, index) in hoursLabels" :key="`h_${index}`" :data="label" :start="start" :end="end" style="top:1em;" />
                </client-only>
            </div>
        </div>
        <table>
            <tbody>
                <tr v-for="video in videos" :key="video.id"><td><img :src="video.thumbnails.medium.url"></td><td>{{video.title}}</td><td>{{video.id}}</td><td>{{video.publishedAt}}</td><td></td></tr>
            </tbody>
        </table>
    </div>
</template>
<style>
.timeline_wrapper {
    width:100%;
    overflow-x:scroll;
}
.timeline { 
    position:relative;
    width:700%;
    overflow:hidden;
}
</style>
<script>
import axios from 'axios'
import Bar from '~/components/TimelineBar.vue'
import Label from '~/components/TimelineLabel.vue'

export default {
    async asyncData({ params }) {

        let res = await axios.get( 'https://api2-dot-holoshift.an.r.appspot.com/api/gameVideos/'+params.id )
            .catch((e) => {
                console.log("catch request error");
                console.log(e);
                return false;
            });

        let videos = [];
        if(res && res.data && res.data.data) {
            res.data.data.reverse();
            for(let video of res.data.data) {
                let yindex = 0;
                let date1 = new Date(video.actualStartTime);

                for(let i = videos.length - 1; i >= 0; i--) {
                    let date2 = new Date(videos[i].actualStartTime);
                    date2.setHours(date2.getHours() + 12);

                    if(date1 < date2) {
                        let date3 = new Date(videos[i].actualEndTime);
                        if(date1 < date3) {
                            yindex = yindex > videos[i].topIndex ? yindex : videos[i].topIndex + 1;
                        }
                    } else {
                        break;
                    }
                }
                video.topIndex = yindex;
                videos.push(video);
            }
        }

        return {videos:videos};
    },
    data: function(){
        return {
            //postで送信するためのリクエストデータ初期化
            videos: [],
            elmTimeline: null
        }
    },
    methods: {
    },
    computed: {
        startTimeStr() {
            let now = new Date();
            now.setDate(now.getDate() - 7);
            return this.$formatDate(now, 'yyyy-MM-dd 23:59:59');
        },
        endTimeStr() {
            let now = new Date();
            now.setDate(now.getDate() - 1);
            return this.$formatDate(now, 'yyyy-MM-dd 23:59:59');
        },
        start() {
            return new Date(this.startTimeStr).getTime();
        },
        end() {
            return new Date(this.endTimeStr).getTime();
        },
        bgsize() {
            return 3600000/(this.end - this.start)*this.timelineWidth;
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
        Bar,    Label
    },
    mounted() {
        let [tmpelm] = document.getElementsByClassName('timeline');
        this.elmTimeline = tmpelm;
    }
}
</script>
