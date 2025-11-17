import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

//sets up a scene, camera, and renderer 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //THREE.PerspectiveCamera(FOV, aspectRatio, nearPlane, farPlane)


//sets size of we want it to render in the app
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;

//sets up pivot point for objects to rotate over (leftclick+drag = rotate from center screen | rightclight+drag = move around screen plane)
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 2,5);
controls.update();

//loads custom file
const gltfLoader = new GLTFLoader();
//gltfLoader.load('./public/TremendousJofo.glb', function(gltf){scene.add(gltf.scene);});
const gltf = await gltfLoader.loadAsync( './public/TremendousJofo.glb' );
scene.add(gltf);

//TESTING OUT LIGHTING + CUBES
//ambient light
const light = new THREE.AmbientLight( 0xffffff , .2); // soft white light
scene.add( light );
//direction light (over head)
const dl = new THREE.DirectionalLight(0xffffff, 0.2);
dl.position.set(0,2,0);
dl.castShadow = true;
scene.add(dl);
//spot lights (up and right of blue cube)
const sl = new THREE.SpotLight(0x0000ff, 1);//b
sl.position.set(2,5,0);
sl.castShadow = true;
const sl2 = new THREE.SpotLight(0xff0000, 1);//r
sl2.position.set(-2,5,0);
sl2.castShadow = true;
const sl3 = new THREE.SpotLight(0x00ff00, 1);//g
sl3.position.set(0,5,0);
sl3.castShadow = true;
sl.shadow.mapSize.width = sl2.shadow.mapSize.width = sl3.shadow.mapSize.width =5000;
sl.shadow.mapSize.height = sl2.shadow.mapSize.height = sl3.shadow.mapSize.height =5000;
scene.add(sl);
scene.add(sl2);
scene.add(sl3);

//ground
const groundGeometry = new THREE.BoxGeometry(8, 0.5, 8);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.y = -2;
scene.add(groundMesh);

//cubes:
const bg1 = new THREE.BoxGeometry( 1, 1, 1 );
const material1 = new THREE.MeshPhongMaterial( { color: 0xff0000 } );//r
const cube1 = new THREE.Mesh( bg1, material1 );

const bg2 = new THREE.BoxGeometry( 1, 1, 1 );
const material2 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );//g
const cube2 = new THREE.Mesh( bg2, material2 );

const bg3 = new THREE.BoxGeometry( 1, 1, 1 );
const material3 = new THREE.MeshPhongMaterial( { color: 0x0000ff } );//b
const cube3 = new THREE.Mesh( bg3, material3 );

cube1.castShadow = true;
cube2.castShadow = true;
cube3.castShadow = true;
cube1.position.x-=2;
cube3.position.x+=2;
scene.add( cube1 ); //adds cube to 0 0 0
scene.add( cube2 );
scene.add( cube3 );

//actually renders cube to screen
function animate() {
    cube1.rotation.x += 0.01;
    cube2.rotation.y += 0.01;
    cube3.rotation.z += 0.01;
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );