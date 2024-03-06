<template>
    <div>
        <h2> {{ h2_content }} </h2>
    </div>
    <div>
        <p>{{ p_content }}</p>
    </div>
    <div>
        <img :src="src" :alt="alt" style="max-width: 100%;">
    </div>
</template>

<script>
export default {
    props: {
        h2_content: String,
        p_content: String,
        src: String,
        alt: String,
        
    },

    name: "BeautyUltra",
    data() {
    },
    methods: {
    }
};
</script>