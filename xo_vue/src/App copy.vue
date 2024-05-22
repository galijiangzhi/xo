<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

// import { RGBEloader}  from 'three/examples/jsm/loaders/RGBEloader.js';
// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x999999)
// 创建相机
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// const geometry = THREE.BoxGeometry()
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
// const cube = new THREE.Mesh(geometry,material)
// scene.add(cube)
// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material00 = new THREE.MeshBasicMaterial( { color: 0x000000 } );
const material01 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const material02 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const material03 = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const material04 = new THREE.MeshBasicMaterial( { color: 0x444444 } );
const material05 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const cube = new THREE.Mesh( geometry, [material00, material01, material02, material03, material04, material05]);
cube.position.set(2,2,2)

//设置立方体放大
cube.scale.set(1,2,1)

//设置旋转
cube.rotation.x = Math.PI / 4 

//间听窗口的变化
window/addEventListener("resize",() => {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
})
scene.add( cube );
let eventobj = {
  Fullscreen:function(){
    document.body.requestFullscreen();
    console.log("quanming");
  },
  Exitfunllscreen:function(){
    document.exitFullscreen();
    console.log("tuichu");
  }
}
//控制立方体位置

const gui = new GUI();
gui.add(eventobj,"Fullscreen").name("全屏");
gui.add(eventobj,"Exitfunllscreen");

let folder = gui.addFolder("立方体装置")

folder.add(cube.position,"x",-5,5).name("立方体x轴位置")
folder.add(cube.position,"y",-5,5).name("立方体y轴位置")
folder.add(cube.position,"z",-5,5).name("立方体z轴位置")

let colorparams = {
  cubecolor:'#ff0000',
};
gui.addColor(colorparams,"cubecolor").name("立方体颜色").onChange((val) => {
  cube.material.color.set(val);
});
camera.position.z = 5;
camera.position.y = 1;
camera.position.x = 1;

// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;
// controls.autoRotate = true;

//创建集合体
const jiheti = new THREE.BufferGeometry();
// //创建顶点数据
const vartices = new Float32Array([
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,-1.0, 1.0, 1.0,
])
jiheti.setAttribute("position",new THREE.BufferAttribute(vartices,3));
const indices = new Uint16Array([0,1,2,2,3,0]);
jiheti.setIndex(new THREE.BufferAttribute(indices,1));

//设置两个顶点组 分别不同材质
jiheti.addGroup(0,3,0);
jiheti.addGroup(3,3,1);
//创建材质
const material0 = new THREE.MeshBasicMaterial({
  color:0x00ff00,
  // wireframe:true,
  side:THREE.DoubleSide,
})
const material1 = new THREE.MeshBasicMaterial({
  color:0xff0000,
  // wireframe:true,
  side:THREE.DoubleSide,
})
const plane = new THREE.Mesh(jiheti,[material0,material1])
scene.add(plane)
//实例化loder
let rgbeloader = new RGBEloader();
rgbeloader.load("tupiandizhi",(envMap) => {
  scene.env
})
//创建纹理加载器
// let textureloader = new THREE.TextureLoader();,
//加载纹理
function animate() {
  controls.update()
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
}

animate();
</script>

<template>
</template>

<style scoped>

</style>
