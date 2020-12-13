<template>
    <div>
        <table>
            <tbody>
                <tr v-for="video in videos" :key="video.id"><td><img :src="video.thumbnails.medium.url"></td><td>{{video.title}}</td><td>{{video.id}}</td><td>{{video.publishedAt}}</td><td></td></tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
  data() {
    return {
        videos: []
    }
  },
  methods: {
  },
  computed: {
      channelName() {
          return 'aaa';//this.channelData && this.channelData.id ? this.channelData.id : 'none'; 
      }
  },
  watch: {
      channelId(newId, oldId) {

        if(!newId)return;

        this.$api.request("channelVideos/"+newId)
        .then(res => {
            //console.log(JSON.stringify(res));
            console.log(res.data);
            if(res.data.result === 'success') {
                this.videos = res.data.data;
            }
            return res.data;
        })
        .catch(e=>{

        });

      }
  },
  props: ['channelId'],
  mounted() {
    this.$api.request("gameVideos/1")
    .then(res => {
        //console.log(JSON.stringify(res));
        console.log(res.data);
        if(res.data.result === 'success') {
            this.videos = res.data.data;
        }
        return res.data;
    })
    .catch(e=>{

    });

  }
}
</script>
<style>

</style>
