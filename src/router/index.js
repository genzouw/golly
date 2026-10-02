import { createRouter, createWebHistory } from 'vue-router'
import Top from '@/components/Top'
import Create from '@/components/Create'
import Show from '@/components/Show'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Top,
      meta: {
        title: 'トップ'
      }
    },
    {
      path: '/create',
      component: Create,
      meta: {
        title: 'アンケート作成'
      }
    },
    {
      path: '/show/:id',
      component: Show,
      meta: {
        title: 'アンケート'
      }
    }
  ]
})
