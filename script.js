

// --- Core Three.js Variables ---
let scene, camera, renderer, clock;
let cube; // Variable for the central test cube

// --- Movement and Boundary Variables ---
const rotationSensitivity = 0.002; // Mouse look sensitivity
const PI_2 = Math.PI / 2; // Clamp constant for vertical rotation
const moveSpeed = 3.0; // Increased speed for testing
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canMove = true; 

// Rectangular Path Boundaries (20x10 area)
const minX = -10;
const maxX = 10;
const minZ = -5;
const maxZ = 5;

function init() {
    // 1. SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x555555); // Dark gray background

    // 2. CAMERA
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.6, 0); // Start position (outside the -5 to 5 Z range)
    camera.rotation.order = "YXZ"

    // 3. RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Helps with sharpness on high-res screens
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    document.body.appendChild(renderer.domElement); // !!! Crucial: attaches the canvas to the HTML body

    // 4. CLOCK
    clock = new THREE.Clock();

    // --- LIGHTING (Simplified and Bright) ---
    
    // A. Ambient Light: Soft illumination everywhere
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0); // Bright white ambient light
    scene.add(ambientLight);

    // B. Point Light: Placed high up like a ceiling lamp
    const pointLight = new THREE.PointLight(0xFFFFFF, 30, 100); // Very bright point light (Intensity 30)
    pointLight.position.set(0, 5, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // 5. GEOMETRY: FLOOR AND WALLS
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to lie flat on the XZ plane
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls (Using helper function)
    addWall(new THREE.Vector3(0, 1.5, minZ), 20, 3, 0);           // Back Wall
    addWall(new THREE.Vector3(0, 1.5, maxZ), 20, 3, 0);           // Front Wall
    addWall(new THREE.Vector3(minX, 1.5, 0), 10, 3, Math.PI / 2); // Left Wall
    addWall(new THREE.Vector3(maxX, 1.5, 0), 10, 3, Math.PI / 2); // Right Wall

    // 6. TEST OBJECT (Should be highly visible)
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 }); // Bright Red, reacts to light
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0.5, 0); // Center of the path, sitting on the floor
    cube.castShadow = true;
    scene.add(cube);

    // 7. CONTROLS
    // Only capture mouse movement when clicking the screen
    document.addEventListener('click', () => {
        // Request pointer lock when the document is clicked
        document.body.requestPointerLock();
    });
    document.addEventListener('mousemove', onMouseMove, false);
    // --- END MOUSE LOOK SETUP ---

    // Keyboard Movement Setup
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('resize', onWindowResize, false);

    // Start the render loop
    animate();
}

// Helper function to create and add a wall mesh
function addWall(position, width, height, rotationY) {
    const wallGeometry = new THREE.PlaneGeometry(width, height);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x996633, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.copy(position);
    wall.rotation.y = rotationY;
    wall.receiveShadow = true;
    scene.add(wall);
}

// --- KEYBOARD HANDLING ---

function onKeyDown(event) {
    if (!canMove) return;
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp': moveForward = true; break;
        case 'KeyS':
        case 'ArrowDown': moveBackward = true; break;
        case 'KeyA':
        case 'ArrowLeft': moveLeft = true; break;
        case 'KeyD':
        case 'ArrowRight': moveRight = true; break;
    }
}

function onKeyUp(event) {
    if (!canMove) return;
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp': moveForward = false; break;
        case 'KeyS':
        case 'ArrowDown': moveBackward = false; break;
        case 'KeyA':
        case 'ArrowLeft': moveLeft = false; break;
        case 'KeyD':
        case 'ArrowRight': moveRight = false; break;
    }
}

function onMouseMove(event) {
    // Check if the pointer is locked before applying rotation
    if (document.pointerLockElement === document.body) {
        // Calculate mouse movement deltas
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        // Apply sensitivity (adjust as needed)
        const sensitivity = 0.002; 

        // Update camera rotations
        camera.rotation.y -= movementX * sensitivity;
        camera.rotation.x -= movementY * sensitivity;

        // Optional: Clamp vertical rotation (looking up/down) to prevent flipping the camera
        const PI_2 = Math.PI / 2;
        camera.rotation.x = Math.max(-PI_2, Math.min(PI_2, camera.rotation.x))
    }
}

// --- ANIMATION LOOP ---

function updateMovement(delta) {
    // Create a vector representing the movement direction
    const velocity = new THREE.Vector3(0, 0, 0);
    const actualMoveDistance = moveSpeed * delta;

    if (moveForward) velocity.z -= actualMoveDistance;
    if (moveBackward) velocity.z += actualMoveDistance;
    if (moveLeft) velocity.x -= actualMoveDistance;
    if (moveRight) velocity.x += actualMoveDistance;

    // Apply the movement vector relative to the camera's current rotation
    // We only want to move on the XZ plane (so we ignore the camera's X-rotation/pitch)

    // 1. Rotate the velocity vector based only on the camera's Y (yaw) rotation
    //    We use the negative Y rotation because moving forward (negative Z) should 
    //    align with the camera's forward direction.
    velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y);

    // 2. Apply the final position update
    camera.position.add(velocity);

    // 3. Enforce Rectangular Path Boundary
    camera.position.x = Math.max(minX, Math.min(maxX, camera.position.x));
    camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z));
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    
    updateMovement(delta);
    
    // Optional: Rotate the cube to confirm animation is running
    cube.rotation.y += 0.01; 

    renderer.render(scene, camera);
}

// --- WINDOW RESIZE HANDLING ---

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize the scene
init();