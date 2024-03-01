<template>
  <div id="app">
    <div class="components-panel">
      <!-- 组件添加按钮 -->
      <button @click="addComponent('title')">Add Title</button>
      <button @click="addComponent('image')">Add Image</button>
      <button @click="addComponent('text')">Add Text</button>
      <button @click="addComponent('table')">Add Table</button>
      <button @click="exportToHTML">Export to HTML</button>
      <button @click="exportToUI">Export to element-ui</button>

    </div>
    <button @click="addPro('title')">Add TitlePro</button>
    <button @click="addPro('text')">Add TextPro</button>
    <input type="file" @change="handleFileUpload">
    <button @click="generatePages">生成页面</button>
    <div class="canvas">
      <component
      v-for="(item, index) in template"
      :is="item.type + 'Pro'"
      :key="index"
      :content="item.content"
      :dynamicData="dynamicData[item.dynamicKey]"
      ></component>
      <!-- 循环显示组件 -->
      <!-- <div v-for="(component, index) in components" :key="index" class="canvas-component">
        <component 
        :is="component.type + 'Component'" 
        v-bind="component.props"
        @update:title="updateProp(index, 'title', $event)"
        @update:src="updateProp(index, 'src', $event)"
        @update:alt="updateProp(index, 'alt', $event)"
        @update:text="updateProp(index, 'text', $event)"
        ></component>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import TitleComponent from './components/TitleComponent.vue';
import ImageComponent from './components/ImageComponent.vue';
import TextComponent from './components/TextComponent.vue';
import TableComponent from './components/TableComponent.vue';
import TitlePro from './components/TitlePro.vue';
import TextPro from './components/TextPro.vue';

export default {
  name: 'App',
  components: {
    TitleComponent,
    ImageComponent,
    TextComponent,
    TableComponent,
    TitlePro,
    TextPro,
  },
  data() {
    return {
      components: [],
      template: [
        // { type: 'Title', content: '默认标题', dynamicKey: 'title' },
        // { type: 'Text', content: '默认文本', dynamicKey: 'text' },
        // 更多组件定义
      ],
      dynamicData: {}, // 存储动态数据
      excelData: [], // 存储从Excel解析的数据
    };
  },
  methods: {
    addPro(type) {
      const defaultProps = {
        title: { type: 'Title', content: '默认标题', dynamicKey: 'title' },
        text: { type: 'Text', content: '默认文本', dynamicKey: 'text' },
      };
      this.template.push(defaultProps[type]);
    },
    addComponent(type) {
      const defaultProps = {
        title: { type: 'title', props: { title: 'Default Title' } },
        image: { type: 'image', props: { src: 'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png', alt: 'Placeholder' } },
        text: { type: 'text', props: { text: 'Default Text' } },
        table: { type: 'table', props: { tableData: 'hhhh' } },
      };
      this.components.push(defaultProps[type]);
    },

    updateProp(index, prop, value) {
      this.components[index].props[prop] = value;
    },

    // 从Excel文件中读取数据
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1}); // 获取原始数据数组
        
        // 初始化dynamicData对象，跳过第一行（列名）
        this.dynamicData = jsonData.slice(1).reduce((acc, row, index) => {
          // 假设第一列为序号，从第二列开始处理数据
          jsonData[0].slice(1).forEach((key, i) => {
            if (!acc[key]) {
              acc[key] = []; // 初始化键值对应的数组
            }
            // 将当前行对应列的数据添加到数组中
            acc[key].push(row[i + 1]);
          });
          
          return acc;
        }, {});
        
        // 更新模板数据，此处简化处理，实际应用中可能需要进一步逻辑来匹配和更新模板
        this.updateTemplateData();
      };
      reader.readAsArrayBuffer(file);
    },

    updateTemplateData() {
      // 基于dynamicData更新模板数据的示例逻辑
      // 这里简化处理，实际应用中应根据具体需求实现
      this.template.forEach(item => {
        if (this.dynamicData[item.dynamicKey] && this.dynamicData[item.dynamicKey].length > 0) {
          // 仅取第一项数据作为演示
          item.content = this.dynamicData[item.dynamicKey][0];
        }
      });
    },

    exportToHTML() {
      let css = `
      <style>
      html {
        font-size: 16px;
      }
      body {
          margin: 0;
          padding: 0;
          background: lightgray; /* 页面背景 */
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh; /* 使body高度充满视口 */
      }
      .canvas { 
          width: 100vw;           
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center; 
      }
      .component { margin: 0 auto; }

      .responsive-image {
          max-width: 100%;
          height: auto;
      }

      p {
          font-size: 1.5 rem /* 使用 rem 单位 1rem */ 
          margin: 1rem 0; /* 添加一些上下外边距 */
      }

      /* 大屏幕设备 */
      @media (min-width: 768px) {
        html { font-size: 18px; }
        .canvas { max-width: 90%; }
        .component { margin: 20px; }
      }

      /* 平板设备 */
      @media (min-width: 576px) and (max-width: 767px) {
        html { font-size: 17px; }
        .canvas { max-width: 95%; }
        .component { margin: 15px; }
      }

      /* 小屏幕设备，如手机 */
      @media (max-width: 575px) {
        html { font-size: 16px; }
        .canvas { width: 100%; }
        .component { margin: 10px; }
      }

      /* 添加更多响应式和组件样式 */
      </style>
      `;

      let htmlComponents = this.components.map(component => {
        if (component.type === 'title') {
          return `<h2 class="component">${component.props.title}</h2>`;
        } else if (component.type === 'image') {
          return `<img src="${component.props.src}" alt="${component.props.alt}" class="responsive-image" style="max-width: 100%;">`;
        } else if (component.type === 'text') {
          return `<p class="component">${component.props.text}</p>`;
        }
        return ''; // 默认返回空字符串
      }).join('');

      let html = '<!DOCTYPE html><html><head><title>Exported Page</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1">' + css + '</head><body><div class="canvas">' + htmlComponents + '</div></body></html>';
      
      // 使用Blob创建一个可下载的HTML文件
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'exported-page.html';
      document.body.appendChild(link); // 附加到document
      link.click(); // 模拟点击以触发下载
      document.body.removeChild(link); // 清理
    },

    exportToUI() {
      // const elementUiCdn = '<link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />'
      const htmlContent = this.$el.querySelector('.canvas').outerHTML; 
      const completeHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exported Page</title>
        <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css" />
        </head>
        <body>
        ${htmlContent}
        </body>
        </html>
      `;

      const blob = new Blob([completeHtml], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'exported-page.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
};
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

.canvas-component {
  position: relative;
}
</style>
