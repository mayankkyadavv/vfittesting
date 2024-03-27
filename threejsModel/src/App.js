import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const App = () => {
  useEffect(() => {
    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); // Ensure high DPI rendering for clarity
    renderer.outputEncoding = THREE.sRGBEncoding; // Set the renderer to sRGB encoding for correct color space
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-js-container').appendChild(renderer.domElement);

    // Light setup
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0).normalize();
    scene.add(directionalLight);

    // GLTF model loading
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    textureLoader.encoding = THREE.sRGBEncoding; // Use this if your textures are in sRGB space

    gltfLoader.load('/Donald.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(3, 3, 3);
      model.position.y = -2;
      
      // Apply the textures to the model
      model.traverse((child) => {
        if (child.isMesh) {
          let material = child.material;
          // Update material properties to support textures if not already in the correct format
          if (!material.isMeshStandardMaterial) {
            material = new THREE.MeshStandardMaterial();
            child.material = material;
          }
          
          const loadTexture = (path) => {
            const texture = textureLoader.load(path);
            texture.flipY = false;
            texture.encoding = THREE.sRGBEncoding; // Ensure the texture uses sRGB encoding
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Improve texture clarity at glancing angles
            return texture;
          };
          
          // Apply body textures
          if (child.name === 'HG_Body001') {
            material.map = loadTexture('/Donald.001_body_base_color.002.png');
            material.normalMap = loadTexture('/Donald.001_body_normal.002.png');
            material.roughnessMap = loadTexture('/Donald.001_body_roughness.002.png');
            // Note: MeshStandardMaterial does not use a specular map; metalnessMap might be what you need if the texture represents metalness
          }
          
          // Apply eye textures
          if (child.name === 'HG_Eyes001') {
            material.map = loadTexture('/Donald.001_eyes_base_color.002.png');
          }
          
          // Apply teeth textures
          if (child.name === 'HG_TeethLower001') {
            material.map = loadTexture('/Donald.001_lower_teeth_base_color.002.png');
            material.normalMap = loadTexture('/Donald.001_lower_teeth_normal.002.png');
            material.roughnessMap = loadTexture('/Donald.001_lower_teeth_roughness.002.png');
          }
          if (child.name === 'HG_TeethUpper001') {
            material.map = loadTexture('/Donald.001_upper_teeth_base_color.002.png');
            material.normalMap = loadTexture('/Donald.001_upper_teeth_normal.002.png');
            material.roughnessMap = loadTexture('/Donald.001_upper_teeth_roughness.002.png');
          }
          
          // Mark material for update
          material.needsUpdate = true;
        }
      });
      
      scene.add(model);
    });

    camera.position.z = 5;

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      renderer.domElement && renderer.domElement.remove();
      // Add any additional cleanup here
    };
  }, []);

  return <div id='three-js-container' />;
};

export default App;
