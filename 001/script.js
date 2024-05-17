
import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControls.js';

window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('#webgl');
  const app = new ThreeApp(wrapper);
  app.render();
}, false);

class ThreeApp {
  static CAMERA_PARAM = {
    fovy: 60,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,

    // 描画する空間のファークリップ面（最遠面）@@@
    far: 50.0,

    // カメラの座標 @@@
    position: new THREE.Vector3(0.0, 10.0, 20.0),

    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };

  static RENDERER_PARAM = {
    clearColor: 0x000000,       // 画面をクリアする色 @@@
    width: window.innerWidth,
    height: window.innerHeight,
  };

  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.0,
    position: new THREE.Vector3(1.0, 1.0, 1.0),
  };

  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 0.5,  // 光の強度 @@@
  };

  constructor(wrapper) {
    const color = new THREE.Color(ThreeApp.RENDERER_PARAM.clearColor);

    // ギザギザを滑らかに @@@
    this.renderer = new THREE.WebGLRenderer({antialias: true});

    this.renderer.setClearColor(color);
    this.renderer.setSize(ThreeApp.RENDERER_PARAM.width, ThreeApp.RENDERER_PARAM.height);
    wrapper.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      ThreeApp.CAMERA_PARAM.fovy,
      ThreeApp.CAMERA_PARAM.aspect,
      ThreeApp.CAMERA_PARAM.near,
      ThreeApp.CAMERA_PARAM.far,
    );
    this.camera.position.copy(ThreeApp.CAMERA_PARAM.position);
    this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt);

    this.directionalLight = new THREE.DirectionalLight(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.color,
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.copy(ThreeApp.DIRECTIONAL_LIGHT_PARAM.position);
    this.scene.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(
      ThreeApp.AMBIENT_LIGHT_PARAM.color,
      ThreeApp.AMBIENT_LIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);

    this.material = new THREE.MeshPhongMaterial(ThreeApp.MATERIAL_PARAM);

    // 表示するcubeを設定 @@@
    const cubeCount = 150;
    const transformScale = 10.0;
    this.geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5, 1.0);
    this.cubeArray = [];
    for (let i = 0; i < cubeCount; ++i) {
      // 各ボックスに異なる色を設定し、カラーグラデーションを追加 @@@
      const color = new THREE.Color(Math.random(), Math.random(), Math.random());
      const material = new THREE.MeshPhongMaterial({ color: color });
      // ボックスのサイズをランダムに設定 @@@
      const size = Math.random() * 0.5 + 0.1;
      const geometry = new THREE.BoxGeometry(size, size, size);

      const cube = new THREE.Mesh(geometry, material);

      cube.position.x = (Math.random() * 2.0 - 1.0) * transformScale;
      cube.position.y = (Math.random() * 2.0 - 1.0) * transformScale;
      cube.position.z = (Math.random() * 2.0 - 1.0) * transformScale;
      
      this.scene.add(cube);
      this.cubeArray.push(cube);
    }

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.render = this.render.bind(this);

    this.isDown = false;

    window.addEventListener('keydown', (keyEvent) => {
      switch (keyEvent.key) {
        case ' ':
          this.isDown = true;
          break;
        default:
      }
    }, false);
    window.addEventListener('keyup', (keyEvent) => {
      this.isDown = false;
    }, false);

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);
  }

  render() {
    requestAnimationFrame(this.render);

    this.controls.update();

    if (this.isDown === true) {
      this.cubeArray.forEach((cube) => {
        cube.rotation.y += 0.05;
      });
    }

    // カメラのアニメーション @@@
    this.camera.position.x = 20 * Math.sin(Date.now() * 0.0005);
    this.camera.position.z = 20 * Math.cos(Date.now() * 0.0005);
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

