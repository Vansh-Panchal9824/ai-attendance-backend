const faceapi = require('face-api.js');
const canvas = require('canvas');

// Configure canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return true;
  
  try {
    console.log('📦 Loading face models...');
    
    // Load models from CDN
    const modelUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
    
    modelsLoaded = true;
    console.log('✅ Face models loaded');
    return true;
  } catch (error) {
    console.error('❌ Model load error:', error.message);
    return false;
  }
}

function base64ToImage(base64String) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const img = new canvas.Image();
  img.src = imageBuffer;
  return img;
}

async function detectFaces(imageBase64) {
  await loadModels();
  
  try {
    const img = base64ToImage(imageBase64);
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
    
    return {
      success: true,
      count: detections.length,
      faces: detections.map(d => ({
        confidence: d.score,
        box: d.box
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getFaceDescriptor(imageBase64) {
  await loadModels();
  
  try {
    const img = base64ToImage(imageBase64);
    const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detection) {
      return { success: false, error: 'No face detected' };
    }
    
    return {
      success: true,
      descriptor: Array.from(detection.descriptor),
      confidence: detection.detection.score
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  loadModels,
  detectFaces,
  getFaceDescriptor
};