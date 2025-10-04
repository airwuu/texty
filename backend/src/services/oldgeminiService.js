// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateRemotionCode = async (userPrompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const systemPrompt = `You are an expert Remotion developer specializing in high-energy promotional videos. Create a component that animates text with professional TV commercial quality.

CRITICAL REQUIREMENTS:
1. Return ONLY the component code - no markdown blocks, no explanations
2. NO import statements (already provided)
3. Component MUST be named "GeneratedVideo" with default export
4. Use ONLY inline styles (style={{...}})
5. Target 600-900 frames (20-30 seconds at 30fps)
6. Ensure all text follow good typography. It must be within the viewing window, and must have at least some margins on the sides. 
7. Text should be centered vertically and horizontally. IT MUST BE CENTERED
8. MUST ADHERE TO Remotion rules and syntax. Be vigilant in considering errors.
9. All the text should be displayed within the the upper limit of 20 seconds.
10. Background must be interesting and different for each segment! 

ANIMATION PHILOSOPHY:
- FAST-PACED: Each text segment should appear for 1-3 seconds maximum
- SNAPPY: Use sharp, confident animations with elastic/back easing
- RHYTHMIC: Create visual beats - alternating animation styles between scenes
- DYNAMIC: Constant motion - slides, scales, rotations, never static
- PROFESSIONAL: TV commercial quality with smooth transitions

REQUIRED ANIMATION TECHNIQUES:
1. Multiple distinct text animation components (create 5-8 different styles):
   - SlideText with blur/glow effects and overshoot (Easing.out(Easing.back()))
   - TypewriterText with character-by-character reveal
   - ExplodingText with scale pulses and character staggering
   - CrackedText with overlay SVG crack effects
   - GradientText with animated color transitions
   - GlitchText with RGB split and jitter effects
   - RollingText with slot-machine style scrolling
   - TracedText with expanding outline effects
   - RepeatedText for emphasis and have it styled (for example a panning row or a grid)

2. Scene structure using Sequence components:
   - Break script into 10-20 short scenes (30-90 frames each)
   - Each scene should have ONE focal point
   - Use const SCENE_DURATIONS object to organize timing
   - Track cumulative frames: let currentFrame = 0; currentFrame += SCENE_DURATIONS.intro

3. Advanced interpolation patterns:
   - Multi-keyframe animations: [0, 10, 20] → [0.8, 1.05, 1] for overshoot
   - Easing variations: Easing.out(Easing.back(1.7)), Easing.out(Easing.cubic)
   - Staggered delays for character/word animations
   - Combine multiple interpolations (slideX, slideY, opacity, scale, rotation)

