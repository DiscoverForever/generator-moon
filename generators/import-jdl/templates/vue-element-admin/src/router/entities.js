/* Layout */
import Layout from '@/views/layout/Layout'

export default [
<%_ entities.forEach((entity, index) => { _%>
  {
    path: '/<%= _.kebabCase(entity.name) %>',
    component: Layout,
    redirect: '/<%= _.kebabCase(entity.name) %>/index',
    name: '<%= _.kebabCase(entity.name) %>',
    meta: {
      title: '<%= entity.name %>',
      icon: 'guide'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/<%= _.kebabCase(entity.name) %>/index'),
        name: 'guide',
        meta: {
          title: '<%= entity.name %>',
          icon: 'guide',
          noCache: true
        }
      },
      {
        path: '<%= _.kebabCase(entity.name) %>-add/',
        component: () => import('@/views/<%= _.kebabCase(entity.name) %>/<%= _.kebabCase(entity.name) %>-add'),
        name: '<%= _.kebabCase(entity.name) %>-add',
        props: true,
        meta: {
          title: '<%= entity.name %>-add',
          icon: 'guide',
          noCache: true
        },
        hidden: true
      },
      {
        path: '<%= _.kebabCase(entity.name) %>-edit/:objectId',
        component: () => import('@/views/<%= _.kebabCase(entity.name) %>/<%= _.kebabCase(entity.name) %>-edit'),
        name: '<%= _.kebabCase(entity.name) %>-edit',
        props: true,
        meta: {
          title: '<%= _.kebabCase(entity.name) %>-edit',
          icon: 'guide',
          noCache: true
        },
        hidden: true
      }
    ]
  }<%- index === entities.length - 1 ? '' : ',' %>
<%_ }); _%>
]
