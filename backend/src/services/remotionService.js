// backend/src/services/remotionService.js
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderVideo = async (componentPath) => {
  const outputDir = path.join(__dirname, '../../outputs');
  const videoFileName = `video-${Date.now()}.mp4`;
  const outputPath = path.join(outputDir, videoFileName);

  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    console.log('📦 Bundling Remotion component...');
    
    // Bundle the component
    const bundleLocation = await bundle({
      entryPoint: componentPath,
      webpackOverride: (config) => config,
    });

    console.log('🔍 Getting composition...');
    
    // Get the composition
    const compositions = await selectComposition({
      serveUrl: bundleLocation,
      id: 'MyVideo', // Default composition ID
    });

    console.log('🎥 Rendering video...');
    
    // Render the video
    await renderMedia({
      composition: compositions,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {},
    });

    console.log('✨ Video rendered successfully!');
    
    return videoFileName;
  } catch (error) {
    console.error('Error rendering video:', error);
    throw new Error(`Remotion rendering error: ${error.message}`);
  }
};