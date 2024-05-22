<template>
    <div id="info"></div>
  </template>
  
  <script >
  import { onMounted,ref } from 'vue'
  import * as THREE from 'three'  
  import * as d3 from "d3";  //莫开托坐标 矫正地图坐标
  import map from '/public/map.json'
  // 引入轨道控制器扩展库OrbitControls.js
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  // 文本缓冲几何体
  import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
  // 一个用于加载JSON格式的字体的类
  import { FontLoader } from 'three/addons/loaders/FontLoader.js';
  
  
  const width = window.innerWidth, height = window.innerHeight;
  
  const handleProj = d3.geoMercator().center([109, 34.5]).scale(1000).translate([0, 0]) // d3投影转换函数
  const mapContainer = new THREE.Object3D() // 存储地图Object3D对象
  
  
  // 创建相机
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10000);
  camera.position.z = 900;
  
  // 创建3D场景对象Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#ffffff'); // 将背景颜色设置为白色
  scene.fog = new THREE.Fog( 0xffffff, 1, 2900 );
  // scene.fog = new THREE.Fog( 0xff0000, 1000, 1500 );
  
  // 初始化环境光
  const initLight = () => {
    const ambLight = new THREE.AmbientLight('#ffffff', 0.3) // 基本光源
    /**
     * 设置聚光灯相关的的属性，详情见P54
     */
    const spotLight = new THREE.SpotLight(0xFFFFFF); // 聚光灯
    spotLight.position.set(40, 200, 10);
    spotLight.castShadow = true; // 只有该属性为true时，该点光源允许产生阴影，并且下列属性可用
    scene.add(ambLight, spotLight); // 向场景中添加光源
  }
  
  // 初始化渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  
  // 创建外魔法阵
  let textureloader = new THREE.TextureLoader();
  let mofazhenwai = textureloader.load("./public/mofazhenwai.png")
  const geometry = new THREE.RingGeometry( 232.8, 720, 32 );
  // 创建材质
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x1d0f20,
    side: THREE.DoubleSide,
    map:mofazhenwai,
    transparent:true
  });
  // 创建网格
  const mofazhen = new THREE.Mesh(geometry, material);
  mofazhen.position.set(-200, 0, -500); // 根据你的需求设置位置
  mofazhen.rotation.y = 0.5
  //创建内魔法阵
  const mofazhen2_j = new THREE.RingGeometry( 103, 232, 32 );
  const cmofazhen2 = new THREE.Mesh( mofazhen2_j, material );
  mofazhen.add( cmofazhen2 );
  // 创建核心魔法阵
  const mofazhennei_j = new THREE.RingGeometry( 0, 103, 32 );
  let mofazhennei = textureloader.load("./public/mofazhennei1.png")
  const mofazhenneicaizhi = new THREE.MeshBasicMaterial({ 
    color: 0x1d0f20,
    side: THREE.DoubleSide,
    map:mofazhennei,
    transparent:true
  });
  const cmofazhennei = new THREE.Mesh( mofazhennei_j, mofazhenneicaizhi);
  mofazhen.add( cmofazhennei );
  // 创建外围魔法阵
  const wei1 = new THREE.RingGeometry(0,240,32);
  const mwei1 = new THREE.MeshBasicMaterial( { color: 0x1d0f20, 
    side: THREE.DoubleSide,
    map:mofazhennei,
    transparent:true,
  } );
  const cwei1 = new THREE.Mesh(wei1,mwei1);
  cwei1.position.set(960,0,0);
  const cwei2 = new THREE.Mesh(wei1,mwei1);
  cwei2.position.set(-960,0,0);
  const cwei3 = new THREE.Mesh(wei1,mwei1);
  cwei3.position.set(0,960,0);
  const cwei4 = new THREE.Mesh(wei1,mwei1);
  cwei4.position.set(0,-960,0);
  mofazhen.add(cwei1);
  mofazhen.add(cwei2);
  mofazhen.add(cwei3);
  mofazhen.add(cwei4);
  
  scene.add(mofazhen);
  
  // 初始化地理数据集
  const initGeom = () => {
    // 加载中国地区的geoJson数据集
    // const fileLoader = new THREE.FileLoader();
    // fileLoader.load('/src/assets/map/map.json',
    //     (data) => {
    //         const chinaJson = JSON.parse(data)
    //         handleData(chinaJson)
    //     }
    // )
    handleData(map)
  }
  
  
  
  // 处理地图数据 GeoJson data
  const handleData = (jsonData) => {
    const feaureList = jsonData.features;
    feaureList.forEach((feature) => { // 每个feature都代表一个省份
        const province = new THREE.Object3D;
        province.properties = feature.properties.name // 省份名称
        province.name = feature.properties.name // 省份名称
        mapContainer.name = feature.properties.name // 省份名称
        const coordinates = feature.geometry.coordinates // 省份坐标信息
        if (feature.geometry.type === 'MultiPolygon') {
            coordinates.forEach((coord) => {
                coord.forEach((coordinate) => {
                    // 三维多边形
                    const extrudeMesh = creatDepthPolygon(coordinate)
                    extrudeMesh.properties = feature.properties.name
                    // 线条
                    const line = createLine(coordinate);
                    province.add(extrudeMesh)
                    province.add(line)
                })
            })
        }
        if (feature.geometry.type === 'Polygon') {
            coordinates.forEach((coordinate) => {
                // 三维多边形
                const extrudeMesh = creatDepthPolygon(coordinate)
                extrudeMesh.properties = feature.properties.name
                // 线条
                const line = createLine(coordinate);
                province.add(extrudeMesh)
                province.add(line)
            })
        }
        mapContainer.add(province)
        mapContainer.rotation.y = 0.5
    })
    scene.add(mapContainer)
  }
  
  // 创建三维多边形
  const creatDepthPolygon = (coordinate) => {
    const shape = new THREE.Shape();
  
    coordinate.forEach((item, index) => { // 每一个item都是MultiPolygon中的一个polygon
        const [x_XYZ, y_XYZ] = handleProj(item)
        if (index === 0) {
            shape.moveTo(x_XYZ, -y_XYZ)
        } else {
            shape.lineTo(x_XYZ, -y_XYZ)
        }
    })
    const extrudeSettings = {
        steps: 2,
        depth: 19,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
    };
  
  
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)  //挤压缓冲几何体
    const material = new THREE.MeshBasicMaterial({
        // color: new THREE.Color(Math.random() * 0xffffff), // 每个省随机赋色
        color: '#1d0f20',
        // side: THREE.DoubleSide, 
        transparent: true,
        opacity: 0.8
    })
    return new THREE.Mesh(geometry, material)
  }
  
  // 创建线条
  const createLine = (coordinate) => {
    const material = new THREE.LineBasicMaterial({
        color: '#ffffff'
    });
    const points = []
    coordinate.forEach((item, index) => { // 每一个item都是MultiPolygon中的一个polygon
        const [x_XYZ, y_XYZ] = handleProj(item)
        points.push(new THREE.Vector3(x_XYZ, -y_XYZ, 25))
    })
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
    return new THREE.Line(geometry, material);
  }
  
  // 光线投射Raycaster  
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  
  //鼠标放上去 改变颜色 显示地区名字
  let activeIntersects = []; //鼠标滑过数据
  const onPointerMove = (event) => {
    let info = document.querySelector('#info')
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
  
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);
  
    // 判断数组是否有数据，有数据全部设置为原始数据
    if (activeIntersects.length) {
        for (let i = 0; i < activeIntersects.length; i++) {
            activeIntersects[i].object.material.color.set('#1d0f20');
            activeIntersects[i].object.position.z -= 20; // 将 z 值减少 1
        }
    }
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children);
  
    if (intersects.length &&  intersects[0].object.parent.name) {
        // 设置hove 弹框的宽高
        info.style.left = event.clientX + 'px'
        info.style.top = event.clientY + 'px'
        info.style.display = 'block'
        info.innerHTML = intersects[0].object.parent.name
    }else{
        info.style.display = 'none'
    }
  
    // 数组数据清空
    activeIntersects = []
  
    // 滑过的当前这个高亮
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.type === 'Mesh') {
            intersects[i].object.material.color.set(0x401a5b);
            intersects[i].object.position.z += 20;
            activeIntersects.push(intersects[i])
        }
  
    }
  }
  
  window.addEventListener('pointermove', onPointerMove);
  
  // 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true  //阻尼 更真实
  
  
  // // 辅助线 AxesHelper
  // const axesHelper = new THREE.AxesHelper( 500 );
  // scene.add( axesHelper );
  
  // // Three.js 中绘制标签信息 地图名称
  // // 创建省份名称标签
  // var loader = new FontLoader();
  // loader.load('/src/assets/fonts/helvetiker_regular.typeface.json', function (font) {
  //     const geometry = new TextGeometry('mapContainer.name ', {
  // 		font: font,
  // 		size: 80,
  // 		height: 5,
  // 		curveSegments: 12,
  // 		bevelEnabled: true,
  // 		bevelThickness: 10,
  // 		bevelSize: 8,
  // 		bevelSegments: 5
  // 	} );
  //   const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //   const textMesh = new THREE.Mesh(geometry, textMaterial);
  //   textMesh.position.x = -1;
  //   textMesh.position.y = 1;
  //   scene.add(textMesh);
  // });
  
  
  // 渲染
  // 因为后期是每一帧都需要渲染，需要封装一个渲染函数
  const render = () => {
    // 使用渲染器，通过相机 将场景渲染出
    mofazhen.rotation.z += 0.02;
    cmofazhen2.rotation.z -= 0.05;
    cmofazhennei.rotation.z += 0.02;
    cwei1.rotation.z -= 0.07;
    cwei2.rotation.z -= 0.07;
    cwei3.rotation.z -= 0.07;
    cwei4.rotation.z -= 0.07;
    material.color.set(0x1d0f20)
    mofazhenneicaizhi.color.set(0x1d0f20)
    mwei1.color.set(0x1d0f20)
    renderer.render(scene, camera)
    // 渲染下一帧的时候会调用render函数
    requestAnimationFrame(render)
  }
  
  // 4.获取dom实例
  onMounted(() => {
    initGeom();
    initLight();
    render()
    document.body.appendChild(renderer.domElement);
  
  })
  window/addEventListener("resize",() => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  })
  
  
  </script>
  
  <style>
  #info {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border-radius: 2px;
    padding: 5px 10px;
    display: none;
    width: auto; /* 设置宽度自适应 */
  }
  </style>