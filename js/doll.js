import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { store } from './redux/store.js';
import {RED,GREEN} from './redux/feature/changeColorSlice.js'
import { updateLegs } from './redux/feature/trackingMovement.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xb7c3f3, 1);


const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

camera.position.z = 5;


function createCube(size, xpos, ypos,col='000000') {
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial({ color: parseInt(col, 16) });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = xpos;
    cube.position.y = ypos;
    scene.add(cube);
    return cube; 
}


function createCircle(size, pos, col = 'FFFFFF') {
    const geometry = new THREE.CircleGeometry(size.r, size.s);
    const material = new THREE.MeshBasicMaterial({ color: parseInt(col, 16) });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.x = pos;
    circle.position.y = 2;
    scene.add(circle);
}


const loader = new GLTFLoader();

class Doll {
    constructor() {
        loader.load(
            '../model/scene.gltf',
            (gltf) => {
                scene.add(gltf.scene);
                gltf.scene.scale.set(0.22, 0.22, 0.22);
                this.Doll = gltf.scene;
                this.Doll.position.y = 1; 
            }
        );
    }

    lookBack() {
        gsap.to(this.Doll.rotation, { y: -3.15, duration: 1 });
    }

    lookForward() {
        gsap.to(this.Doll.rotation, { y: 0, duration: 1 });
    }
}

let DOLL = new Doll();

function createTrack() {
    
    createCube({ w: 30, h: 1, d: 10 }, -1, 10);
    
    changeLight()

    
   
    const roadGeometry = new THREE.PlaneGeometry(30, 10);
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -3;
    scene.add(road);
   
    createCube({ w: 0.5, h: 0.1, d: 10 }, -10, -3, 'FF0000'); 

   
    createCube({ w: 0.5, h: 0.1, d: 10 }, 10, -3, '00FF00'); 
}

const blackBar = createCube({ w: 1.2, h: 0.3, d: 0.3 }, -6.5, -2);
function changeLight(){
    
    const random = Math.random();
    createCircle({ r: 0.7, s: 70 }, -3);
    createCircle({ r: 0.7, s: 70 }, 3);
    if (random < 0.6) {
     setTimeout(()=>{
        DOLL.lookForward()
        
     },1000)
     store.dispatch(RED());

         createCircle({ r: 0.7, s: 70 }, -3, 'ff0000'); // red
    } else {
        setTimeout(()=>{
            DOLL.lookBack()
         },1000)
         store.dispatch(GREEN());
   
         createCircle({ r: 0.7, s: 70 }, 3, '00FF00'); // green
    }

}   

let gameOverListenerAdded = false;

function checkGameState() {
    const state = store.getState().changeColorSlice;
    console.log(store.getState().trackingMovement)
    if (state.red) {
       console.log("stop")
            window.addEventListener('keydown',(e)=>{
                if(e.key =="ArrowLeft"){
                    console.log("you lose")
                    gameOverListenerAdded = true;
                    //clearInterval(Id);
                }
            });
          
        
      
    }
    if (state.green) {
        console.log("OK to go");
        if(!gameOverListenerAdded && blackBar.position.x>6){
            console.log("you win");
        }
    }
}



const leftLimit = -6.6;
const rightLimit = 6.6;
let Id;
   
    if(blackBar.position.x<6.5){
       Id = setInterval(()=>{
        updateLegs();
        changeLight();
        checkGameState();
       },Math.random()*1000+2000)
    }
    createTrack();
    
function moveBar(direction) {
    const targetX = blackBar.position.x + (direction === 'left' ? -1 : 1);

    
    if (targetX >= leftLimit && targetX <= rightLimit) {
        gsap.to(blackBar.position, { x: targetX, duration: 0.5, ease: 'power1.out' });
    }
}



window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveBar('left');
    } else if (event.key === 'ArrowRight') {
        moveBar('right');
    }
});






function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

console.log("hello")