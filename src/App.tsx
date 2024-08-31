import { useEffect } from "react";
import "./App.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function App() {
  useEffect(() => {
    console.log("Inside initial useEffect");

    const container = document.getElementById("container");
    if (container) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
      );
      camera.position.set(4, 4, 4);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);

      const axesHelper = new THREE.AxesHelper(30);
      scene.add(axesHelper);

      const gridXZ = new THREE.GridHelper(30, 30);
      gridXZ.position.set(0, 0, 0);
      scene.add(gridXZ);

      const gridXY = new THREE.GridHelper(30, 30);
      gridXY.position.set(0, 0, 0);
      gridXY.rotation.x = Math.PI / 2;
      scene.add(gridXY);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.update();

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      function animate() {
        requestAnimationFrame(animate);

        controls.update();
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      }

      animate();
    }
  }, []);

  return (
    <>
      <h1>SMPL Viewer</h1>
      <div id="container" />
    </>
  );
}

export default App;