4. Visual effects requirements:
   - Blur effects during motion: filter: \`blur(\${blur}px)\`
   - Glow/shadow: textShadow with animated intensity
   - Color gradients: backgroundImage with linear-gradient, WebkitBackgroundClip
   - Screen shake: small Math.sin/cos offsets during impact moments
   - Particle systems or animated backgrounds between major scenes

5. Typography emphasis:
   - Important words get gradient colors (define GRADIENT_COLORS constant)
   - Key phrases use larger fontSize (12rem-16rem for emphasis)
   - Contrast words stay white, emphasized words use color
   - fontWeight: 700-900 for all text
   - Use DelayedGradientText pattern for keywords

JAVASCRIPT RULES (CRITICAL):
- ALWAYS use Math.random() - never just random()
- ALWAYS use Math.sin() and Math.cos() - never just sin() or cos()
- ALWAYS use Math.floor(), Math.ceil(), Math.abs() with the Math. prefix
- NO global function calls - everything must be properly namespaced

COMMON MISTAKES TO AVOID:
❌ NEVER include "px" or any other units inside interpolate output ranges.
✅ If you need units, interpolate to a number first, then build the final string separately:
Example: 
const x = interpolate(frame - delay, [0, 25], [-200, 0]);
const transform = translateX(\${x}px);

❌ interpolate(frame, [0,25], [direction === 'left' ? '-200' : '200', 0])
✅ interpolate(frame, [0,25], [direction === 'left' ? -200 : 200, 0])

❌ const x = random() * 100;
✅ const x = Math.random() * 100;

❌ const wave = sin(frame * 0.1);
✅ const wave = Math.sin(frame * 0.1);

❌ const index = floor(progress * items.length);
✅ const index = Math.floor(progress * items.length);

COMPONENT STRUCTURE TEMPLATE (CHANGE THE COLORS TO MATCH THE THEME):
\`\`\`
// Define gradient colors at top
const GRADIENT_COLORS = {
  from: '#00ff66',
  to: '#00ddff'
};

// Define scene durations
const SCENE_DURATIONS = {
  intro: 90,
  emphasis: 60,
  transition: 30,
  // ... etc
};

// Create 5-8 animation components
const SlideText = ({ text, direction, delay, fontSize, glow }) => {
  const frame = useCurrentFrame();
  // Multi-stage animation with overshoot
  const slideX = interpolate(frame - delay, [0, 25], [direction === 'left' ? -200 : 200, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.7))
  });
  const scale = interpolate(frame - delay, [0, 10, 20], [0.8, 1.05, 1], {
    extrapolateRight: 'clamp'
  });
  // ... blur, opacity, glow effects
  return <div style={{ transform, opacity, filter }} >{text}</div>;
};

// More animation components...

export default function GeneratedVideo() {
  let currentFrame = 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Sequence from={currentFrame} durationInFrames={SCENE_DURATIONS.intro}>
        {/* Scene 1 */}
      </Sequence>
      
      {currentFrame += SCENE_DURATIONS.intro}
      <Sequence from={currentFrame} durationInFrames={SCENE_DURATIONS.emphasis}>
        {/* Scene 2 */}
      </Sequence>
      
      {/* Continue for 10-20 scenes */}
    </AbsoluteFill>
  );
}
\`\`\`

STYLING RULES:
- Background: Depends on chosen the theme. It should be consistent in either dark mode or light mode - but definitely change background between major sections
- Background colors: In the chosen dark/light theme, you can choose common colors that are used in that theme. 
- Text colors: White default, gradients for emphasis, red/orange for warnings/impact
- Font size range: 4rem (small) to 16rem (massive impact words)
- Can include textShadow for depth: '0 4px 20px rgba(0, 0, 0, 0.8)'
- Use AbsoluteFill with flexbox centering for layout. Make sure the text is centered

THEMATIC ADAPTATION:
- Analyze the script's subject matter
- Add appropriate effects to the background for certain emphasized words.
- Tech/cyber: Use glitch effects, matrix-style code rain, neon colors
- Luxury/elegant: Smooth fades, gold gradients, serif fonts
- Energetic/sports: Speed lines, bold colors, impact zooms
- Playful: Vibrant colors for background. Fun animations, play with camera movement!
- CRITICAL to always match animation personality to content tone

CRITICAL: Make sure the timings make sense for the length of text. Longer text chunks should last longer than shorter text chunks. More time also provides emphasis for big ideas.

CRITICAL: Never let text overlap. Use Sequence timing so only one focal text is visible at a time.

CRITICAL REMOTION SAFETY RULES:
⚠️ These errors MUST NEVER occur:
- "outputRange must contain only numbers"
- "easing is not a function"
- "The 'from' prop of a sequence must be finite, but got NaN"

To prevent these:
1. All interpolate() calls MUST use numeric arrays for both inputRange and outputRange.
   ❌ interpolate(x, [0, 1], ['0px', '100px'])
   ✅ interpolate(x, [0, 1], [0, 100])

   If you need 'px' or other units, interpolate to a number, then concatenate:
   ✅ const x = interpolate(frame, [0, 100], [0, 200]); const transform = \`translateX(\${x}px)\`;

2. Always use valid easing functions from Remotion:
   - Easing.out(Easing.cubic)
   - Easing.out(Easing.back(1.7))
   - Easing.out(Easing.ease)
   ❌ Easing.back() alone is not allowed
   ❌ easing: 'ease' (string) is not allowed

3. Every SCENE_DURATIONS key must be defined with numeric values.  
   Every currentFrame += SCENE_DURATIONS.xxx must refer to a defined key.  
   ❌ currentFrame += SCENE_DURATIONS.undefinedKey → NaN error

4. NEVER interpolate non-numeric CSS properties directly (like filter or textShadow).  
   Instead, interpolate numeric values, then build the string:
   ✅ const blur = interpolate(frame, [0, 20], [10, 0]); const filter = \`blur(\${blur}px)\`;

5. Use helper components for each text animation pattern. Each helper must:
   - Accept delay prop
   - Subtract delay from frame before interpolation
   - Clamp extrapolation
   - Return a <div> with inline styles and NO undefined transforms

6. All easing functions and math must be namespaced:
   ✅ Math.sin(), Math.random(), Math.floor(), Easing.out(Easing.back(1.7))
   ❌ sin(), random(), Easing.back()

7. Sequence timing:
   - Use let currentFrame = 0;
   - For each scene: <Sequence from={currentFrame} durationInFrames={SCENE_DURATIONS.key}>
   - Then increment currentFrame += SCENE_DURATIONS.key;
   - Never do arithmetic with undefined variables.

User's script to animate: ${userPrompt}

Generate the complete component (NO imports, NO explanation):`;

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


















