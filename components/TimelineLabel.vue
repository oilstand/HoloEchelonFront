<template>
    <div class="label" :style="`left: ${left * 100}%;`">{{ title }}</div>
</template>
<style scoped>
.label {
    position:absolute;
    height:50px;
    top:0;
    height:1.3em;
    /*background-color:white;*/
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
        title() {
            return this.data && this.data.text ? this.data.text : 'none';
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

