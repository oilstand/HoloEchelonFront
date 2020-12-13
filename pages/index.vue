<template>
    <div>
        <section class="section_news">
            <h2>data viewer</h2>
            <ol>
                <li v-for="channel in channels" :key="channel.id" v-on:click="selectChannel = channel.id">{{ channel.title + ' : ' +channel.id }}</li>
            </ol>
        </section>
        <ChannelData :channelId="selectChannel"/>
    </div>
</template>
<style>
.section_news ol {
    margin:0 auto;
    text-align:left;
}
.press_label {
    color:white;
    font-weight:300;
    background-color:gray;
}
.section_news li {
    list-style: none;
}
@media screen and (max-width:959px) {
    .section_news ol {
        width:100%;
    }
    .press_label {
        padding: 0 4px;
    }
    .section_news {
        text-align:center;
        padding: 16px 8px;
    }
    .section_pickup {
        text-align:center;
        padding: 16px 4px;
    }
    .section_news li {
        padding: 8px 0;
        display:flex;
        align-items:center;
        font-size:0.9em;
    }
    .news_head {
        white-space: pre-line;
        display:block;
    }
    .news_title {
        margin-left:12px;
        display:block;
        width:70%;
    }
}
@media screen and (min-width:960px) {
    .section_news ol {
        width:80%;
    }
    .section_news, .section_pickup {
        text-align:center;
        padding: 16px;
    }
    .section_news li {
        padding: 4px 0;
        white-space: nowrap;
    }
    .press_label {
        padding: 0 16px;
    }
    .news_title {
        padding-left:20px;
        display:inline-block;
        width:50%;
    }
}
.section_news h2, .section_pickup h2 {
    margin: 16px 0;
}
.section_news li a {
    text-decoration:none;
    color:black;
    transition:background-color .2s;
}
.section_news li a:hover {
    background-color:#ffecef;
}
.section_news p {
    margin: 16px;
}
.news-button {
    display: inline-block;
    border: solid 1px gray;
    padding: 4px 16px;
    text-decoration: none;
    color: black;
}
.news_head {
    display:inline-block;
    width:40%;
    text-align:right;
}

</style>
<script>
import axios from 'axios'
import ChannelData from '~/components/ChannelData.vue'

export default {
  async asyncData({ params }) {
  },
  data () {
    return {
        channels: [],
        selectChannel: ''
    }
  },
  methods: {
  },
  computed: {
  },
  components:{ ChannelData },
  mounted() {

    console.log('mounted');
    this.$api.request("channelList")
        .then(res => {
            //console.log(JSON.stringify(res));
            console.log(res.data);
            if(res.data.result === 'success') {
                this.channels = res.data.data;
            }
            return res.data;
        })
        .catch(e=>{

        });
  },
  head() {
    return {
    }
  }
}
</script>
