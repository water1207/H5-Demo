<template>
    <div class="myview4">
      <div class="components-panel">
        <button @click="addWidget('CombineWidget')">Add CombineWidget</button>
        <button @click="saveTemplate">Export</button>  
        <button @click="loadTemplate">load</button>
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
  import CombineWidget from '../widget/CombineWidget.vue';
  import axios from 'axios';

  export default {
    name: 'MyView4',
    components: {
        CombineWidget,
    },
    data() {
      return {
        widgets: [],
        dynamics: [],
        dynamicsNotes: [],
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
                        alt:  '默认图片' ,
                        switchStates: [false, false, false],
                        notes: ['', '', ''],
                    },
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
        saveTemplate() {
          // 使用 map 遍历 widgets，然后对每个 widget 的 switchStates 使用 reduce 累积符合条件的备注
          const dynamics = this.widgets.flatMap(item => item.props.switchStates);
          const dynamicsNotes = this.widgets.reduce((notesAccumulator, item) => {
            const notesForWidget = item.props.notes.filter((note, index) => item.props.switchStates[index]);
            return notesAccumulator.concat(notesForWidget);
          }, []);

          const widgets = this.widgets;

          console.log(this.widgets);
          console.log(dynamics);
          console.log(dynamicsNotes);

          this.dynamics = dynamics;
          this.notes = dynamicsNotes;

          // 根据需要返回或使用 dynamics 和 dynamicsNotes
          // 例如，返回一个对象以便外部使用或传递给后端
          
          return { widgets, dynamics, dynamicsNotes };
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
        },
        loadTemplate(templateId) {
          // 示例：使用axios获取模板数据
          axios.get(`/api/gett`).then(response => {
            const templateData = response.data;
            this.applyTemplate(templateData);
          }).catch(error => {
            console.error("加载模板数据失败", error);
          });
        },
        applyTemplate(templateData) {
          this.widgets = templateData.widgets;
          this.dynamics = templateData.dynamics;
          this.dynamicsNotes = templateData.dynamicsNotes;
        },
    }
}
  </script>
  
  <style scoped>
  .canvas {
    max-width: 375px; /* 或者使用 100vw 来确保宽度在视口宽度内 */
    min-height: 667px;    /* 模拟常见的H5页面高度 */
    margin: auto;
    border: 1px solid #e41111;
    position: relative;
    overflow: hidden;
  }
  
  .canvas-component {
    position: relative;
  }
  </style>
  