import { useEffect } from "react";
import "./App.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Position } from "./types/types";

function App() {
  const example = [
    0, 0, 0, 0.052263822, -0.07623646, 0.044388004, -0.015808329, -0.095382094,
    -0.051630158, 0.026240252, 0.124979004, -0.025711458, -0.098289825,
    -0.36468232, 0.25756365, -0.11549425, -0.45960355, 0.029093985,
    -0.009644538, 0.26077837, -0.03221213, -0.041933697, -0.7394882,
    0.057099044, 0.22752753, -0.7048882, 0.042031743, -0.023758736, 0.31442857,
    -0.040892854, -0.13726437, -0.8338314, 0.10427542, 0.20097929, -0.8224304,
    0.12883106, -0.056271352, 0.52032983, -0.09224035, -0.003149565, 0.44302705,
    -0.0017520282, -0.07198058, 0.40798986, -0.13583656, -0.11767886, 0.6023895,
    -0.08526803, 0.06770038, 0.47924, 0.104006305, -0.16351396, 0.41339663,
    -0.21756819, 0.14833608, 0.2598487, 0.21045426, -0.27088076, 0.17459676,
    -0.23481722, 0.15738128, 0.02105102, 0.32754767, -0.41465446, -0.05276251,
    -0.22304034, 0.1659068, -0.06475556, 0.34843087, -0.45079556, -0.13485262,
    -0.21999559,
  ];

  function extractPoints(data: number[]) {
    if (data.length % 3 !== 0) {
      throw new Error("Invalid data length");
    }

    const points = [];
    for (let i = 0; i < data.length; i += 3) {
      const point: Position = { x: data[i], y: data[i + 1], z: data[i + 2] };
      points.push(point);
    }
    return points;
  }

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

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === container) {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
          }
        }
      });
      resizeObserver.observe(container);

      const points = extractPoints(example);

      points.forEach((point) => {
        const geometry = new THREE.SphereGeometry(0.03, 20, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(point.x, point.y, point.z);
        scene.add(mesh);
      });

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
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
