<template>
    <el-button type="success" plain>{{ tableData }}</el-button>
</template>
  
  <script>
  export default {
    props: ['tableData'],
    name: 'TableComponent',
    data() {
    //   return {
    //     tableData: [{
    //       date: '2016-05-02',
    //       name: '王小虎',
    //       address: '上海市普陀区金沙江路 1518 弄'
    //     }, {
    //       date: '2016-05-04',
    //       name: '张小三',
    //       address: '上海市普陀区金沙江路 1517 弄'
    //     }]
    //   }
    }
  }
  </script>
  