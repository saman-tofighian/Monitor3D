import gsap from "gsap";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const Sc = new three.Scene();
let model;
let status = true;
const gltf = new GLTFLoader();
gltf.load("/models/ultrawide_monitor.glb", (monitor) => {
  model = monitor.scene;
  Sc.add(model);
  let s = 0.3;
  model.scale.set(s, s, s);
  model.position.y = 0.7;
  console.log(model);
  model.children[0].children[0].children[0].children[0].children[0].visible = false;
});

const controll = document.getElementById("btn");
controll.addEventListener("click", () => {
  if (status) {
    controll.style.backgroundImage = "url('/pic/off.png')";

    model.children[0].children[0].children[0].children[0].children[0].visible = true;
    gsap.to(document.body, {
      duration: 1,
      ease: "linear",
      backgroundColor: "#9fb9e9",
    });
    status = false;
  } else {
    model.children[0].children[0].children[0].children[0].children[0].visible = false;
    controll.style.backgroundImage = "url('/pic/onn.png')";
    gsap.to(document.body, {
      duration: 1,
      ease: "linear",
      backgroundColor: "#373636",
    });
    status = true;
  }
});

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new three.PerspectiveCamera(75, size.width / size.height);
camera.position.set(0, 0, 4);
Sc.add(camera);
const aml = new three.AmbientLight("#fff", 2);
const direct1 = new three.DirectionalLight("#fff", 2);
direct1.position.set(0, 0, -1);
const direct3 = new three.DirectionalLight("#fff", 2);
direct3.position.set(0, -1, 0);
const direct4 = new three.DirectionalLight("#fff", 2);
direct4.position.set(0, 1, 0);
const direct5 = new three.DirectionalLight("#fff", 2);
direct5.position.set(-1, 0, 0);
const direct6 = new three.DirectionalLight("#fff", 2);
direct6.position.set(1, 0, 0);
Sc.add(aml, direct1, direct3, direct4, direct5);
const canvas = document.getElementById("web");
const renderer = new three.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(size.width, size.height);
const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;
const animation = () => {
  orbit.update();
  renderer.render(Sc, camera);
  requestAnimationFrame(animation);
};
animation();
window.addEventListener("resize", () => {
  size.width = innerWidth;
  size.height = innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
