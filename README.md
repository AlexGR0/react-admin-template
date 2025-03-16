# react-admin-template

手动创建react脚手架，以及后台管理模板

### 前言

> 笔者利用空余时间集成了一个 react 后台管理项目，已放至 GitHub
> 启动和打包的时间都稍长，请耐心等待

- [GitHub 地址](https://github.com/AlexGR0/react-admin-template)

### 技术栈

- 开发工具：VScode
- 技术框架：react^18.3.1+react-route-domr^6.27.0+yypeScript^5.0.4
- 组件库：antd^5.22.2
- 状态管理：dva^2.4.1+react-redux^9.1.2
- 国际化方案：react-intl@7
- 打包工具：webpack^5.83.1
- 项目规范：Prettier+husky

### 代码目录

```text
react-admin-template
├─ public                 # 静态资源文件
├─ src
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局组件
│  │  ├─ Breadcrumb       # 面包屑组件
│  │  ├─ common           # 公共组件
│  │  ├─ Menu             # 菜单组件
│  │  ├─ NavDropdown      # 下拉组件
│  ├─ locales             # 国际化
│  ├─ models              # 状态管理
│  ├─ pages               # 项目所有页面
│  ├─ routes              # 路由管理
│  ├─ styles              # 全局样式
│  ├─ typings             # 全局 ts 声明
│  ├─ utils               # 工具库
│  ├─ App.tsx             # 入口页面
│  ├─ index.tsx           # 入口文件
├─ webpack-config         # 打包配置
├─ .babelrc               # babel 配置
├─ .eslintignore          # 忽略 Eslint 校验
├─ .eslintrc.js           # Eslint 校验配置
├─ .gitignore             # git 提交忽略
├─ .prettierignore        # 忽略 prettier 格式化
├─ .prettierrc.js         # prettier 配置
├─ Dockerfile             # Docker 镜像构建
├─ nginx.conf.template    # nginx 配置模板
├─ package-lock.json      # 依赖包包版本锁
├─ package.json           # 依赖包管理
├─ README.md              # README 介绍
└─ tsconfig.json          # typescript 全局配置
```

### 安装运行

- **Clone：**

```text
git clone https://github.com/AlexGR0/react-admin-template.git
```

- **Install：**

```text
npm install
cnpm install

# npm install 安装失败，请升级 nodejs 到 16 以上，或尝试使用以下命令：
npm install --registry=https://registry.npm.taobao.org
```

- **Run：**

```text
npm run dev（本地启动）
npm run start（打包后静态文件启动）
```

- **Build：**

```text

# 测试环境
npm run build:test

# 生产环境
npm run build:pro
```

- **Lint：**

```text
# eslint 检测代码
npm run lint
```

### 结尾

该项目不定时更新
如果对你有帮助，给个 star 哟~~❤️❤️❤️