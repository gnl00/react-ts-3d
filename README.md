# react-ts-3d

* echarts-gl
* three-js
* ...

```shell
npm install

npm run dev
```

引入 @types/node

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


## three-js

引入依赖

```shell
npm install three@latest
npm install -D @types/three
npm install stats-js # 显示帧率

npm install three-fbx-loader # 用于加载 fbx 模型
```

### 目前主流 3D 模型格式
* fbx
* obj
*  glb(gltf)
* vrm

### 看起来挺有意思的项目

> [threejs 实现俄罗斯方块](https://github.com/RylanBot/threejs-tetris-react/tree/main)


## 参考

**threejs 上手**
* https://threejs.org/docs/index.html#manual/en/introduction
* https://juejin.cn/post/6844904177345232903

**fbx 模型加载**
* https://sbcode.net/threejs/loaders-fbx/
* https://juejin.cn/post/6911217131254185991
