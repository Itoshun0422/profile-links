import * as THREE from "three";

import { OrbitControls }
    from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader }
    from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js";


// =====================
// Scene
// =====================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x101820
    );


// =====================
// Camera
// =====================

const camera =
    new THREE.PerspectiveCamera(

        75,

        window.innerWidth /
        window.innerHeight,

        0.1,

        2000

    );

camera.position.set(
    30,
    20,
    30
);


// =====================
// Renderer
// =====================

const renderer =
    new THREE.WebGLRenderer({

        antialias: true

    });

renderer.setSize(

    window.innerWidth,

    window.innerHeight

);

document.body.appendChild(
    renderer.domElement
);


// =====================
// Controls
// =====================

const controls =
    new OrbitControls(

        camera,

        renderer.domElement

    );

controls.enableDamping =
    true;


// =====================
// Light
// =====================

scene.add(

    new THREE.AmbientLight(

        0xffffff,

        3

    )

);


// =====================
// Floor Data
// =====================

const floors = {};
const LANDMARKS = {};


// =====================
// Marker
// =====================

const marker =
    new THREE.Group();

const markerCore =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.25,
            32,
            32
        ),

        new THREE.MeshBasicMaterial({

            color: 0xffffff

        })

    );

const markerGlow =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.38,
            32,
            32
        ),

        new THREE.MeshBasicMaterial({

            color: 0x7DF9FF,

            transparent: true,

            opacity: 0.35

        })

    );

marker.add(
    markerGlow
);

marker.add(
    markerCore
);

scene.add(
    marker
);

// =====================
// Demo Route
// =====================

const route = [

    [-12, 0, 10],
    [-8, 0, 10],
    [-4, 0, 10],
    [0, 0, 10],

    [5, 0, 10],
    [10, 0, 10],

    [10, 0, 5],
    [10, 0, 0],

    [10, 0, -5],

    [15, 0, -5],
    [20, 0, -5],

    [20, 0, 0],
    [20, 0, 5],
    [20, 0, 10]

];

let routeIndex = 0;

let currentX = route[0][0];
let currentY = route[0][1];
let currentZ = route[0][2];


// 軌跡線表示

const routePoints =

    route.map(

        p => new THREE.Vector3(
            p[0],
            p[1],
            p[2]
        )

    );

const routeGeometry =
    new THREE.BufferGeometry()
        .setFromPoints(
            routePoints
        );

const routeLine =
    new THREE.Line(

        routeGeometry,

        new THREE.LineBasicMaterial({

            color: 0x7DF9FF,

            transparent: true,

            opacity: 0.35

        })

    );

scene.add(
    routeLine
);


// =====================
// UI
// =====================

function createFloorButtons() {

    const ui =
        document.getElementById(
            "ui"
        );

    ui.innerHTML = "";

    const allButton =
        document.createElement(
            "button"
        );

    allButton.className =
        "floor-button";

    allButton.innerText =
        "全体";

    allButton.onclick =
        () => {

            showAllFloors();

            document
                .querySelectorAll(
                    ".floor-button"
                )

                .forEach(

                    button => {

                        button.classList.remove(
                            "active"
                        );

                    }

                );

        };

    ui.appendChild(
        allButton
    );

    Object.keys(
        floors
    )

        .sort(

            (a, b) => {

                const fa =
                    Number(
                        a.split("-")[1]
                    );

                const fb =
                    Number(
                        b.split("-")[1]
                    );

                return fa - fb;

            }

        )

        .forEach(

            floorName => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.className =
                    "floor-button";

                button.dataset.floor =
                    floorName;

                button.innerText =
                    floorName;

                button.onclick =
                    () => {

                        focusFloor(
                            floorName
                        );

                    };

                ui.appendChild(
                    button
                );

            }

        );

}

function updateActiveButton(
    floorName
) {

    document
        .querySelectorAll(
            ".floor-button"
        )

        .forEach(

            button => {

                button.classList.remove(
                    "active"
                );

            }

        );

    const button =
        document.querySelector(

            `[data-floor="${floorName}"]`

        );

    if (button) {

        button.classList.add(
            "active"
        );

    }

}


// =====================
// GLB
// =====================

const loader =
    new GLTFLoader();

