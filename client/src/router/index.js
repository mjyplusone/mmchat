import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import chat from '@/components/chat';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/chat',
      component: chat
    }
  ]
});
