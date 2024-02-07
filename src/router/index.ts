import WidgetRouter from '../widgets/widget-router';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Settings from '@/views/layout/Settings.vue'
import ClipboardList from '@/views/layout/ClipboardList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...WidgetRouter,
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children:[
        {
          path: '',
          name: 'clipboard',
          component: ClipboardList,
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
        }
      ]
    },
  ],
});

export default router;
