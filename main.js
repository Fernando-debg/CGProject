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
    camera.position.set(4, 2, 11);
    camera.rotation.order = "YXZ"; 

    // Lighting
    const spotLight = new THREE.SpotLight(0xffde64, 7, 100, .2, .5);
    spotLight.position.set(0, 25, 0);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    scene.add(spotLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    // Ground Plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        side: THREE.DoubleSide
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Load GLTF Model (Racecar example)
    const loader = new GLTFLoader().setPath('public/racecar/');
    loader.load('scene.gltf', (gltf) => {
        console.log('loading model');
        const mesh = gltf.scene;

        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        mesh.position.set(0, 1.05, -1);
        scene.add(mesh);

        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }, (xhr) => {
        console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    }, (error) => {
        console.error(error);
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