import Vue from 'vue'
import Router from 'vue-router'
import Top from '@/components/Top'
import Create from '@/components/Create'
import Show from '@/components/Show'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Top,
      meta: {
        'title': 'トップ'
      }
    },
    {
      path: '/create',
      component: Create,
      meta: {
        'title': 'アンケート作成'
      }
    },
    {
      path: '/show/:id',
      component: Show,
      meta: {
        'title': 'アンケート'
      }
    }
  ]
})
