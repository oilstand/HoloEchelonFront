<template>
    <div class="cursor" :style="`left: ${left * 100}%;`"></div>
</template>
<style scoped>
.cursor {
    position:absolute;
    height:100%;
    top:0;
    background-color:red;
    width:4px;
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
        left() {
            return (this.startTime - this.start) / this.maxWidth;
        },
        startTime() {
            return new Date(this.data.time).getTime();
        },
        maxWidth() {
            return this.end - this.start;
        }
    },
    watch: {
    },
    props: ['data','start','end'],
    mounted() {
    }
}
</script>

