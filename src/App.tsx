import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import * as THREE from "three";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Inside initial useEffect");

    let container = document.getElementById("container");
    if (container) {
      let scene = new THREE.Scene();
      let camera = new THREE.PerspectiveCamera(
        45,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
      );

      let renderer = new THREE.WebGLRenderer();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);

      let geometry = new THREE.BoxGeometry();
      let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;

      function animate() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

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
