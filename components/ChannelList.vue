<template>
    <div
        style="background-color:rgba(0,0,0,.8);">
        <ul class="channel-list">
            <li
                v-for="channel in channelList"
                v-on:click="$emit('openChannel', channel.id)"
                :key="`cl_${channel.id}`">
                    <img
                        :src="channel.thumbnails.medium.url"
                        >
                    <p>{{ channel.title }}</p>
                </li>
        </ul>
        <div class="close-button"
            v-on:click="$emit('close')"
            >x
        </div>
    </div>
</template>
<style scoped>
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
    cursor:pointer;
}
.channel-list {
    display:flex;
    padding:8px 32px;
    width:calc(100% - 64px);
    height:calc(100% - 16px);
    overflow-y:scroll;
    color:white;
    flex-wrap: wrap;
    list-style: none;
}
.channel-list > li {
    width:calc(50% - 32px);
    display:flex;
    padding:8px 16px;
    transition:all 0.3s;
    cursor:pointer;
}
.channel-list > li:hover {
    background-color:rgba(255,255,255,.3);
}
.channel-list > li > img {
    width:36px;
    border-radius:18px;
}
.channel-list > li > p {
    margin-left:8px;
    line-height:36px;
}
</style>
<script>

export default {
    data() {
        return {
        }
    },
    methods: {
    },
    computed: {
    },
    watch: {
    },
    components: {  },
    props: ['channelList'],
    async mounted() {
    }
}
</script>