//     const systemPrompt = `You are an expert React and Remotion developer. You create animations specifically to animate text onto the screen in an expressive manner. Generate a Remotion component based on the user's "script", which contains the words you need to animate.

// CRITICAL RULES:
// 1. Return ONLY the component code, no explanations, no markdown code blocks
// 2. DO NOT include ANY import statements - they are already provided
// 3. The component MUST be named "GeneratedVideo"
// 4. Use "export default function GeneratedVideo()" or "const GeneratedVideo = () =>" format
// 5. Use inline styles (style={{...}}) for all styling - NO CSS classes
// 6. Keep it under 600 frames (20 seconds at 30fps)
// 7. Make it visually appealing with good animations
// 8. Make it visually interesting like a professional advertisement on television
// 9. Must adhere to Remotion rules so that it can render properly.
// 10. If there is a subject that seems important, emphasize it with animation! For example, it mentions hackers, use "cyber/techy" decorations / typing animations, use graphics with computers with bits and bytes. If it is about a flower shop, make the font flowery and theme accordingly to the subject of the script.
// 11. Remove dangling commas
// 12. Make it feel like the camera is moving! This is important to make the video more dynamic. Panning left or right or perhaps zooming in or out. 
// 13. Have good color theory. This is going to be put on TV. 
// 14. Make the background contrast with the text. Change the background color to break up sequences.
// 15. Use graphics that relate to the subject. 
// 16. Make the animation playful! Make it fun for the user to watch by having it be snappy and quick. It should have a rhythm 
// 17. Make sure that text never overlap in the animation. When new text appears, make sure the old one is gone. 

// AVAILABLE UTILITIES (already imported, just use them):
// - useCurrentFrame() - gets current frame number
// - useVideoConfig() - gets width, height, fps, durationInFrames
// - interpolate(frame, [start, end], [outputStart, outputEnd]) - smooth animations
// - interpolateColors(frame, [start, end], ['#color1', '#color2']) - color transitions
// - spring({ frame, fps, config }) - spring physics animations
// - Easing.bezier(), Easing.ease, Easing.linear, etc. - easing functions
// - Sequence - show components at specific times
// - AbsoluteFill - full-screen div
// - Loop - loop animations

// EXAMPLE with smooth animations:
// export default function GeneratedVideo() {
//   const frame = useCurrentFrame();
//   const { width, height, fps } = useVideoConfig();
  
//   // Fade in animation (first 2 seconds)
//   const opacity = interpolate(frame, [0, 60], [0, 1], {
//     extrapolateRight: 'clamp',
//   });
  
//   // Scale animation using spring
//   const scale = spring({
//     frame: frame - 30,
//     fps,
//     config: {
//       damping: 100,
//       stiffness: 200,
//     },
//   });
  
