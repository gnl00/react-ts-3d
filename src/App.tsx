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
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader' // 导入 fbx 格式模型
import Stats from 'three/examples/jsm/libs/stats.module' // 显示帧率
import xBot from '@/assets/3js/xbot.fbx'
import naruto from '@/assets/3js/Naruto.fbx'
import beats from '@/assets/3js/beats_highpoly.fbx'

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
    
    const draw3js3D = () => {
      const threejs3D = document.getElementById('threejs3DDom')
      if (threejs3D) {
        // 创建场景
        const scene = new THREE.Scene()
        // scene.background = new THREE.Color(0xf65144); // 设置场景背景颜色
        // 添加辅助坐标系
        scene.add(new THREE.AxesHelper(5))
        
        // 创建灯光
        // naruto 不需要灯光。。。
        const light = new THREE.PointLight(0xffffff, 50)
        light.position.set(0.8, 1.4, 1.0)
        scene.add(light)

        // 环境光
        const ambientLight = new THREE.AmbientLight()
        scene.add(ambientLight)

        // 创建摄像头
        const camera = new THREE.PerspectiveCamera(
          65, // 默认 50
          window.innerWidth / window.innerHeight, // 默认值为 1，数值不等于 1 的话模型会变形，小于 1 被压缩，大于 1 被拉长
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
            model.scale.set(.028, 0.028, .028)
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
    
    return (
      <div style={{display: 'flex', flexDirection: 'column', height: '95%', margin: '20px', backgroundColor: '#333'}}>
        <h1 onClick={draw3js3D}>threejs-3d-click-me</h1>
        <div id={'threejs3DDom'} style={{flex: 1, height: '90%', width: '95%'}}></div>
      </div>
    )
  }
  
  
  return (
    <div style={{display: 'flex', height: '100vh', width: '100%', cursor: 'pointer'}}>
      <div style={{flex: 1, backgroundColor: "forestgreen", height: '100%'}}>
        <EChart3DGlobeComp />
      </div>
      <div style={{flex: 1, height: '100%'}}>
        <ThreejsComp />
      </div>
    </div>
  )
}

export default App
