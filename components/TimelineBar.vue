<template>
    <div class="bar" :idx="data.idx" :style="`background-color:${color};left: calc(${left * 100}% + ${borderOffset}px);width: calc(${width * 100}% + ${borderOffset * 2}px);border:solid ${borderOption};`">
        <p class="title-disp">{{ title }}</p>
        <p class="channnel-disp">{{ channel }}</p>
        <div v-if="false" :class="`more_info ${edgeClass}`">
            <img :src="data.thumbnails.medium.url">
            <h4>{{ title }}</h4>
            <div style="position:absolute;left:0;top:0;width:300px;background-color:white;color:red;">
                <p>idx:{{ data.idx }}</p>
                <p>start:{{ data.actualStartTime }}</p>
                <p>end:{{ data.actualEndTime }}</p>
                <p>scheduled:{{ data.scheduledStartTime }}</p>
                <p>channelId:{{ data.channelId }}</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.bar {
    position:absolute;
    border:solid 1px gray;
    width:100px;
    height:42px;
    cursor: pointer;
}

.title-disp {
    width:100%;
    overflow:hidden;
    font-size:0.6em;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-height:1.4em;
}
.channnel-disp {
    width:100%;
    overflow:hidden;
    font-size:0.6em;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
.more_info {
    background-color: #f7f7f7;
}
.more_info img {
    vertical-align: top;
}
.more_info h4 {
    -webkit-line-clamp: 2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
.bar > .more_info {
    overflow:hidden;
    position:absolute;
    height: 0;
    opacity: 0;
    transition:height 0s 0.28s, opacity 0.3s;
    z-index:100;
}
.bar:hover > .more_info {
    height: calc(180px + 1.5em * 2);
    opacity: 1;
    transition:height 0s 0s, opacity 0.3s;
}
.left-edge {
    top:0;
    left: calc(100% + 1px);
}
.right-edge {
    top:0;
    right: calc(100% + 1px);
}
.def-pos {
    top:100%;
    left:0;
}
</style>
<script>
export default {
    data() {
        return {
        }
    },
    methods: {
        getRandomColor() {
            return '#'
                + ('00'+(Math.floor(Math.random() * 0xbf) + 0x40).toString(16)).slice(-2)
                + ('00'+(Math.floor(Math.random() * 0xbf) + 0x40).toString(16)).slice(-2)
                + ('00'+(Math.floor(Math.random() * 0xbf) + 0x40).toString(16)).slice(-2);
        }
    },
    computed: {
        color() {
            return this.data.liveBroadcastContent == 'suspended'
                    ? 'gray'
                    :this.data.color != ''
                        ? this.data.color
                        : this.getRandomColor();
        },
        borderOption() {
            return this.data.liveBroadcastContent == 'live'
                    ? '2px #ff5151'
                    : '1px gray';
        },
        left() {
            return (this.startTime - this.start) / this.maxWidth;
        },
        width() {
            return this.streamLength / this.maxWidth;
        },
        title() {
            return this.data && this.data.title ? this.data.title : 'none';
        },
        channel() {
            return this.data && this.data.channelTitle ? this.data.channelTitle : 'none';
        },
        startTime() {
            return this.data.startTime;
        },
        endTime() {
            return this.data.endTime;
        },
        borderOffset() {
            let val = -1;
            if(this.data
                && this.data.liveBroadcastContent
                && this.data.liveBroadcastContent === 'live') {
                    val--;
                }
            return val;
        },
        streamLength() {
            return this.endTime - this.startTime;
        },
        maxWidth() {
            return this.end - this.start;
        },
        edgeClass() {
            return this.left < 0.05
                    ?'left-edge'
                    : this.left > 0.95
                        ?'right-edge'
                        :'def-pos';
        }
    },
    watch: {
    },
    props: ['data','start','end'],
    mounted() {
    }
}
</script>

