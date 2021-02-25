<template>
    <div style="display:flex;justify-content:center;align-items:center;">
        <div>
            <h3 style="margin: 20px 0 10px;">プライバシーポリシー</h3>
            <h4 style="margin: 5px 0;">アクセス解析ツールについて</h4>
            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。<br>
            Googleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。<br>
            このトラフィックデータは匿名で収集されており個人を特定するものではありません。<br>
            この機能はCookieを無効にすることで収集を拒否することが出来ます。<br>
            Cookieの無効化状態はお使いのブラウザの設定をご確認ください。<br>
            この規約に関しては<a target="_blank" href="https://marketingplatform.google.com/about/analytics/terms/jp/">Googleアナリティクス利用規約(https://marketingplatform.google.com/about/analytics/terms/jp/)</a>をご確認ください。<br>
            <br>
            <h4 style="margin: 5px 0;">YouTube Data APIの利用について</h4>
            当サイトでは、チャンネル・動画の情報を取得するためにYouTube Data APIを利用しています。<br>
            YouTube Data APIは、YouTubeの利用規約、 およびGoogleのプライバシーポリシーに基づいて提供されています。<br>
            YouTubeの利用規約に関して詳しくは<a target="_blank" href="https://www.youtube.com/t/terms">YouTube利用規約(https://www.youtube.com/t/terms)</a>をクリックしてください。<br>
            Googleのプライバシーポリシーに関して詳しくは<a target="_blank" href="https://policies.google.com/privacy">Googleプライバシーポリシー(https://policies.google.com/privacy)</a>をクリックしてください。<br>
            <br>
            <h4 style="margin: 5px 0;">当サービスの運営により収集される情報について</h4>
            当サイトで掲載されている情報は本人からの要請があれば削除を行います。<br>
            問い合わせは<a target="_blank" href="https://twitter.com/OIL_STAND">開発者のTwitterアカウント</a>へお願いいたします<br>
            <br>
            <hr>
            
            <h4 style="margin: 5px;">免責事項</h4>
            当サイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。権利を侵害する目的はありません。<br>
            記事の内容や掲載画像等に問題がございましたら、各権利所有者様が<a target="_blank" href="https://twitter.com/OIL_STAND">開発者のTwitterアカウント</a>へご連絡下さい。<br>
            <br>
            当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。<br>
            当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり情報が古くなっていることもあります。<br>
            当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
        </div>

    </div>
</template>
<style>
</style>
<script>

export default {
    head() {
        return {
            htmlAttrs: {
                lang: 'ja'
            },
            title: 'プライバシーポリシー',
            meta: [
                { hid: 'description', name: 'description', content: `ホロライブの配信スケジュールをチェック！切り抜き動画のチェックや複窓再生もできます。` },
                { hid: 'keywords', name: 'keywords', content: 'ホロライブ,配信スケジュール,複窓ツール,VTuber,切り抜き動画' },
                { hid: 'og:site_name', property: 'og:site_name', content: 'HoloEchelon ホロライブスケジュール' },
                { hid: 'og:type', property: 'og:type', content: 'website' },
                { hid: 'og:url', property: 'og:url', content: 'https://holoechelon.com/' + this.$nuxt.$route.path },
                { hid: 'og:title', property: 'og:title', content: `プライバシーポリシー | HoloEchelon ホロライブスケジュール` },
                { hid: 'og:description', property: 'og:description', content: 'ホロライブの配信スケジュールをチェック！切り抜き動画のチェックや複窓再生もできます。' },
                { name: 'twitter:card', content: 'summary' }
            ],
        }
    },
    data: function(){
        return {
        }
    },
    methods: {},
    computed: {},
    components: {},
    mounted() {}
}
</script>