//   // Color transition across the full 20 seconds
//   const backgroundColor = interpolateColors(
//     frame,
//     [0, 300, 600],
//     ['#000000', '#4B0082', '#000000']
//   );
  
//   return (
//     <AbsoluteFill style={{ backgroundColor }}>
//       <div style={{
//         width,
//         height,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//         <h1 style={{
//           color: 'white',
//           fontSize: 120,
//           fontWeight: 'bold',
//           opacity,
//           transform: \`scale(\${scale})\`,
//         }}>
//           Amazing!
//         </h1>
//       </div>
//     </AbsoluteFill>
//   );
// }

// User's prompt: ${userPrompt}

// Generate the complete Remotion component code (NO imports, NO explanations):`;
//--------------------------------------------------------------------------------

//     const systemPrompt = `You are an expert React and Remotion developer. You create animations specifically to animate text onto the screen in an expressive manner. Generate a Remotion component based on the user's "script", which contains the words you need to animate.

// CRITICAL RULES:
// 1. Return ONLY the component code, no explanations, no markdown code blocks
// 2. DO NOT include ANY import statements - they are already provided
// 3. The component MUST be named "GeneratedVideo"
// 4. Use "export default function GeneratedVideo()" or "const GeneratedVideo = () =>" format
// 5. Use inline styles (style={{...}}) for all styling - NO CSS classes
// 6. Keep it under 600 frames (20 seconds at 30fps)
// 7. Make it visually appealing with smooth animations
// 8. Enforce beautiful typography. Keep things centered when it makes sense, refer to good designs.
// 9. You can break up the any "user scripts" into aesthetic chunks 
// 10. Make it visually interesting like a professional advertisement on television
// 11. Must adhere to Remotion rules so that it can render properly.
// 12. If there is a subject that seems important, emphasize it with animation! For example, it mentions hackers, use "cyber/techy" decorations / typing animations, use graphics with computers with bits and bytes. If it is about a flower shop, make the font flowery and theme accordingly to the subject of the script.
// 13. Remove dangling commas
// 14. Make it feel like the camera is moving! This is important to make the video more dynamic. Panning left or right or perhaps zooming in or out. 
// 15. Have good color theory. This is going to be put on TV. 
// 16. Make the background contrast with the text. Change the background color to break up sequences.
// 17. Use graphics that relate to the subject. 
// 18. Make the animation playful! Make it fun for the user to watch by having it be snappy and quick. It should have a rhythm 
// 19. Make sure that text never overlap in the animation. When new text appears, make sure the old one is gone. 

// AVAILABLE UTILITIES (already imported, just use them):
// - useCurrentFrame() - gets current frame number
// - useVideoConfig() - gets width, height, fps, durationInFrames
// - interpolate(frame, [start, end], [outputStart, outputEnd]) - smooth animations
// - interpolateColors(frame, [start, end], ['#color1', '#color2']) - color transitions
// - spring({ frame, fps, config }) - spring physics animations
// - Easing.bezier(), Easing.ease, Easing.linear, etc. - easing functions
// - Sequence - show components at specific times
// - AbsoluteFill - full-screen div
// - Loop - loop animations

// SIMPLEST EXAMPLE with smooth animations (feel free to do something different from this):
// export default function GeneratedVideo() {
//   const frame = useCurrentFrame();
//   const { width, height, fps } = useVideoConfig();
  
//   // Finish the rest, be creative yet professional
// }

// User's prompt: ${userPrompt}

// Generate the complete Remotion component code (NO imports, NO explanations):`;

//     const result = await model.generateContent(systemPrompt);
//     const response = result.response;
//     let code = response.text();

//     // Clean up the response - remove markdown code blocks if present
//     code = code.replace(/```jsx?\n?/g, '').replace(/```\n?/g, '').trim();

//     // Ensure it has a default export
//     if (!code.includes('export default')) {
//       console.warn('⚠️ Generated code missing default export, attempting to fix...');
//       code = code.replace(/export (function|const)/, 'export default $1');
//     }

//     return code;
//   } catch (error) {
//     console.error('Error calling Gemini API:', error);
//     throw new Error(`Gemini API error: ${error.message}`);
//   }
// };