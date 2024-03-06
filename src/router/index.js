import { createRouter,createWebHistory,createWebHashHistory } from 'vue-router'
import MyView1 from '../views/MyView1.vue'
import MyView2 from '../views/MyView2.vue'
import MyView3 from '../views/MyView3.vue'
import MyView4 from '../views/MyView4.vue'

const routes = [
    {
        path: '/',
        name: 'MyView1',
        component: MyView1
    },
    {
        path: '/MyView2',
        name: 'MyView2',
        component: MyView2
    },
    {
        path: '/MyView3',
        name: 'MyView3',
        component: MyView3
    },
    {
        path: '/MyView4',
        name: 'MyView4',
        component: MyView4
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
