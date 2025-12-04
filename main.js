import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- GLOBAL VARIABLES ---
let camera, renderer, scene;
const clock = new THREE.Clock(); 

// Control Constants
const movementSpeed = 5.0; 
const rotationSpeed = 1; 
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

/**
 * Initializes the Scene, Camera, Lighting, and Geometry.
 */
function setupScene() {
    scene = new THREE.Scene();

    // Camera Setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 2, 28);
    camera.rotation.order = "YXZ"; 

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    // Ground Plane
    const groundGeometry = new THREE.PlaneGeometry(20, 60, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        side: THREE.DoubleSide
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Load GLTF Models
    //dragon
    const dragons = new GLTFLoader().setPath('public/dragon/');
    dragons.load('scene.gltf', (gltf) => {
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        const dragcopy = mesh.clone();
        mesh.position.set(-5, 0, 18);
        mesh.rotateY(-Math.PI/2.0);
        scene.add(mesh);
        
        dragcopy.position.set(5,0,18);
        dragcopy.rotateY(Math.PI/2.0);
        
        dragcopy.scale.x = -1;
        scene.add(dragcopy);
    });

    const pyramid1 = new GLTFLoader().setPath('public/pyramid1/');
    pyramid1.load('pyramid4.gltf', (gltf) =>{
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //mesh.rotateY(-10*(Math.PI/180.0));
        mesh.scale.y = mesh.scale.z = .75;
        mesh.position.set(-7, 2, 0);

        scene.add(mesh);
    });

    const pyramid2 = new GLTFLoader().setPath('public/pyramid2/');
    pyramid2.load('pyramid2.gltf', (gltf) =>{
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //mesh.rotateY(10*(Math.PI/180.0));
        mesh.scale.y = mesh.scale.z = .75;
        mesh.position.set(-7, 2, -6);

        scene.add(mesh);
    });

    const pyramid3 = new GLTFLoader().setPath('public/pyramid3/');
    pyramid3.load('pyramid3.gltf', (gltf) =>{
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //mesh.rotateY(0*(Math.PI/180.0));
        mesh.scale.y = mesh.scale.z = .75;
        mesh.position.set(-7, 2, -12);

        scene.add(mesh);
    });
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
    
    updateControls(delta);
    
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