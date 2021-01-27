<template>
  <div class="main-body">
    <header id="header">
        <h1>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113.55 189.23" style="height:48px;fill:#f9f9f9;"><defs><style>.a{fill:#f9f9f9;}</style></defs><polygon class="a" points="29 73.94 58 189.23 0 189.23 29 73.94"/><path class="a" d="M346.91,217.23c-8.21-25-13.73-62-11.71-85.95-13,23.46-12.4,70.48-5.43,91.74s34.56,59.88,59,70.89C372.87,275.92,355.2,242.5,346.91,217.23Z" transform="translate(-303 -117.77)"/><ellipse class="a" cx="378.12" cy="206.96" rx="29" ry="93.5" transform="translate(-348.66 10.32) rotate(-18.15)"/></svg>
            <router-link to="/">
                <span>HoloEchelon</span>
            </router-link>
        </h1>
        <input type="checkbox" id="right-menu_check">
        <label for="right-menu_check" class="right-menu_icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </label>
        <div class="right-menu_wrapper">
            <label for="right-menu_check" class="right-menu_label"></label>
            <div class="right-menu">
                <label for="right-menu_check" class="right-menu_button">close</label>
                <ul v-on:click="closeRightMenu">
                    <li
                        v-on:click="clickChannelButton"><a>チャンネル一覧</a></li>
                </ul>
            </div>
        </div>
    </header>
    <nuxt class="main-area"/>
  </div>
</template>

<style>
* {
    margin:0;padding:0;
}
body {
    background-color:#F9F9F9;
}
.main-body {
}
header {
    display:flex;
    background-color: #2e2e2e;
}
header h1 {
    height:100%;
    display:flex;
}
header h1 a {
    display:block;
    height:100%;
    position:relative;
    vertical-align:middle;
}
header h1 img {
    display:inline-block;
    position:absolute;
}
header h1 span {
    display:inline-block;
    color:#f9f9f9;
    font-weight: 500;
}
.right-menu_wrapper {
    margin-left:auto;
}
.right-menu_wrapper ul {
    display:flex;
    flex-wrap:wrap;
    list-style:none;
    padding:0;
    align-items:center;
    justify-content:flex-end;
    text-align:center;
}
#right-menu_check {
    width:0px;
    height:0px;
    position:fixed;
    right:0;bottom:0;
    overflow:hidden;
    opacity:0;
}
@media screen and (max-width:959px) {
    header {
        height:50px;
        padding: 8px 16px;
    }
    header h1 a {
        line-height:50px;
    }
    header h1 img {
        height: 32px;
        top: calc((100% - 32px)/2);
    }
    header h1 span {
        padding-left:calc(2px + 8px);
        font-size:24px;
    }
    .right-menu_icon {
        width:50px;
        height:50px;
        margin-left:auto;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .right-menu_label {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.4);
        top: 0;
        left: 0;
        opacity:0;
        transition:opacity .4s;
    }
    #right-menu_check:checked~.right-menu_wrapper>.right-menu_label {
        opacity:1;
    }
    .right-menu_button {
        display:block;
        width:100%;
        padding: 4px 0;
        text-align:center;
    }
    .right-menu_wrapper {
        position:fixed;
        right:0;top:0;
        height:0%;
        width:100%;
        overflow:hidden;
        transition:height 0s 0.4s;
        z-index:10;
    }
    #right-menu_check:checked~.right-menu_wrapper {
        height:100%;
        transition:height 0s 0s;
    }
    .right-menu_wrapper ul {
        width:100%;
    }
    .right-menu_wrapper ul li {
        width:100%;    
    }
    .right-menu_wrapper a {
        padding: 8px 0;
    }
    .right-menu {
        position:absolute;
        right:0;top:0;
        background-color:#F9F9F9;
        height:100%;
        transition:transform .3s;
        transform: translate3d(100%, 0, 0px);
        max-width: 65%;
    }
    #right-menu_check:checked~.right-menu_wrapper>.right-menu {
        transform: translate3d(0, 0, 0px);
    }
    #menu_sitemap {
        display:none;
    }
}
@media screen and (min-width:960px) {
    header {
        height: 48px;
        padding: 8px 32px;
    }
    header h1 a {

    }
    header h1 img {
        height: 45px;
        top: calc((100% - 45px)/2);
    }
    header h1 span {
        padding-left:16px;
    }
    .right-menu_icon {
        display:none;
    }
    .right-menu_wrapper > div {
        height:100%;
    }
    .right-menu_wrapper ul {
        height:50%;
    }
    .right-menu_wrapper ul li {
        width:150px;    
    }
    .right-menu_label, .right-menu_button {
        display:none;
    }
    .sp-only {
        display:none;
    }
}
.main-area {
    min-height: calc(100vh - 64px);
    background-color:#f7f7f7;
}
.right-menu_wrapper a {
    display:block;
    width:100%;
    height:100%;
    text-decoration:none;
    color:#f9f9f9;
    font-weight:400;
    transition: border .2s ease-out;
    border-bottom:solid 3px transparent;

}
.right-menu_wrapper a:hover {
    border-bottom:solid 3px lightpink;
}
</style>

<script>
export default {
  head() {
    return {
        htmlAttrs: {
            lang: 'ja'
        }
    }
  },
  data () {
    return {
    }
  },
  methods: {
      closeRightMenu(event) {
          const elmCheckbox = document.getElementById('right-menu_check');
          if(elmCheckbox) {
              elmCheckbox.checked = false;
          } else {
              console.log('err checkbox notfound');
          }
      },
      clickChannelButton() {
          this.$nuxt.$emit('headerControlChannel');
      }
  },
  computed: {
  },
  mounted() {
  },
  head: {
    script: [
      { src: 'https://www.youtube.com/iframe_api' }    ]
  }
}
</script>
