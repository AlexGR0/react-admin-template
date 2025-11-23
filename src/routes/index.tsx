export interface RouteConfig {
  path: string; // 路由地址
  redirect?: string; // 重定向
  componentPath?: string; // 组件地址
  showInMenu?: boolean; // 是否在菜单显示 默认为false
  name?: string; // 名称
  element?: React.JSX.Element;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/home/index',
  },
  {
    path: '/home',
    name: '首页',
    componentPath: 'components/common/PageWrapper',
    showInMenu: false,
    children: [
      {
        path: '/home/index',
        name: '首页',
        componentPath: 'pages/Home',
      },
    ],
  },
  {
    path: '/about',
    name: '关于',
    componentPath: 'components/common/PageWrapper',
    children: [
      {
        path: '/about',
        redirect: '/about/index',
      },
      {
        path: '/about/index',
        name: '关于子菜单',
        componentPath: 'pages/About',
      },
    ],
  },
  {
    path: '/dashboard',
    name: '仪表盘',
    componentPath: 'components/common/PageWrapper',
    redirect: '/dashboard/index',
    children: [
      {
        path: '/dashboard',
        redirect: '/dashboard/index',
      },
      {
        path: '/dashboard/index',
        name: '仪表盘Profile',
        componentPath: 'pages/Profile',
      },
      {
        path: '/dashboard/settings',
        name: '仪表盘Settings',
        componentPath: 'pages/Settings',
      },
      {
        path: '/dashboard/topology',
        name: '拓扑图',
        componentPath: 'pages/Topology',
      },
    ],
  },
  {
    path: '/login',
    componentPath: 'pages/Login',
    name: 'Login',
    showInMenu: false,
  },
  {
    path: '*',
    componentPath: 'pages/NotFound',
    name: 'Not Found',
    showInMenu: false,
  },
];
