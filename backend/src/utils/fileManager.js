// backend/src/utils/fileManager.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createTempFile = async (code) => {
  const tempDir = path.join(__dirname, '../../temp');
  const tempFileName = `temp-${Date.now()}.jsx`;
  const tempFilePath = path.join(tempDir, tempFileName);

  // Ensure temp directory exists
  await fs.mkdir(tempDir, { recursive: true });

  // Remove any import statements from the generated code
  let cleanedCode = code.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
  
  // Remove export default
  cleanedCode = cleanedCode.replace(/export\s+default\s+/g, '');

  // Extract the component name from the cleaned code
  let componentName = 'GeneratedVideo';
  const functionMatch = cleanedCode.match(/function\s+(\w+)/);
  const constMatch = cleanedCode.match(/const\s+(\w+)\s*=/);
  
  if (functionMatch) {
    componentName = functionMatch[1];
  } else if (constMatch) {
    componentName = constMatch[1];
  }

  // Create wrapper with ALL common Remotion utilities pre-imported
  const wrappedCode = `
import React from 'react';
import { 
  Composition, 
  registerRoot,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
  interpolateColors,
  Sequence,
  AbsoluteFill,
  continueRender,
  delayRender,
  Loop,
  staticFile,
  Audio,
  Img,
  Video
} from 'remotion';

${cleanedCode}

const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={${componentName}}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
`;

  // Write the file
  await fs.writeFile(tempFilePath, wrappedCode, 'utf-8');
  
  return tempFilePath;
};

export const cleanup = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log('🧹 Cleaned up temp file:', path.basename(filePath));
  } catch (error) {
    console.warn('Warning: Could not clean up temp file:', error.message);
  }
};