import { useEffect } from "react";
import "./App.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import data from "./data/dance_data_20_corrected.json";
import { timer } from "./utils/timer";

function App() {
  const lineIndexes = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
    [2, 5],
    [3, 6],
    [4, 7],
    [5, 8],
    [6, 9],
    [7, 10],
    [8, 11],
    [9, 12],
    [9, 13],
    [9, 14],
    [12, 15],
    [13, 16],
    [14, 17],
    [16, 18],
    [17, 19],
    [18, 20],
    [19, 21],
    [20, 22],
    [21, 23],
  ];

  function extractPoints(data: number[]) {
    if (data.length % 3 !== 0) {
      throw new Error("Invalid data length");
    }

    const points = [];
    for (let i = 0; i < data.length; i += 3) {
      const point = new THREE.Vector3(data[i], data[i + 1], data[i + 2]);
      points.push(point);
    }
    return points;
  }

  useEffect(() => {
    console.log("Inside initial useEffect");

    // interface Data {
    //   result: number[][];
    //   quant: any;
    // }

    // const { result }: Data = data;
    const result = data;

    console.log(result);

    const pointMeshes: THREE.Mesh[] = [];
    const lineMeshes: THREE.Mesh[] = [];

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

      const axesHelper = new THREE.AxesHelper(2.5);
      scene.add(axesHelper);

      const gridXZ = new THREE.GridHelper(4, 4);
      gridXZ.position.set(0, 0, 0);
      scene.add(gridXZ);

      const gridXY = new THREE.GridHelper(4, 4);
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

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }

      animate();

      // Initialise meshes
      let points: THREE.Vector3[] = [];
      const pointsTemp = extractPoints(result[0]);
      points = pointsTemp;
      points.forEach((point) => {
        const geometry = new THREE.SphereGeometry(0.03, 20, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(point.x, point.y, point.z);
        scene.add(mesh);
        pointMeshes.push(mesh);
      });

      lineIndexes.forEach((lineIndex) => {
        const start = points[lineIndex[0]];
        const end = points[lineIndex[1]];
        const path = new THREE.LineCurve3(start, end);
        const geometry = new THREE.TubeGeometry(path, 60, 0.015, 8, false);
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const line = new THREE.Mesh(geometry, material);
        scene.add(line);
        lineMeshes.push(line);
      });

      // Update meshes
      const period = 1000 / 60;
      async function updateMeshes() {
        for (let i = 1; i < result.length; i++) {
          const current = result[i];
          const points2 = extractPoints(current);
          points = points2;

          for (let j = 0; j < pointMeshes.length; j++) {
            const point = points2[j];
            const pointMesh = pointMeshes[j];
            pointMesh.position.set(point.x, point.y, point.z);
          }

          for (let j = 0; j < lineIndexes.length; j++) {
            const lineIndex = lineIndexes[j];
            const start = points[lineIndex[0]];
            const end = points[lineIndex[1]];
            const line = lineMeshes[j];
            const path = new THREE.LineCurve3(start, end);
            const geometry = new THREE.TubeGeometry(path, 60, 0.015, 8, false);
            line.geometry.dispose();
            line.geometry = geometry;
          }

          await timer(period);
        }
      }

      updateMeshes();
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
