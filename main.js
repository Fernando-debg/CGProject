import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- GLOBAL VARIABLES ---
let camera, renderer, scene;
const clock = new THREE.Clock(); 
const worldPosition = new THREE.Vector3();

// Control Constants
const movementSpeed = 8*2; 
const rotationSpeed = 1.1; 
const PI_2 = Math.PI / 2;

// Input State Variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let lookLeft = false;
let lookRight = false;
let lookUp = false;
let lookDown = false;

//DEBUG
let oscillationCube;
let oscillationCube2;

// --- 1. SETUP FUNCTIONS ---

/**
 * Initializes the Renderer and appends it to the document body.
 */
function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
}

function createSpotlight(x,y,z,color) {
    // 1. Instantiate the light with fixed properties from your example
    // SpotLight( color, intensity, distance, angle, penumbra, decay )
    const light = new THREE.SpotLight(color, 1, 50, Math.PI / 2, 0.7);

    // 2. Apply position and target
    light.position.copy(new THREE.Vector3(x,y,z));

    return light;
}

/**
 * Initializes the Scene, Camera, Lighting, and Geometry.
 */
function setupScene() {
    scene = new THREE.Scene();

    // Camera Setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0,3.3,23);
    camera.rotation.order = "YXZ"; 
    camera.fov = 70;
    camera.updateProjectionMatrix();

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);
   

    //aemes room
    const point = new THREE.PointLight(0xffffff, 0.4, 30);
    point.position.set(74.64, 6, -3.70);
    point.castShadow = true;
    scene.add(point);
    //illusion room
    const pointt = new THREE.PointLight(0xffffff, 1, 50);
    pointt.position.set(-40, 15, 24.88);
    scene.add(pointt);
    //color
    /** */
    const point2 = new THREE.PointLight(0xff0000, 1, 50);
    point2.position.set(-8.15, 3.5, -57.25);
    point2.castShadow = true;
    scene.add(point2);
    const point3 = new THREE.PointLight(0x0000ff, 1, 50);
    point3.position.set(-20.32, 3.5, -61.09);
    point3.castShadow = true;
    scene.add(point3);
    const point4 = new THREE.PointLight(0x0000ff, 1, 50);
    point4.position.set(23.81, 3.5, -45.91);
    point4.castShadow = true;
    scene.add(point4);
    const point5 = new THREE.PointLight(0x00ff00, 1, 50);
    point5.position.set(40.73, 3.5, -63.64);
    point5.castShadow = true;
    scene.add(point5);


    //lastroom
    const pointl = new THREE.PointLight(0xffffff, 1, 50);
    pointl.position.set(69.16, 15, 50.28);
    scene.add(pointl);

    const l1 = createSpotlight(0, 15, 0, 0xffffff);
    const l2 = createSpotlight(-22.18, 15, 43.88, 0xffffff);
    const l3 = createSpotlight(-62.78, 12, 43.88, 0xffffff);
    const l4 = createSpotlight(-62, 15, 2.91, 0xffffff);
    const l5 = createSpotlight(-23.58, 15, 2.91, 0xffffff);
    scene.add(l1);
    scene.add(l2);
    scene.add(l3);
    scene.add(l4);
    scene.add(l5);

    const l6 = createSpotlight(55.49, 11,-23.17, 0xffffff);
    scene.add(l6);

    const l11 = createSpotlight(52.37, 15, 22.71, 0xffffff);
    const l21 = createSpotlight(53.07, 15, 63.88, 0xffffff);
    const l31 = createSpotlight(123.2, 15, 64.31, 0xffffff);
    const l41 = createSpotlight(123, 15, 23.34, 0xffffff);
    scene.add(l11);
    scene.add(l21);
    scene.add(l31);
    scene.add(l41);

    // Load map
    const map = new GLTFLoader().setPath('public/MAPS/map4/');
    map.load('worldmap.gltf', (gltf) =>{
        const mesh = gltf.scene;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(0,0,28);
        scene.add(mesh);
    });


    /**
    //dragon
    const dragons = new GLTFLoader().setPath('public/dragon/');
    dragons.load('scene.gltf', (gltf) => {
        const mesh = gltf.scene;

        enableShadows(mesh);

        const dragcopy = mesh.clone();
        mesh.position.set(-5, 0, 18);
        mesh.rotateY(-Math.PI/2.0);
        scene.add(mesh);
        
        dragcopy.position.set(5,0,18);
        dragcopy.rotateY(Math.PI/2.0);
        
        dragcopy.scale.x = -1;
        scene.add(dragcopy);
    });

    // perception pyramids
    const pyramid1 = new GLTFLoader().setPath('public/pyramid1/');
    pyramid1.load('pyramid4.gltf', (gltf) =>{
        const mesh = gltf.scene;
        enableShadows(mesh);
        mesh.scale.y = mesh.scale.z = .75;
        mesh.position.set(-7, 2, 0);

        scene.add(mesh);
    });
    const pyramid2 = new GLTFLoader().setPath('public/pyramid2/');
    pyramid2.load('pyramid2.gltf', (gltf) =>{
        const mesh = gltf.scene;
        enableShadows(mesh);
        mesh.scale.y = mesh.scale.z = .75;
        mesh.position.set(-7, 2, -6);

        scene.add(mesh);
    });
    const pyramid3 = new GLTFLoader().setPath('public/pyramid3/');
    pyramid3.load('pyramid3.gltf', (gltf) =>{
        const mesh = gltf.scene;
        enableShadows(mesh);
        mesh.scale.y = mesh.scale.z = .75;
        mesh.position.set(-7, 2, -12);

        scene.add(mesh);
    });

    // words 
    const word1 = new GLTFLoader().setPath('public/word/');
    word1.load('doublewords1.gltf', (gltf) =>{
        const mesh = gltf.scene;
        enableShadows(mesh);
        mesh.position.set(0,1,0);
        scene.add(mesh);
    });

    // words 
    const word2 = new GLTFLoader().setPath('public/word2/');
    word2.load('word2.gltf', (gltf) =>{
        const mesh = gltf.scene;
        enableShadows(mesh);
        mesh.position.set(0,1,5);
        scene.add(mesh);
    });

    //impossible cubes
    const cubes = new GLTFLoader().setPath('public/impossible_cubes/');
    cubes.load('impossible_cubes.gltf', (gltf) =>{
        const mesh = gltf.scene;
        enableShadows(mesh);
        mesh.position.set(0,2.5,-10);
        scene.add(mesh);
    });

    //impossible chair
    const chair = new GLTFLoader().setPath('public/chair/');
    chair.load('chair.gltf', (gltf) =>{
        const mesh = gltf.scene;
        enableShadows(mesh);
        mesh.position.set(0,0,0);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.15;
        scene.add(mesh);
    });

    //perspective
    const perspective = new GLTFLoader().setPath('public/perspective/');
    perspective.load('assortment.gltf', (gltf) =>{
        const mesh = gltf.scene;
        enableShadows(mesh);
        mesh.position.set(0,2,-20);
        scene.add(mesh);
    });*/

    //cube used to displays the ames illusion:
    const cubeGeometry = new THREE.BoxGeometry(4,4,4);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00AABB });
    oscillationCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    oscillationCube.position.set(85.48+2-.5, -1.5, -6-3+.5); // Starting center position (X=0)
    oscillationCube.castShadow = true;
    scene.add(oscillationCube);
    oscillationCube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
    oscillationCube2.position.set(85.48-.5-.5, 3, -6+1+1); // Starting center position (X=0)
    oscillationCube2.castShadow = true;
    scene.add(oscillationCube2);

}



