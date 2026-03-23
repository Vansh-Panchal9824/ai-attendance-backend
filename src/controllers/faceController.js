const faceService = require('../services/faceRecognition');

let faceDatabase = [];

exports.loadModels = async (req, res) => {
  try {
    const success = await faceService.loadModels();
    res.json({ success, message: success ? 'Models loaded' : 'Failed to load' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.detectFaces = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'Image required' });
    }
    
    const result = await faceService.detectFaces(image);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.registerFace = async (req, res) => {
  try {
    const { image } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    
    if (!image) {
      return res.status(400).json({ success: false, error: 'Image required' });
    }
    
    const result = await faceService.getFaceDescriptor(image);
    
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    
    // Store face
    faceDatabase.push({
      userId,
      userName,
      descriptor: result.descriptor,
      confidence: result.confidence,
      registeredAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Face registered successfully',
      confidence: result.confidence,
      totalFaces: faceDatabase.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.recognizeFace = async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ success: false, error: 'Image required' });
    }
    
    const result = await faceService.getFaceDescriptor(image);
    
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    
    // Find best match
    let bestMatch = null;
    let bestDistance = Infinity;
    
    for (const face of faceDatabase) {
      let distance = 0;
      for (let i = 0; i < result.descriptor.length; i++) {
        distance += Math.pow(result.descriptor[i] - face.descriptor[i], 2);
      }
      distance = Math.sqrt(distance);
      
      if (distance < bestDistance && distance < 0.6) {
        bestDistance = distance;
        bestMatch = face;
      }
    }
    
    if (bestMatch) {
      const confidence = (1 - bestDistance) * 100;
      res.json({
        success: true,
        data: {
          userId: bestMatch.userId,
          name: bestMatch.userName,
          confidence: Math.round(confidence)
        }
      });
    } else {
      res.status(404).json({ success: false, error: 'Face not recognized' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllFaces = async (req, res) => {
  res.json({
    success: true,
    count: faceDatabase.length,
    data: faceDatabase.map(f => ({ userId: f.userId, userName: f.userName, registeredAt: f.registeredAt }))
  });
};