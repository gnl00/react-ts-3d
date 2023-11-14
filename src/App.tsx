import './App.css'

// echarts
import * as echarts from 'echarts';
import 'echarts-gl';
import eChart3DEarthImg from '@/assets/echart/3d-earth-world.topo.bathy.200401.jpg'
import eChart3DBgImg from '@/assets/echart/bg-starfield.jpg'
import eChart3DHDR from '@/assets/echart/pisa.hdr'

// three-js
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' // 控制鼠标
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js' // 无需再次安装依赖，three-js 自带 FBXLoader 扩展
import Stats from 'three/examples/jsm/libs/stats.module' // 显示帧率
import xBot from '@/assets/3js/xbot.fbx'
import naruto from '@/assets/3js/Naruto.fbx'
import beats from '@/assets/3js/beats_highpoly.fbx'
// 加载 gltf 模型
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' // 无需再次安装依赖，three-js 自带 GLTFLoader 扩展
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import people from '@/assets/3js/people.glb'
import opengl from '@/assets/3js/uv_grid_opengl.jpg'

import down2up from '@/assets/3js/down2up-be71451b.png'
import left2right from '@/assets/3js/left2right-ec543fab.png'

function App() {
  
  // EChart 3D 地球实际上是将一张展开的平面图片包裹在一个球面上形成一个 3D球体
  const EChart3DGlobeComp = () => {
    const drawEChart3D = () => {
      const eChartDom3D = document.getElementById('eChartDom3D')
      
      let eChart3D: echarts.ECharts | null = null
      if (eChartDom3D && eChart3D == null) {
        eChart3D = echarts.init(eChartDom3D)
      }
      
      if (eChart3D) {
        const option = {
          backgroundColor: '#000',
          globe: {
            baseTexture: eChart3DEarthImg, // 基本材质
            heightTexture: eChart3DEarthImg, // 高光材质
            displacementScale: 0.04,
            shading: 'realistic',
            environment: eChart3DBgImg, // 设置背景图片
            realisticMaterial: {
              roughness: 0.9
            },
            postEffect: {
              enable: true
            },
            light: {
              main: {
                intensity: 5,
                shadow: true
              },
              ambientCubemap: {
                texture: eChart3DHDR, // hdr 环境光，实际上就是将一张 hdr 格式的照片再覆盖上去一层
                diffuseIntensity: 0.2
              }
            }
          }
        };
        
        eChart3D.setOption(option)
      }
    }
    
    return (
      <div style={{display: 'flex', flexDirection: 'column', height: '95%', margin: '20px'}}>
        <h1 onClick={drawEChart3D}>echarts-3d-click-me</h1>
        <div id={'eChartDom3D'} style={{flex: 1, height: '100%', width: '95%'}}></div>
      </div>
    )  
  }

  const EChart3DChartComp = () => {
    // EChart 3D 图表和球体类似，最底层是一张图片；
    // 在底层图片的基础上覆盖上柱状图，柱状条的颜色根据图片的各个点位颜色计算出来，就能形成一张高光 3D 图
    // ... 
    // 参考官方 3d 星云案例 https://echarts.apache.org/examples/zh/index.html#chart-type-globe
  }
  
  const ThreejsComp = () => {
    
    const gltfPeople = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {
        const scene = new THREE.Scene()
        scene.add(new THREE.AxesHelper(150))

        const light = new THREE.PointLight(0xffffff, 50)
        light.position.set(0, 200, 0)
        scene.add(light)

        const ambientLight = new THREE.AmbientLight()
        scene.add(ambientLight)

        const hemilight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add( hemilight );

        // 创建摄像头
        const camera = new THREE.PerspectiveCamera(
          65, // 默认 50
          threejs3D.clientWidth / threejs3D.clientHeight, // 默认值为 1，数值不等于 1 的话模型会变形，小于 1 被压缩，大于 1 被拉长
          0.1,
          1000
        )
        camera.position.set(20, 0, -250) // 红、绿、蓝

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(threejs3D.clientWidth, threejs3D.clientHeight)
        // renderer.setClearColor(0xff0000, 0); // 设置渲染器的背景颜色，参数1：颜色，参数2：透明度，为 0 表示透明背景
        renderer.setClearAlpha(0) // 设置背景透明度，为 0 表示透明背景
        renderer.outputColorSpace = THREE.SRGBColorSpace
        threejs3D.appendChild(renderer.domElement)

        // 鼠标角度控制器
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.target.set(0, 1, 0)
        
        let meshWomen: null | THREE.Mesh = null
        let meshMan: null | THREE.Mesh = null
        let meshCircle: null | THREE.Mesh = null

        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load(down2up)
        // 调整纹理的环绕方式
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          
        const loader = new GLTFLoader()
        loader.load(people, (gltf: GLTF) => {
          console.log(gltf)
          // people 这个模型是一个模型组，其中包含三个对象：男，女，底部小圆。
          // 可以根据 name 取出其中的模型，并对每一个模型单独设置材质，
          // 根据 name 获取模型，单独设置材质、纹理、位置等属性
          meshWomen = gltf.scene.getObjectByName('女');
          meshMan = gltf.scene.getObjectByName('男');
          meshCircle = gltf.scene.getObjectByName('底部小圆');
          // 遍历加载的场景中的每个模型
          // gltf.scene.traverse(function (child) {
          //   if ((child as THREE.Mesh).isMesh) {
          //     // 重新设置材质，为模型组中的所有模型统一设置材质
          //     child.material = new THREE.MeshLambertMaterial({
          //       color:0x000f50,
          //       wireframe: true,
          //       transparent: false
          //     });
          //   }
          // })
          // 为某些模型单独设置材质
          // 重新设置材质
          if (meshWomen && meshMan) {
            meshWomen.position.set(0, 0, -75)
            meshWomen.material = new THREE.MeshStandardMaterial({
              map: texture
            });
            // 重新设置材质
            meshMan.material = new THREE.MeshStandardMaterial({
              //color: 0x568ee1,
              //emissive: 0x568ee5,
              //emissiveIntensity: 1,
              wireframe: true,
              map: texture
            });
            
            if (meshCircle) {
              // scene 有一个 remove 方法，可以只加载单个男或者女模型，再绑定 onclick 事件切换模型
              scene.add(meshWomen)
              scene.add(meshMan)
              scene.add(meshCircle)
            }
          }
          
        }, undefined, err => {
          console.log('Error: ', err)
        })

        const render = () => {
          renderer.render(scene, camera)
        }

        const onWindowResize = () => {
          camera.aspect = threejs3D.clientWidth / threejs3D.clientHeight,
            camera.updateProjectionMatrix()
          renderer.setSize(threejs3D.clientWidth, threejs3D.clientHeight)
          render()
        }
        window.addEventListener('resize', onWindowResize, false)

        // 帧率显示
        const stats = new Stats()
        threejs3D.appendChild(stats.dom)
        stats.dom.style.position = 'absolute'

        const animate = () => {
          requestAnimationFrame(animate)

          // 底部小圆旋转动画，加的数值越大旋转越快
          if (meshCircle) {
              meshCircle.rotation.y += 0.02
          }
          
          if (texture) {
            if (texture.offset.y < 1) {
                texture.offset.y += 0.01
            } else {
              texture.offset.y = 0
            }
          }
          
          controls.update()
          stats.update()
          render()
        }
        animate()
      }
    }
    
    const draw3jsBeatsModel = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {
        // 创建场景
        const scene = new THREE.Scene()
        // scene.background = new THREE.Color(0xf65144); // 设置场景背景颜色
        // 添加辅助坐标系
        scene.add(new THREE.AxesHelper(5))
        
        // 创建灯光
        const light = new THREE.PointLight(0xffffff, 50)
        light.position.set(0.8, 1.4, 1.0)
        scene.add(light)

        // 环境光
        const ambientLight = new THREE.AmbientLight()
        scene.add(ambientLight)

        // 创建摄像头
        const camera = new THREE.PerspectiveCamera(
          65, // 默认 50
          threejs3D.clientWidth / threejs3D.clientHeight, // 默认值为 1，数值不等于 1 的话模型会变形，小于 1 被压缩，大于 1 被拉长
          0.1,
          1000
        )
        camera.position.set(0.5, 0.7, 1.8) // 红、绿、蓝

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(threejs3D.clientWidth, threejs3D.clientHeight)
        // renderer.setClearColor(0xff0000, 0); // 设置渲染器的背景颜色，参数1：颜色，参数2：透明度，为 0 表示透明背景
        renderer.setClearAlpha(0) // 设置背景透明度，为 0 表示透明背景
        threejs3D.appendChild(renderer.domElement)

        // 鼠标角度控制器
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.target.set(0, 1, 0)

        // 创建 FBXLoader 对象
        const fbxLoader = new FBXLoader()

        // 加载模型
        fbxLoader.load(
          beats,
          (model) => {
            // model.traverse(function (child) {
            //   if ((child as THREE.Mesh).isMesh) {
            //     // (child as THREE.Mesh).material = material
            //     if ((child as THREE.Mesh).material) {
            //       ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
            //     }
            //   }
            // })

            // 调整模型在坐标轴中的位置
            // model.position.set(0, 0.4, 0)
            
            // 按照某个方向移动模型位置
            model.translateY(0.6)

            // 调整模型（放大缩小某一个坐标）
            model.scale.set(.02, 0.02, .02)
            scene.add(model)
            console.log('model added')
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          },
          (error) => {
            console.log(error)
          }
        )

        const render = () => {
          renderer.render(scene, camera)
        }

        const onWindowResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight,
          camera.updateProjectionMatrix()
          renderer.setSize(threejs3D.clientWidth, threejs3D.clientHeight)
          render()
        }
        window.addEventListener('resize', onWindowResize, false)

        // 帧率显示
        const stats = new Stats()
        threejs3D.appendChild(stats.dom)
        stats.dom.style.position = 'absolute'

        const animate = () => {
          requestAnimationFrame(animate)

          controls.update()

          render()

          stats.update()
        }
        animate()
      }
    }

    const draw3jsRobotModel = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {
        // 创建场景
        const scene = new THREE.Scene()
        // scene.background = new THREE.Color(0xf65144); // 设置场景背景颜色
        // 添加辅助坐标系
        scene.add(new THREE.AxesHelper(5))

        // 创建灯光
        const light = new THREE.PointLight(0xffffff, 50)
        light.position.set(0.8, 1.4, 1.0)
        scene.add(light)

        // 环境光
        const ambientLight = new THREE.AmbientLight()
        scene.add(ambientLight)

        // 创建摄像头
        const camera = new THREE.PerspectiveCamera(
          65, // 默认 50
          threejs3D.clientWidth / threejs3D.clientHeight, // 默认值为 1，数值不等于 1 的话模型会变形，小于 1 被压缩，大于 1 被拉长
          0.1,
          1000
        )
        camera.position.set(0.5, 0.7, 1.8) // 红、绿、蓝

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(threejs3D.clientWidth, threejs3D.clientHeight)
        // renderer.setClearColor(0xff0000, 0); // 设置渲染器的背景颜色，参数1：颜色，参数2：透明度，为 0 表示透明背景
        renderer.setClearAlpha(0) // 设置背景透明度，为 0 表示透明背景
        threejs3D.appendChild(renderer.domElement)

        // 鼠标角度控制器
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.target.set(0, 1, 0)

        // 创建 FBXLoader 对象
        const fbxLoader = new FBXLoader()

        // 加载模型
        fbxLoader.load(
          xBot,
          (model) => {
            // model.traverse(function (child) {
            //   if ((child as THREE.Mesh).isMesh) {
            //     // (child as THREE.Mesh).material = material
            //     if ((child as THREE.Mesh).material) {
            //       ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
            //     }
            //   }
            // })

            // 调整模型在坐标轴中的位置
            // model.position.set(0, 0.4, 0)

            // 调整模型（放大缩小某一个坐标）
            model.scale.set(.01, 0.01, .01)
            scene.add(model)
            console.log('model added')
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          },
          (error) => {
            console.log(error)
          }
        )

        const render = () => {
          renderer.render(scene, camera)
        }

        const onWindowResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight,
            camera.updateProjectionMatrix()
          renderer.setSize(threejs3D.clientWidth, threejs3D.clientHeight)
          render()
        }
        window.addEventListener('resize', onWindowResize, false)

        // 帧率显示
        const stats = new Stats()
        threejs3D.appendChild(stats.dom)
        stats.dom.style.position = 'absolute'

        const animate = () => {
          requestAnimationFrame(animate)

          controls.update()

          render()

          stats.update()
        }
        animate()
      }
    }
    
    const draw3jsNaruto = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {
        // 创建场景
        const scene = new THREE.Scene()
        // scene.background = new THREE.Color(0xf65144); // 设置场景背景颜色
        // 添加辅助坐标系
        scene.add(new THREE.AxesHelper(5))

        // 创建灯光
        // naruto 不需要灯光。。。
        // const light = new THREE.PointLight(0xffffff, 50)
        // light.position.set(0.8, 1.4, 1.0)
        // scene.add(light)

        // 环境光
        const ambientLight = new THREE.AmbientLight()
        scene.add(ambientLight)

        // 创建摄像头
        const camera = new THREE.PerspectiveCamera(
          65, // 默认 50
          threejs3D.clientWidth / threejs3D.clientHeight, // 默认值为 1，数值不等于 1 的话模型会变形，小于 1 被压缩，大于 1 被拉长
          0.1,
          1000
        )
        camera.position.set(0.5, 0.7, 1.8) // 红、绿、蓝

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(threejs3D.clientWidth, threejs3D.clientHeight)
        // renderer.setClearColor(0xff0000, 0); // 设置渲染器的背景颜色，参数1：颜色，参数2：透明度，为 0 表示透明背景
        renderer.setClearAlpha(0) // 设置背景透明度，为 0 表示透明背景
        threejs3D.appendChild(renderer.domElement)

        // 鼠标角度控制器
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.target.set(0, 1, 0)

        // 创建 FBXLoader 对象
        const fbxLoader = new FBXLoader()

        // 加载模型
        fbxLoader.load(
          naruto,
          (model) => {
            // model.traverse(function (child) {
            //   if ((child as THREE.Mesh).isMesh) {
            //     // (child as THREE.Mesh).material = material
            //     if ((child as THREE.Mesh).material) {
            //       ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
            //     }
            //   }
            // })

            // 调整模型在坐标轴中的位置
            // model.position.set(0, 0.4, 0)
            
            model.translateY(1)

            // 调整模型（放大缩小某一个坐标）
            model.scale.set(.01, 0.01, .01)
            scene.add(model)
            console.log('model added')
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          },
          (error) => {
            console.log(error)
          }
        )

        const render = () => {
          renderer.render(scene, camera)
        }

        const onWindowResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight,
            camera.updateProjectionMatrix()
          renderer.setSize(threejs3D.clientWidth, threejs3D.clientHeight)
          render()
        }
        window.addEventListener('resize', onWindowResize, false)

        // 帧率显示
        const stats = new Stats()
        threejs3D.appendChild(stats.dom)
        stats.dom.style.position = 'absolute'

        const animate = () => {
          requestAnimationFrame(animate)

          controls.update()

          render()

          stats.update()
        }
        animate()
      }
    }

    // 圆柱体贴图 + 贴图动画
    const simple3jsCylinderTexture = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {

        // 创建场景
        const scene = new THREE.Scene();
        // 设置相机位置
        const camera = new THREE.PerspectiveCamera( 65, threejs3D.clientWidth / threejs3D.clientHeight, 0.1, 1000 );
        camera.position.z = 20;
        // 创建 WebGL 渲染器
        const renderer = new THREE.WebGLRenderer();
        // 设置渲染范围
        renderer.setSize( threejs3D.clientWidth, threejs3D.clientHeight );
        threejs3D.appendChild( renderer.domElement );

        // 创建纹理贴图
        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load(opengl)
        // wrapS 定义纹理贴图在水平方向上如何包裹
        // wrapT 定义纹理贴图在垂直方向上如何包裹
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.colorSpace = THREE.SRGBColorSpace

        // 创建三维几何体、设置大小
        const geometry = new THREE.CylinderGeometry(5, 5, 24);
        // 创建材质，并设置贴图
        const material = new THREE.MeshBasicMaterial({
          map: texture
        });
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        // 鼠标控制相机
        const mouseCtl = () => {
          // 创建鼠标控制器
          const controls = new OrbitControls(camera, threejs3D)
          controls.addEventListener('change', () => {
            // on change 事件发生的时候重新渲染
            renderer.render( scene, camera );
          })
        }
        mouseCtl()

        let repeatY = 0;
        // 渲染动画/周期渲染
        const animate = () => {
          // 自动刷新动画
          requestAnimationFrame( animate );
          if (texture.offset.y < 1) {
            texture.offset.y -= 0.01
          } else {
            texture.offset.y = 0
          }
          
          // if (repeatY < 0.8) {
          //   texture.repeat.set(repeatY += 0.01, repeatY += 0.01)
          // } else {
          //   repeatY = 0
          // }
          renderer.render( scene, camera );
        }
        animate();
      }
    }
    
    // 球形贴图
    const simple3jsSphereTexture = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {

        // 创建场景
        const scene = new THREE.Scene();
        // 设置相机位置
        const camera = new THREE.PerspectiveCamera( 65, threejs3D.clientWidth / threejs3D.clientHeight, 0.1, 1000 );
        camera.position.z = 20;
        // 创建 WebGL 渲染器
        const renderer = new THREE.WebGLRenderer();
        // 设置渲染范围
        renderer.setSize( threejs3D.clientWidth, threejs3D.clientHeight );
        threejs3D.appendChild( renderer.domElement );

        // 创建纹理贴图
        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load(opengl)
        // wrapS 定义纹理贴图在水平方向上如何包裹
        // wrapT 定义纹理贴图在垂直方向上如何包裹
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        texture.colorSpace = THREE.SRGBColorSpace

        // 创建三维几何体、设置大小
        const geometry = new THREE.SphereGeometry(10, 32, 16);
        // 创建材质，并设置贴图
        const material = new THREE.MeshBasicMaterial({
          map: texture
        });
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        // 鼠标控制相机
        const mouseCtl = () => {
          // 创建鼠标控制器
          const controls = new OrbitControls(camera, threejs3D)
          controls.addEventListener('change', () => {
            // on change 事件发生的时候重新渲染
            renderer.render( scene, camera );
          })
        }
        mouseCtl()

        // 渲染动画/周期渲染
        const animate = () => {
          // 自动刷新动画
          requestAnimationFrame( animate );

          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          renderer.render( scene, camera );
        }
        animate();
      }
    }
    
    // 圆形平面贴图
    const simple3jsCircleTexture = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {

        // 创建场景
        const scene = new THREE.Scene();
        // 设置相机位置
        const camera = new THREE.PerspectiveCamera( 75, threejs3D.clientWidth / threejs3D.clientHeight, 0.1, 1000 );
        camera.position.z = 5;
        // 创建 WebGL 渲染器
        const renderer = new THREE.WebGLRenderer();
        // 设置渲染范围
        renderer.setSize( threejs3D.clientWidth, threejs3D.clientHeight );
        threejs3D.appendChild( renderer.domElement );

        // 创建纹理贴图
        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load(opengl)
        // wrapS 定义纹理贴图在水平方向上如何包裹
        // wrapT 定义纹理贴图在垂直方向上如何包裹
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        texture.colorSpace = THREE.SRGBColorSpace

        // 创建三维几何体、设置大小
        const geometry = new THREE.CircleGeometry( 10, 100 );
        // 创建材质，并设置贴图
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          side: THREE.DoubleSide // 两面都设置贴图
        });
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        // 鼠标控制相机
        const mouseCtl = () => {
          // 创建鼠标控制器
          const controls = new OrbitControls(camera, threejs3D)
          controls.addEventListener('change', () => {
            // on change 事件发生的时候重新渲染
            renderer.render( scene, camera );
          })
        }
        mouseCtl()

        // 渲染动画/周期渲染
        const animate = () => {
          // 自动刷新动画
          requestAnimationFrame( animate );

          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          renderer.render( scene, camera );
        }
        animate();
      }
    }
    
    // 设置纹理贴图
    const simple3jsWithTexture = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {

        // 创建场景
        const scene = new THREE.Scene();
        // 设置相机位置
        const camera = new THREE.PerspectiveCamera( 75, threejs3D.clientWidth / threejs3D.clientHeight, 0.1, 1000 );
        camera.position.z = 5;
        // 创建 WebGL 渲染器
        const renderer = new THREE.WebGLRenderer();
        // 设置渲染范围
        renderer.setSize( threejs3D.clientWidth, threejs3D.clientHeight );
        threejs3D.appendChild( renderer.domElement );

        // 创建纹理贴图
        const textureLoader = new THREE.TextureLoader()
        const texture = textureLoader.load(opengl)
        // wrapS 定义纹理贴图在水平方向上如何包裹
        // wrapT 定义纹理贴图在垂直方向上如何包裹
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        texture.colorSpace = THREE.SRGBColorSpace
        
        // 创建三维几何体、设置大小
        const geometry = new THREE.BoxGeometry( 2, 2, 2 );
        // 创建材质，并设置贴图
        const material = new THREE.MeshBasicMaterial( { map: texture } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        // 鼠标控制相机
        const mouseCtl = () => {
          // 创建鼠标控制器
          const controls = new OrbitControls(camera, threejs3D)
          controls.addEventListener('change', () => {
            // on change 事件发生的时候重新渲染
            renderer.render( scene, camera );
          })
        }
        mouseCtl()

        // 渲染动画/周期渲染
        const animate = () => {
          // 自动刷新动画
          requestAnimationFrame( animate );

          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          renderer.render( scene, camera );
        }
        animate();
      }
    }
    
    // 简单的 three-js 上手
    const simple3js = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {

        // 创建场景
        const scene = new THREE.Scene();
        // 设置相机位置
        const camera = new THREE.PerspectiveCamera( 75, threejs3D.clientWidth / threejs3D.clientHeight, 0.1, 1000 );
        // 创建 WebGL 渲染器
        const renderer = new THREE.WebGLRenderer();
        // 设置渲染范围
        renderer.setSize( threejs3D.clientWidth, threejs3D.clientHeight );
        threejs3D.appendChild( renderer.domElement );

        // 创建三维几何体、设置大小
        const geometry = new THREE.BoxGeometry( 2, 2, 2 );
        // 设置几何体材质、颜色
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;

        // 开始渲染
        renderer.render( scene, camera );

        // 鼠标控制相机
        const mouseCtl = () => {
          // 创建鼠标控制器
          const controls = new OrbitControls(camera, threejs3D)
          controls.addEventListener('change', () => {
            // on change 事件发生的时候重新渲染
            renderer.render( scene, camera );
          })
        }
        mouseCtl()

        // 渲染动画/周期渲染
        const animate = () => {
          // 自动刷新动画
          requestAnimationFrame( animate );

          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;

          renderer.render( scene, camera );
        }
        animate();
      }
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column', height: '95%', margin: '10px', backgroundColor: '#333'}}>
        <h1>threejs&nbsp;
          <span onClick={draw3jsBeatsModel}>beats-click</span> &nbsp;
          <span onClick={draw3jsRobotModel}>robot-click</span> &nbsp;
          <span onClick={draw3jsNaruto}>naruto-click</span>&nbsp;
          <span onClick={gltfPeople}>people-click</span>&nbsp;
          <span onClick={simple3jsCylinderTexture}>simple-click</span>&nbsp;
        </h1>
        <div id={'threejs3DDom'} style={{flex: 1, height: '90%', width: '95%'}}></div>
      </div>
    )
  }
  
  return (
    <div style={{display: 'flex', height: '100vh', width: '100%', cursor: 'pointer'}}>
      <div style={{flex: 1, backgroundColor: "forestgreen", height: '100%'}}>
        <EChart3DGlobeComp />
      </div>
      <div style={{flex: 1, height: '100%', position: 'relative'}}>
        <ThreejsComp />
      </div>
    </div>
  )
}

export default App
