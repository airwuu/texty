// backend/src/controllers/videoController.js
import { generateRemotionCode } from '../services/geminiService.js';
import { renderVideo } from '../services/remotionService.js';
import { createTempFile, cleanup } from '../utils/fileManager.js';
import path from 'path';

export const generateVideo = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  let tempFilePath = null;

  try {
    console.log('📝 Generating Remotion code with Gemini...');
    
    // Step 1: Generate Remotion component code using Gemini
    const remotionCode = await generateRemotionCode(prompt);
    
    console.log('💾 Writing component to temp file...');
    
    // Step 2: Write the generated code to a temporary file
    tempFilePath = await createTempFile(remotionCode);
    
    console.log('🎬 Rendering video with Remotion...');
    
    // Step 3: Render the video using Remotion
    const videoFileName = await renderVideo(tempFilePath);
    
    // Step 4: Return the video URL
    const videoUrl = `http://localhost:${process.env.PORT || 4000}/outputs/${videoFileName}`;
    
    console.log('✅ Video generated successfully:', videoUrl);
    
    res.json({ 
      videoUrl,
      message: 'Video generated successfully' 
    });

  } catch (error) {
    console.error('❌ Error generating video:', error);
    res.status(500).json({ 
      error: 'Failed to generate video',
      message: error.message 
    });
  } finally {
    // Clean up temp file
    if (tempFilePath) {
      await cleanup(tempFilePath);
    }
  }
};