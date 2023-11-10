import './App.css'

// echarts
import * as echarts from 'echarts';
import 'echarts-gl';
import eChart3DEarthImg from '@/assets/echart/3d-earth-world.topo.bathy.200401.jpg'
import eChart3DBgImg from '@/assets/echart/bg-starfield.jpg'
import eChart3DHDR from '@/assets/echart/pisa.hdr'

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
    return (
      <div>
        <h1>three-js</h1>
      </div>
    )
  }
  
  
  return (
    <div style={{display: 'flex', height: '100vh', width: '100%', cursor: 'pointer'}}>
      <div style={{flex: 1, backgroundColor: "forestgreen", height: '100vh'}}>
        <EChart3DGlobeComp />
      </div>
      <div style={{flex: 1, backgroundColor: 'orangered', height: '100%'}}>
        <ThreejsComp />
      </div>
    </div>
  )
}

export default App
