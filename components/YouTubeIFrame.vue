<template>
    <div :id="randId">
    </div>
</template>

<script>
export default {
  data() {
    return {
        ytPlayer: false,
        isReady: false
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
                        this.isReady = true;
                        this.handleOnReady(this.vid);
                        this.$emit('ready');
                    },
                    onStateChange: (state)=>{
                        this.$emit('changeStatus', state.data);
                    }
                }
            }
        );
    },
    handleOnReady(vid) {

        if(this.mute == 1)this.ytPlayer.mute();

        if(this.autoplay == 1) {
            this.ytPlayer.loadVideoById(vid);
        } else {
            this.ytPlayer.cueVideoById(vid);
        }
    },
    pause() {
        if(this.isReady) {
            this.ytPlayer.pauseVideo();
        }
    },
    play() {
        if(this.isReady) {
            this.ytPlayer.playVideo();
        }
    },
    soundMute() {
        if(this.isReady) {
            this.ytPlayer.mute();
        }
    },
    soundUnmute() {
        if(this.isReady) {
            this.ytPlayer.unmute();
        }
    }
  },
  props: ['vid','autoplay','mute'],
  watch: {
      vid: function(newval, oldval) {
          this.handleOnReady(newval);
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
