// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateRemotionCode = async (userPrompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are an expert React and Remotion developer. You create animations specifically to animate text onto the screen in an expressive manner. Generate a Remotion component based on the user's "script", which contains the words you need to animate.

CRITICAL RULES:
1. Return ONLY the component code, no explanations, no markdown code blocks
2. DO NOT include ANY import statements - they are already provided
3. The component MUST be named "GeneratedVideo"
4. Use "export default function GeneratedVideo()" or "const GeneratedVideo = () =>" format
5. Use inline styles (style={{...}}) for all styling - NO CSS classes
6. Keep it under 600 frames (20 seconds at 30fps)
7. Make it visually appealing with smooth animations
8. Enforce beautiful typography. Keep things centered when it makes sense, refer to good designs.
9. You can break up the any "user scripts" into aesthetic chunks 
10. Make it visually interesting like a professional advertisement on television
11. Must adhere to Remotion rules so that it can render properly.

AVAILABLE UTILITIES (already imported, just use them):
- useCurrentFrame() - gets current frame number
- useVideoConfig() - gets width, height, fps, durationInFrames
- interpolate(frame, [start, end], [outputStart, outputEnd]) - smooth animations
- interpolateColors(frame, [start, end], ['#color1', '#color2']) - color transitions
- spring({ frame, fps, config }) - spring physics animations
- Easing.bezier(), Easing.ease, Easing.linear, etc. - easing functions
- Sequence - show components at specific times
- AbsoluteFill - full-screen div
- Loop - loop animations

EXAMPLE with smooth animations:
export default function GeneratedVideo() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  
  // Fade in animation (first 2 seconds)
  const opacity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
  });
  
  // Scale animation using spring
  const scale = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });
  
  // Color transition across the full 20 seconds
  const backgroundColor = interpolateColors(
    frame,
    [0, 300, 600],
    ['#000000', '#4B0082', '#000000']
  );
  
  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <div style={{
        width,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 120,
          fontWeight: 'bold',
          opacity,
          transform: \`scale(\${scale})\`,
        }}>
          Amazing!
        </h1>
      </div>
    </AbsoluteFill>
  );
}

User's prompt: ${userPrompt}

Generate the complete Remotion component code (NO imports, NO explanations):`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    let code = response.text();

    // Clean up the response - remove markdown code blocks if present
    code = code.replace(/```jsx?\n?/g, '').replace(/```\n?/g, '').trim();

    // Ensure it has a default export
    if (!code.includes('export default')) {
      console.warn('⚠️ Generated code missing default export, attempting to fix...');
      code = code.replace(/export (function|const)/, 'export default $1');
    }

    return code;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
};