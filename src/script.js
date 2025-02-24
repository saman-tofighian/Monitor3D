import gsap from "gsap";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Sc = new three.Scene();
let model, blackScreen;
let status = true;

const gltf = new GLTFLoader();
gltf.load("/models/ultra-wide_monitor.glb", (monitor) => {
  model = monitor.scene;
  Sc.add(model);
  let s = 0.5;
  model.scale.set(s, s, s);
  model.position.y = -0.1;
  model.rotation.y = -1.5;

  let screen =
    model.children[0].children[0].children[0].children[0].children[1];

  const geometry = new three.PlaneGeometry(0.75, 0.001);
  const material = new three.MeshBasicMaterial({ color: "#000" });
  blackScreen = new three.Mesh(geometry, material);
  blackScreen.position.copy(screen.position);
  blackScreen.rotation.copy(screen.rotation);
  blackScreen.visible = false;

  model.add(blackScreen);

  screen.visible = false;
});

const controll = document.getElementById("btn");
controll.addEventListener("click", () => {
  if (status) {
    controll.style.backgroundImage = "url('/pic/off.png')";

    blackScreen.visible = false;
    model.children[0].children[0].children[0].children[0].children[1].visible = true;
    gsap.to(document.body, {
      duration: 1,
      ease: "linear",
      backgroundColor: "#9fb9e9",
    });
    status = false;
  } else {
    blackScreen.visible = true;
    model.children[0].children[0].children[0].children[0].children[1].visible = false;

    controll.style.backgroundImage = "url('/pic/onn.png')";
    gsap.to(document.body, {
      duration: 1,
      ease: "linear",
      backgroundColor: "#373636",
    });
    status = true;
  }
});

const size = { width: window.innerWidth, height: window.innerHeight };
const camera = new three.PerspectiveCamera(75, size.width / size.height);
camera.position.set(0, 1, 4);
Sc.add(camera);

const aml = new three.AmbientLight("#fff", 3);
const direct1 = new three.DirectionalLight("#fff", 3);
direct1.position.set(0, 0, -1);
Sc.add(aml, direct1);

const canvas = document.getElementById("web");
const renderer = new three.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(size.width, size.height);

const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;
orbit.minDistance = 3;
orbit.maxDistance = 5;

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
