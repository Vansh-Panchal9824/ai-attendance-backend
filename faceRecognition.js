// No TensorFlow! No OpenCV! Just face-api.js
const faceapi = require('face-api.js');
const canvas = require('canvas');

// Configure canvas for face-api
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

// Load models from CDN (no local files needed!)
async function loadModels() {
  if (modelsLoaded) return true;
  
  try {
    console.log('📦 Loading face models from CDN...');
    
    // Model URLs (load from GitHub directly)
    const modelUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
    await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
    await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
    await faceapi.nets.faceExpressionNet.loadFromUri(modelUrl);
    
    modelsLoaded = true;
    console.log('✅ Face models loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error loading models:', error.message);
    return false;
  }
}

// Convert base64 to image
function base64ToImage(base64String) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const img = new canvas.Image();
  img.src = imageBuffer;
  return img;
}

// Detect faces in image
async function detectFaces(imageBase64) {
  await loadModels();
  
  try {
    const img = base64ToImage(imageBase64);
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    
    return {
      success: true,
      count: detections.length,
      faces: detections.map(d => ({
        confidence: d.detection.score,
        box: {
          x: d.detection.box.x,
          y: d.detection.box.y,
          width: d.detection.box.width,
          height: d.detection.box.height
        },
        expressions: d.expressions
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get face descriptor (embedding) for registration
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

// Compare two face descriptors
function compareFaces(descriptor1, descriptor2, threshold = 0.6) {
  // Euclidean distance
  let distance = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    distance += Math.pow(descriptor1[i] - descriptor2[i], 2);
  }
  distance = Math.sqrt(distance);
  
  return {
    match: distance < threshold,
    distance: distance,
    confidence: (1 - Math.min(distance, 1)) * 100
  };
}

// Find best match from stored faces
function findBestMatch(currentDescriptor, storedFaces, threshold = 0.6) {
  let bestMatch = null;
  let bestDistance = Infinity;
  
  for (const face of storedFaces) {
    const distance = calculateDistance(currentDescriptor, face.descriptor);
    
    if (distance < bestDistance && distance < threshold) {
      bestDistance = distance;
      bestMatch = face;
    }
  }
  
  if (bestMatch) {
    return {
      match: true,
      userId: bestMatch.userId,
      distance: bestDistance,
      confidence: (1 - bestDistance) * 100
    };
  }
  
  return { match: false };
}

function calculateDistance(desc1, desc2) {
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  return Math.sqrt(sum);
}

module.exports = {
  loadModels,
  detectFaces,
  getFaceDescriptor,
  compareFaces,
  findBestMatch
};