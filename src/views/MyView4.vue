<template>
    <div id="app">
      <div class="components-panel">
        <button @click="addWidget('CombineWidget')">Add CombineWidget</button>
      </div>
      <div class="canvas">
        <div v-for="(item, index) in widgets" :key="index" class="canvas-component">
          <component
            :is="item.type + 'Widget'"
            :key="index"
            v-bind="item.props"
            @update:content="(eventData) => handleContentUpdate(eventData, index)"
          ></component>
          <button @click="deleteWidget(index)">Delete</button>
          <button @click="moveWidgetUp(index)">Move Up</button>
          <button @click="moveWidgetDown(index)">Move Down</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import CombineWidget from '../widget/CombineWidget.vue';
  
  export default {
    name: 'MyView4',
    components: {
        CombineWidget,
    },
    data() {
      return {
        componentAProps: {
          title: 'Initial Title',
          content: 'Initial content',
          src: 'path/to/initial-image.jpg',
          alt: 'Initial Image'
        },
        components: [],
        widgets: [],
        editingIndex: null, // 当前正在编辑的组件索引
        dynamicKeys: [ ], // 存储动态数据的备注
      };
    },
    methods: {
        addWidget(type) {
            const defaultProps = {
                CombineWidget: {
                    type: 'Combine',
                    props: {
                        title: '默认标题',
                        content: '默认描述',
                        src:  'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png',
                        alt:  '默认图片' 
                    }
                },
                 // 可以添加其他类型组件的默认属性
            };
            this.widgets.push(defaultProps[type]);
        },
        handleContentUpdate(eventData, index) {
          this.widgets[index] = {
            ...this.widgets[index],
            props: {
              ...this.widgets[index].props,
              ...eventData.content,
            },
          };
        },
        deleteWidget(index) {
          this.widgets.splice(index, 1);
        },
        moveWidgetUp(index) {
          if (index > 0) {
            const itemToMove = this.widgets[index];
            this.widgets.splice(index, 1);
            this.widgets.splice(index - 1, 0, itemToMove);
          }
        },
        moveWidgetDown(index) {
          if (index < this.widgets.length - 1) {
            const itemToMove = this.widgets[index];
            this.widgets.splice(index, 1);
            this.widgets.splice(index + 1, 0, itemToMove);
          }
        }
    }
}
  </script>
  
  <style>
  .canvas {
    max-width: 375px; /* 或者使用 100vw 来确保宽度在视口宽度内 */
    height: 667px; /* 模拟常见的H5页面高度 */
    margin: auto;
    border: 1px solid #ccc;
    position: relative;
    overflow: hidden;
  }
  .review1 {
    max-width: 375px;
    height: 667px;
    margin: auto; 
    background-color: #ccc;
  }
  
  .canvas-component {
    position: relative;
  }
  </style>
  