<template>
    <div :id="randId">
    </div>
</template>

<script>
export default {
  data() {
    return {
        ytPlayer: false
    }
  },
  methods: {
    videoLoad() {
        const elmParent = document.getElementById(this.randId);
        console.log(this.randId);

        this.ytPlayer = new YT.Player(
            this.randId, // 埋め込む場所の指定
            {
                width: elmParent.clientWidth, // プレーヤーの幅
                height: Math.floor(elmParent.clientWidth * 36 / 64), // プレーヤーの高さ
                events: {
                    onReady: ()=>{
                        this.ytPlayer.cueVideoById(this.vid);
                    }
                }
            }
        );
    }
  },
  props: ['vid'],
  watch: {
      vid: function(newval, oldval) {
          this.ytPlayer.cueVideoById(newval);
      }
  },
  computed: {
      randId() {
          return 'vid_' + (Math.floor(Math.random() * 65536)).toString();
      }
  },
  mounted() {
    if(YT && YT.Player) {
        this.videoLoad();
    } else {
        window.onload = () =>{
            this.videoLoad();
        };
    }
  }
}
</script>
<style>

</style>
