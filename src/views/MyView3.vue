<template>
    <div id="app">
      <div class="components-panel">
        <button @click="addUltra('BeautyPro')">Add BeautyUltra</button>
        <input type="file" @change="handleFileUpload">
        <button @click="exportPages()">导出页面</button>
      </div>

      <div class="canvas">
        <component
        v-for="(item, index) in processedTemplates"
        :is="item.type + 'Ultra'"
        :key="index"
        v-bind="item.props"
        ></component>
      </div>
    </div>
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import BeautyUltra from '../components/BeautyUltra.vue';
  
  export default {
    name: 'MyView3',
    components: {
      BeautyUltra,
    },
    computed: {
      processedTemplates() {
        return this.templates.map(template => {
          const processedProps = {};
          for (const [key, value] of Object.entries(template.props)) {
            // 假设每个属性对象都有 value 键，我们只取 value 键的值
            processedProps[key] = value.value ? value.value : value;
          }
          return {
            ...template,
            props: processedProps,
          };
        });
      },
    },
    data() {
      return {
        components: [],
        templates: [
          // { type: 'Title', content: '默认标题', dynamicKey: 'title' },
          // { type: 'Text', content: '默认文本', dynamicKey: 'text' },
          // 更多组件定义
        ],
        rowsData: [], // 存储excel的映射数据
        /*
        [
          ["标题1", "文本1"],
          ["标题2", "文本2"]
        ]
        */
        mappedData: [], // 映射后的数据，用于生成页面
        /*
        [
          { "title": "标题1", "text": "文本1" },
          { "title": "标题2", "text": "文本2" }
        ]
        */
        firstPageHtml: '', // 用于在画布中显示的第一个页面的HTML字符串
        dynamicKeys: [ ], // 存储动态数据的备注
      };
    },
    methods: {
      addUltra(type) {
        const defaultProps = {
          BeautyPro: {
            type: 'Beauty',
            props: {
              h2_content: { value: '默认标题', dynamic: false },
              p_content: { value: '默认描述', dynamic: false },
              src: { value: 'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png', dynamic: false },
              alt: { value: '默认图片', dynamic: false }
            },
          },
          // 可以添加其他类型组件的默认属性
        };
        
        // 检查类型是否存在于 defaultProps 中
        if (defaultProps[type]) {
          // 深拷贝默认属性以避免直接修改原对象
          const newComponent = JSON.parse(JSON.stringify(defaultProps[type]));
          // 将新组件实例添加到模板数组中
          this.templates.push(newComponent);
        } else {
          console.error('Unsupported type:', type);
        }
      },

      // 根据模版生成html
      generatePageHtml(rowData) {
        let html = '<html><head><style>.page { margin: 20px; padding: 20px; border: 1px solid #ccc; } h1, p { margin: 0; padding: 10px 0; }</style></head><body>';

        this.template.forEach(item => {
          const content = rowData[item.dynamicKey] || item.content;
          if (item.type === 'Title') {
            html += `<h1 class="page">${content}</h1>`;
          } else if (item.type === 'Text') {
            html += `<p class="page">${content}</p>`;
          }
        });

        html += '</body></html>';
        return html;
      },

      handleFileUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, {type: 'array'});
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
          
          // 提取列名
          const columns = jsonData[0];
          // 存储除列名外的所有行数据
          this.rowsData = jsonData.slice(1);
          
          // 映射并填充数据到模板
          this.mapDataToTemplate(columns, this.rowsData);
        };
        reader.readAsArrayBuffer(file);
      },

      mapDataToTemplate(columns, rowsData) {
        this.mappedData = rowsData.map(row => {
          let rowData = {};
          this.template.forEach(t => {
            const columnIndex = columns.indexOf(t.dynamicKey);
            if (columnIndex !== -1) {
              rowData[t.dynamicKey] = row[columnIndex];
            }
          });
          return rowData;
        });
      },
    

      exportPages() {
        this.mappedData.forEach((data, index) => {
          const pageHtml = this.generatePageHtml(data);
          if (index === 0) {
            this.firstPageHtml = pageHtml; // 显示在画布中
            this.downloadHtml(pageHtml, `Page-${index + 1}.html`);
          } else {
            this.downloadHtml(pageHtml, `Page-${index + 1}.html`); // 准备导出
          }
        });
      },

      downloadHtml(html, filename) {
        const blob = new Blob([html], {type: 'text/html'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
  