loader.load(

    "./building2.glb",

    (gltf) => {

        const building =
            gltf.scene;

        building.traverse(

            (child) => {

                // ==================
                // Landmark
                // ==================

                if (

                    child.type === "Object3D" &&

                    child.name.startsWith(
                        "E_"
                    )

                ) {

                    LANDMARKS[
                        child.name
                    ] = {

                        x: child.position.x,
                        y: child.position.y,
                        z: child.position.z

                    };

                    console.log(

                        "Landmark found:",

                        child.name,

                        LANDMARKS[
                        child.name
                        ]

                    );

                    const lm =
                        new THREE.Mesh(

                            new THREE.SphereGeometry(

                                0.15,

                                16,

                                16

                            ),

                            new THREE.MeshBasicMaterial({

                                color: 0xffaa00

                            })

                        );

                    lm.position.copy(
                        child.position
                    );

                    scene.add(
                        lm
                    );

                }

                // ==================
                // Floor
                // ==================

                if (

                    child.isMesh &&

                    child.name.match(
                        /^\d+\-\d+$/
                    )

                ) {

                    const wire =
                        new THREE.LineSegments(

                            new THREE.EdgesGeometry(
                                child.geometry
                            ),

                            new THREE.LineBasicMaterial({

                                color: 0x69A0FF,

                                transparent: true,

                                opacity: 1

                            })

                        );

                    wire.position.copy(
                        child.position
                    );

                    wire.rotation.copy(
                        child.rotation
                    );

                    wire.scale.copy(
                        child.scale
                    );

                    scene.add(
                        wire
                    );

                    floors[
                        child.name
                    ] = wire;

                    child.visible = false;

                    console.log(
                        "Floor found:",
                        child.name
                    );

                }

            }

        );

        createFloorButtons();

        focusFloor(
            "2-2"
        );

        console.log(
            "building loaded"
        );

    },

    undefined,

    (error) => {

        console.error(
            error
        );

    }

);


// =====================
// Floor Control
// =====================

window.showFloor =
    function (name) {

        Object.values(
            floors
        )

            .forEach(

                floor => {

                    floor.visible =
                        false;

                }

            );

        if (
            floors[name]
        ) {

            floors[name]
                .visible =
                true;

        }

    };

window.showAllFloors =
    function () {

        Object.values(
            floors
        )

            .forEach(

                floor => {

                    floor.visible =
                        true;

                    floor.material.color.set(
                        0x69A0FF
                    );

                    floor.material.opacity =
                        1;

                }

            );

    };

window.focusFloor =
    function (name) {

        Object.entries(
            floors
        )

            .forEach(

                ([floorName, floor]) => {

                    floor.visible =
                        true;

                    floor.material.color.set(

                        floorName === name

                            ? 0x69A0FF

                            : 0x305080

                    );

                    floor.material.opacity =

                        floorName === name

                            ? 1

                            : 0.15;

                }

            );

        updateActiveButton(
            name
        );

    };

window.snapToLandmark =
    function (name) {

        const landmark =
            LANDMARKS[name];

        if (!landmark) {

            console.warn(

                "Landmark not found:",

                name

            );

            return;

        }

        marker.position.set(

            landmark.x,

            landmark.y,

            landmark.z

        );

    };


// =====================
// Marker Control
// =====================

window.moveMarker =
    function (x, y, z) {

        marker.position.set(
            x,
            y,
            z
        );

    };


// =====================
// Resize
// =====================

window.addEventListener(

    "resize",

    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }

);


// =====================
// Render Loop
// =====================

function animate() {

    requestAnimationFrame(
        animate
    );

    const target =
        route[routeIndex];

    const speed = 0.02;

    currentX +=
        (target[0] - currentX)
        * speed;

    currentY +=
        (target[1] - currentY)
        * speed;

    currentZ +=
        (target[2] - currentZ)
        * speed;

    marker.position.set(

        currentX,

        currentY,

        currentZ

    );

    const dx =
        target[0] -
        currentX;

    const dz =
        target[2] -
        currentZ;

    const dist =
        Math.sqrt(
            dx * dx +
            dz * dz
        );

    if (dist < 0.3) {

        routeIndex++;

        if (
            routeIndex >=
            route.length
        ) {

            routeIndex = 0;

        }

    }

    controls.update();

    renderer.render(
        scene,
        camera
    );

}

animate();