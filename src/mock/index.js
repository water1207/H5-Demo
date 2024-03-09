import Mock from 'mockjs'
// 设置拦截Ajax请求的响应时间，模拟网络延迟
Mock.setup({
  timeout: '200-600'
})
// Mock数据示例
Mock.mock('/api/gett', {
    id : 1001,
    name: 'template1',
    widgets: [
        {
          type: "Combine",
          props: {
            title: "示例标题1",
            content: "示例内容1",
            src: "https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png",
            switchStates: [true, false, true],
            notes: ["标题1备注", "", "图片1备注"]
          }
        },
        {
          type: "Combine",
          props: {
            title: "示例标题2",
            content: "示例内容2",
            src: "https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png",
            switchStates: [false, true, false],
            notes: ["", "内容2备注", ""]
          }
        }
    ],
    "dynamics": [true, false, true, false, true, false],
    "dynamicsNotes": ["标题1备注","图片1备注","内容2备注"]
})
export default Mock
