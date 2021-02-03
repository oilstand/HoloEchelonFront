<template>
    <div
        class="overlay-window"
        style="background-color:rgba(0,0,0,.8);">
        <ul class="channel-list">
            <li
                v-for="channel in channelList"
                :key="`cl_${channel.id}`">
                    <NuxtLink :to="`/channel/${channel.id}`">
                        <img
                            :src="channel.thumbnails.medium.url"
                            >
                        <p>{{ channel.title }}</p>
                    </NuxtLink>
                </li>
        </ul>
        <NuxtLink to="/" class="close-button">×</NuxtLink>
    </div>
</template>
<style scoped>
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
    data() {
        return {
            channelList: []
        }
    },
    methods: {
    },
    computed: {
    },
    watch: {
    },
    components: {  },
    async mounted() {
        let res;
        if(res = await this.$api.cRequest("channelList", 60 * 15)) {
            if(res.data) {
                this.channelList = res.data;
            }
        }
    }
}
</script>