/**
 * Sets up all window and keyboard event listeners.
 */
function setupListeners() {
    // Keyboard Control Listeners
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // Window Resize Listener
    window.addEventListener('resize', onWindowResize, false);
}


// --- 2. EVENT HANDLERS ---

function onKeyDown(event) {
    switch (event.code) {
        // Movement
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
        // Look
        case 'ArrowLeft': lookLeft = true; break;
        case 'ArrowRight': lookRight = true; break;
        case 'ArrowUp': lookUp = true; break;
        case 'ArrowDown': lookDown = true; break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        // Movement
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
        // Look
        case 'ArrowLeft': lookLeft = false; break;
        case 'ArrowRight': lookRight = false; break;
        case 'ArrowUp': lookUp = false; break;
        case 'ArrowDown': lookDown = false; break;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


// --- 3. CORE LOGIC ---

/**
 * Updates the camera's position and rotation based on keyboard input state.
 * @param {number} delta - Time elapsed since last frame.
 */
function updateControls(delta) {
    // 1. ROTATION (Camera Viewing)
    const rotationAmount = rotationSpeed * delta;
    
    if (lookLeft) camera.rotation.y += rotationAmount;
    if (lookRight) camera.rotation.y -= rotationAmount;
    
    if (lookUp) camera.rotation.x += rotationAmount;
    if (lookDown) camera.rotation.x -= rotationAmount;

    // Clamp vertical rotation
    camera.rotation.x = Math.max(-PI_2, Math.min(PI_2, camera.rotation.x));
    
    
    // 2. MOVEMENT (Position Change)
    const moveDistance = movementSpeed * delta;
    
    const velocity = new THREE.Vector3();
    if (moveForward) velocity.z -= moveDistance;
    if (moveBackward) velocity.z += moveDistance;
    if (moveLeft) velocity.x -= moveDistance;
    if (moveRight) velocity.x += moveDistance;

    // Apply movement vector relative to the camera's Y-rotation
    velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y);
    
    camera.position.add(velocity);

    // NOTE: Boundary clamping logic to be added here for room sizes
    // For now, the camera is free to roam the 20x20 ground plane.
}

/**
 * The main animation loop.
 */
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta(); 
    
    //
    // Get the total time the scene has been running
    const time = clock.getElapsedTime(); 
    
    // --- OSCILLATION PARAMETERS ---
    const amplitude = .15; // The maximum distance the cube moves from its center (5 units in each direction)
    const speed = 1;     // How fast the cube completes one cycle (1 cycle per 2*PI seconds)

    // Calculate the new X position
    // sin(time * speed) produces a value between -1 and 1
    //const newX = Math.sin(time * speed) * amplitude;
    const newX = -Math.sin(time * speed) * amplitude*.7;
    const newZ = Math.sin(time * speed) * amplitude;
    const newY = Math.sin(time * speed) * amplitude*.1;

    //  animates the cube to be moves back and worth
    if (oscillationCube) {
        oscillationCube.position.x = oscillationCube.position.x + newX; 
        oscillationCube.position.z = oscillationCube.position.z + newZ; 
        oscillationCube.position.y = oscillationCube.position.y + newY; 
    }

    if (oscillationCube2) {
        oscillationCube2.position.x = oscillationCube2.position.x + -newX; 
        oscillationCube2.position.z = oscillationCube2.position.z + -newZ; 
        oscillationCube2.position.y = oscillationCube2.position.y + -newY; 
    }

    updateControls(delta);

    //camera info
    if (camera && document.getElementById('camera-position-display')) {
        
        // Get the current position vector
        const pos = camera.position;
        
        // Format the numbers to two decimal places for cleaner display
        const x = pos.x.toFixed(2);
        const y = pos.y.toFixed(2);
        const z = pos.z.toFixed(2);
        
        // Update the HTML content
        // Update the HTML content
        document.getElementById('camera-position-display').innerText = 
            `Position: X: ${x}, Y: ${y}, Z: ${z}`;
    }

    renderer.render(scene, camera);

}


// --- 4. ENTRY POINT ---

function init() {
    setupRenderer();
    setupScene();
    setupListeners();
    
    // Start the animation loop
    animate();
}

// Execute the initialization
init();