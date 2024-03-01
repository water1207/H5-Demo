<template>
    <div>
      <p>{{ content }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      content: String,
      dynamicData: Object
    },
    computed: {
      // 如果有动态数据绑定，则显示动态数据，否则显示静态内容
      contentToShow() {
        return this.dynamicData && this.dynamicData.content ? this.dynamicData.content : this.content;
      }
    }
  };
  </script>
  