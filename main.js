import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

//sets up a scene, camera, and renderer 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //THREE.PerspectiveCamera(FOV, aspectRatio, nearPlane, farPlane)
//sets size of we want it to render in the app
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//CUBE EXAMPLE:
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube ); //adds cube to 0 0 0
camera.position.z = 2;

//
const loader = new GLTFLoader().setPath('filepath...')
//load(name of file in dir^, call back function)
loader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0, 1.05, -1);
});

//actually renders cube to screen
function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );