<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x999999)
scene.rotation.y = 0.51;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const geometry = new THREE.RingGeometry( 0.97, 3, 32 );

let textureloader = new THREE.TextureLoader();
let mofazhenwai = textureloader.load("./public/mofazhenwai.png")
let mofazhennei = textureloader.load("./public/mofazhennei1.png")
// 0x1d0f20
// 0x2d1f30
const material = new THREE.MeshBasicMaterial( { color: 0x1d0f20, 
  side: THREE.DoubleSide,
  map:mofazhenwai,
  transparent:true,
} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const geometry1 = new THREE.RingGeometry( 0.43, 0.96, 32 );
const cube1 = new THREE.Mesh( geometry1, material );
scene.add( cube1 );


const geomentry2 = new THREE.RingGeometry(0,0.445,32);
const material2 = new THREE.MeshBasicMaterial( { color: 0x1d0f20, 
  side: THREE.DoubleSide,
  map:mofazhennei,
  transparent:true,
} );
const cube2 = new THREE.Mesh(geomentry2,material2);
scene.add(cube2);

const wei1 = new THREE.RingGeometry(0,1,32);
const mwei1 = new THREE.MeshBasicMaterial( { color: 0x1d0f20, 
  side: THREE.DoubleSide,
  map:mofazhennei,
  transparent:true,
} );
const cwei1 = new THREE.Mesh(wei1,mwei1);
cwei1.position.set(4,0,0);
const cwei2 = new THREE.Mesh(wei1,mwei1);
cwei2.position.set(-4,0,0);
const cwei3 = new THREE.Mesh(wei1,mwei1);
cwei3.position.set(0,4,0);
const cwei4 = new THREE.Mesh(wei1,mwei1);
cwei4.position.set(0,-4,0);
cube.add(cwei1);
cube.add(cwei2);
cube.add(cwei3);
cube.add(cwei4);



// cube.add(cwei1);

camera.position.z = 5;

function animate() {
  requestAnimationFrame( animate );

  cube.rotation.z += 0.02;
  cube1.rotation.z -= 0.015;
  cube2.rotation.z += 0.04;
  cwei1.rotation.z -= 0.05;
  cwei2.rotation.z -= 0.05;
  cwei3.rotation.z -= 0.05;
  cwei4.rotation.z -= 0.05;

  renderer.render( scene, camera );
}
window/addEventListener("resize",() => {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
})

animate();
</script>

<template>
</template>

<style scoped>

</style>
