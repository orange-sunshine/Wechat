# AGENTS.md — 莫凡商城 (WeChat Mini Program)

## Project type
- Native **WeChat Mini Program** (JS + WXML + WXSS), **NOT** a web app, SPA, or cross-platform framework (Taro/uni-app).
- Opens in **WeChat DevTools** only. Do not attempt `npm start`, `dev`, or any web build command.

## No package manager / lockfiles
- No `package.json`, no `node_modules`, no npm/pnpm/yarn. Do not add or install JS dependencies unless required by a WeChat plugin.
- No build step; source files (`*.js`, `*.wxml`, `*.wxss`, `*.json`) are loaded directly by the mini-program runtime.

## Entrypoints
- `app.js` — app lifecycle + `globalData` (API host, auth code, userId).
- `app.json` — page registration, tabBar, window style (4 tabs: 首页/分类/购物车/我的).
- `app.wxss` — global styles.

## Framework / API conventions
- All pages use `Page({...})` from the WeChat SDK (global `Page`).
- All API calls use `wx.request({ method: 'GET', ... })` — no axios/fetch.
- Backend API host: `https://api.mofun365.com:8888` (`app.globalData.host`).
- Auth: `wx.login()` → `code` → POSTed to `/api/user/login` → session stored in `wx.setStorageSync`.
- User state read from `wx.getStorageSync("userId")` (empty = not logged in).
- Navigation: `wx.navigateTo`, `wx.redirectTo`, `wx.reLaunch`, `wx.switchTab`.
- Image/static assets under `pages/images/`.

## Project structure
```
pages/
  index/           — 首页 (tabBar, banners + book lists)
  category/        — 分类 (tabBar)
  shoppingcart/    — 购物车 (tabBar)
  me/              — 我的 (tabBar)
  search/          — 搜索
  goods/           — 商品列表
  goodsDetail/     — 商品详情
  login/           — 登录 (account + SMS code tabs)
  register/        — 注册
  updatePwd/       — 修改密码
  opinion/         — 意见反馈
  buy/             — 结算
  address/         — 地址管理
  newAddress/      — 新增地址
  paySuccess/      — 支付成功
  myOrder/         — 我的订单
```

## ESLint
- Config at `.eslintrc.js` with WeChat globals (`wx`, `App`, `Page`, `getApp`, `Component`, etc.).
- Run via WeChat DevTools (no CLI lint command available).

## CloudBase (Tencent)
- `.cloudbase/` directory exists but is empty/debug-only. Not used in current code.

## Quirks / gotchas
- All backend API calls are `GET` requests (not POST) even for mutations — do not change this pattern.
- API responses: success `code === '0000'`, payload in `data.data`.
- No TypeScript, no module imports — ES5-style JS with no bundler.
- Each page has 4 files (`.js`, `.json`, `.wxml`, `.wxss`). The `.json` file is required and declares `usingComponents` or empty `{}`.
- No unit/E2E tests exist in the repo.
