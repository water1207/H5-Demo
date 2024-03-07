<template>
    <div class="myview2">
      <div class="components-panel">
        <button @click="addPro('title')">Add TitlePro</button>
        <button @click="addPro('text')">Add TextPro</button>
        <input type="file" @change="handleFileUpload">
        <button @click="exportPages2()">导出页面</button>
      </div>

      <div class="canvas">
        <component
        v-for="(item, index) in template"
        :is="item.type + 'Pro'"
        :key="index"
        :content="item.content"
        ></component>
      </div>

      <div class="review1" v-html="firstPageHtml">
      
      </div>
    </div>
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import TitlePro from '../components/TitlePro.vue';
  import TextPro from '../components/TextPro.vue';
  
  export default {
    name: 'MyView2',
    components: {
      TitlePro,
      TextPro,
    },
    data() {
      return {
        template: [
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

      async exportPages2() {
        for (let i = 0; i < this.mappedData.length; i++) {
          const pageHtml = this.generatePageHtml(this.mappedData[i]);
          if (i % 10 == 0) {
            await this.pause();
          }
          if (i === 0) {
            this.firstPageHtml = pageHtml; // 显示在画布中
            this.downloadHtml(pageHtml, `Page-${i + 1}.html`);
          } else {
            this.downloadHtml(pageHtml, `Page-${i + 1}.html`); // 准备导出
          }
        }
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
      },
      pause() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      },
    },
  };
  </script>
  
  <style scoped>
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
  