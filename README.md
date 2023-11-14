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

**效果图**

![three-js-3d-people-demo](./assets/three-js-3d-people-demo.gif)

…

> 还不错的网站：
>
> * [官方的 example](https://threejs.org/examples/)
> * [暮志未晚博客](https://www.wjceo.com/blog/threejs/)

---

### 有意思的项目

> [threejs 实现俄罗斯方块](https://github.com/RylanBot/threejs-tetris-react/tree/main)

## 参考

**threejs 上手**
* https://threejs.org/docs/index.html#manual/en/introduction
* http://www.webgl3d.cn/
* https://juejin.cn/post/6844904177345232903

**fbx 模型加载**
* https://sbcode.net/threejs/loaders-fbx/
* https://juejin.cn/post/6911217131254185991
