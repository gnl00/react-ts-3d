# react-ts-3d

> 模型据来源于互联网

* echarts-gl
* three-js
* ...

```shell
npm install

npm run dev
```

引入 `@types/node`

```shell
npm install -D @types/node
```

## echarts-3d

引入依赖

```shell
npm install echarts
npm install echarts-gl
```

导入

```ts
import * as echarts from 'echarts';
import 'echarts-gl';
```

…

**效果图**

![echarts-3d-earth-demo](./assets/echarts-3d-earth-demo.gif)

…

---

## three-js

引入依赖

```shell
npm install three@latest
npm install -D @types/three

npm install stats-js # 显示帧率
```

### 3D 模型格式

* fbx
* obj
*  glb(gltf)
* vrm

**支持的 3D 模型格式**

> [参考](https://github.com/mrdoob/three.js/tree/dev/examples/jsm/loaders)，基本上主流的 3D 模型格式都支持

```typescript
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js' // 无需再次安装依赖，three-js 自带 fbx 格式模型
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' // 无需再次安装依赖，three-js 自带
// ...
```

…
---

### 效果图

![three-js-3d-people-demo](./assets/three-js-3d-people-demo.gif)

…

> 还不错的网站
>
> * [three-js 官方 demo](https://threejs.org/examples/)
> * [暮志未晚博客](https://www.wjceo.com/blog/threejs/)

...
---
### 模型事件追踪

> 需要使用到 Raycaster 类，[官方 demo](https://threejs.org/docs/?q=ray#api/zh/core/Raycaster)

**3D 模型非全屏渲染下鼠标位置可能会偏移**

```typescript
// 如果渲染的 3D 模型非全屏，需要减去一个 offset，否则鼠标追踪位置会偏移
pointer.x = ((event.clientX - 3dDom.offsetLeft) / 3dDom.clientWidth ) * 2 - 1;
pointer.y = - ((event.clientY - 3dDom.offsetTop) / 3dDom.clientHeight ) * 2 + 1;
```
...
---

### 有意思的项目

> [threejs 实现俄罗斯方块](https://github.com/RylanBot/threejs-tetris-react/tree/main)

## 参考

**echarts 3D**
* https://echarts.apache.org/examples/zh/index.html#chart-type-globe

**threejs 上手**
* https://threejs.org/docs/index.html#manual/en/introduction
* http://www.webgl3d.cn/
* https://juejin.cn/post/6844904177345232903

**fbx 模型加载**
* https://sbcode.net/threejs/loaders-fbx/
* https://juejin.cn/post/6911217131254185991

**threejs 非全屏渲染鼠标位置偏移**
* https://zhuanlan.zhihu.com/p/346167554
