import * as THREE from "three";

import { OrbitControls }
    from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";


// ==========================================
// BLE
// ==========================================

let currentX = 0;
let currentY = 0;
let currentZ = 0;

const SERVICE_UUID =
    "12345678-1234-1234-1234-123456789abc";

const CHARACTERISTIC_UUID =
    "abcdefab-1234-1234-1234-abcdefabcdef";

async function connectBLE() {

    try {

        const device =
            await navigator.bluetooth.requestDevice({

                filters: [
                    {
                        services: [
                            SERVICE_UUID
                        ]
                    }
                ],

                optionalServices: [
                    SERVICE_UUID
                ]

            });

        const server =
            await device.gatt.connect();

        const service =
            await server.getPrimaryService(
                SERVICE_UUID
            );

        const characteristic =
            await service.getCharacteristic(
                CHARACTERISTIC_UUID
            );

        await characteristic.startNotifications();

        characteristic.addEventListener(

            "characteristicvaluechanged",

            event => {

                const value =
                    new TextDecoder().decode(
                        event.target.value
                    );

                console.log(
                    "RX:",
                    value
                );

                const parts =
                    value.split(",");

                if (parts.length >= 3) {

                    currentX =
                        parseFloat(parts[0]);

                    currentY =
                        parseFloat(parts[1]);

                    currentZ =
                        parseFloat(parts[2]);

                }

            }

        );

        console.log(
            "BLE Connected"
        );

    }

    catch (error) {

        console.error(
            error
        );

    }

}


// ==========================================
// Connect Button
// ==========================================

const button =
    document.getElementById(
        "connectBtn"
    );

if (button) {

    button.addEventListener(

        "click",

        connectBLE

    );

}


// ==========================================
// Scene
// ==========================================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x101820
    );


// ==========================================
// Camera
// ==========================================

const camera =
    new THREE.PerspectiveCamera(

        75,

        window.innerWidth /
        window.innerHeight,

        0.1,

        1000

    );

camera.position.set(
    20,
    20,
    20
);


// ==========================================
// Renderer
// ==========================================

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


// ==========================================
// Controls
// ==========================================

const controls =
    new OrbitControls(

        camera,

        renderer.domElement

    );

controls.enableDamping =
    true;


// ==========================================
// Light
// ==========================================

scene.add(

    new THREE.AmbientLight(

        0xffffff,

        3

    )

);


// ==========================================
// Grid
// ==========================================

const grid =
    new THREE.GridHelper(

        100,
        100,

        0x69A0FF,

        0x305080

    );

scene.add(
    grid
);


// ==========================================
// Axis
// ==========================================

scene.add(
    new THREE.AxesHelper(5)
);


// ==========================================
// Marker
// ==========================================

const marker =
    new THREE.Group();

const core =
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

const glow =
    new THREE.Mesh(

        new THREE.SphereGeometry(

            0.4,

            32,

            32

        ),

        new THREE.MeshBasicMaterial({

            color: 0x7DF9FF,

            transparent: true,

            opacity: 0.35

        })

    );

marker.add(glow);
marker.add(core);

scene.add(marker);


// ==========================================
// Trail
// ==========================================

const trailPoints = [];

let trailLine = null;

const TRAIL_DURATION =
    10000;


// ==========================================
// Animate
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    );

    marker.position.set(

        currentX,

        currentY,

        currentZ

    );

    trailPoints.push({

        position:
            new THREE.Vector3(

                currentX,

                currentY,

                currentZ

            ),

        timestamp:
            Date.now()

    });

    const now =
        Date.now();

    while (

        trailPoints.length > 0 &&

        now -

        trailPoints[0]
            .timestamp >

        TRAIL_DURATION

    ) {

        trailPoints.shift();

    }

    if (
        trailLine
    ) {

        scene.remove(
            trailLine
        );

    }

    const positions =
        trailPoints.map(

            p => p.position

        );

    const geometry =
        new THREE.BufferGeometry()

            .setFromPoints(
                positions
            );

    trailLine =
        new THREE.Line(

            geometry,

            new THREE.LineBasicMaterial({

                color: 0x7DF9FF

            })

        );

    scene.add(
        trailLine
    );

    controls.update();

    renderer.render(

        scene,

        camera

    );

}

animate();


// ==========================================
// Resize
// ==========================================

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