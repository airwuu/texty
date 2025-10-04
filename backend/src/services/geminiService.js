// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateRemotionCode = async (userPrompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const systemPrompt = `You are an expert Remotion developer specializing in high-energy promotional videos. Create a component that animates text with professional TV commercial quality.

CRITICAL REQUIREMENTS:
1. Return ONLY the component code - no markdown blocks, no explanations
2. NO import statements (already provided)
3. Component MUST be named "GeneratedVideo" with default export
4. Use ONLY inline styles (style={{...}})
5. Target 600-900 frames (20-30 seconds at 30fps)
6. All text must be within viewing window with margins on all sides
7. Text MUST be centered vertically and horizontally using flexbox
8. STRICT adherence to Remotion syntax - no undefined variables or NaN errors
9. Display all text within 20-30 second timeframe
10. Background must change between major sections for visual variety

ANIMATION PHILOSOPHY:
- FAST-PACED: Each text segment 1-3 seconds maximum (30-90 frames)
- SNAPPY: Sharp animations with elastic/back easing for overshoot
- RHYTHMIC: Alternate animation styles - create visual beats
- DYNAMIC: Constant motion - slides, scales, rotations, never static
- PROFESSIONAL: TV commercial quality with smooth transitions
- THEMATIC: Match effects to content subject matter

JAVASCRIPT RULES (CRITICAL - MEMORIZE THESE):
- ALWAYS use Math.random() - never just random()
- ALWAYS use Math.sin() and Math.cos() - never just sin() or cos()
- ALWAYS use Math.floor(), Math.ceil(), Math.abs() with Math. prefix
- NO global function calls - everything must be properly namespaced

COMMON MISTAKES TO AVOID:
❌ NEVER include "px" or units inside interpolate output ranges
✅ Interpolate to number first, then build string:
   const x = interpolate(frame, [0, 25], [-200, 0]);
   const transform = \`translateX(\${x}px)\`;

❌ interpolate(frame, [0, 25], ['-200px', '0px']) // WRONG
✅ interpolate(frame, [0, 25], [-200, 0]) // CORRECT

❌ const x = random() * 100;
✅ const x = Math.random() * 100;

❌ easing: Easing.back(1.7) // Missing outer wrapper
✅ easing: Easing.out(Easing.back(1.7))

❌ currentFrame += SCENE_DURATIONS.typo; // undefined key = NaN
✅ Verify every SCENE_DURATIONS key exists before using

❌ Missing extrapolateRight/Left causes values to exceed bounds
✅ Always include: { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }

REMOTION BEST PRACTICES:
- Use spring() for natural physics-based animations when appropriate
- Prefer Sequence over manual frame calculations for scene timing
- Use transform instead of top/left for better performance
- Avoid expensive calculations on every frame - define constants outside render
- Use useVideoConfig() to get width, height, fps for responsive layouts
- Remember: fps defaults to 30, plan timing accordingly

REQUIRED ANIMATION COMPONENTS (Create 6-10 variations):

1. SlideText - Text slides in with overshoot, blur, and optional glow:
\`\`\`
const SlideText = ({ text, direction = 'left', delay = 0, fontSize = '6rem', glow = false }) => {
  const frame = useCurrentFrame();
  const slideX = interpolate(frame - delay, [0, 25], [direction === 'left' ? -200 : 200, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.7))
  });
  const scale = interpolate(frame - delay, [0, 10, 20], [0.8, 1.05, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.3))
  });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const blur = interpolate(frame - delay, [0, 20], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const glowIntensity = glow ? 20 + Math.sin(frame * 0.1) * 10 : 0;
  
  return (
    <div style={{
      fontSize,
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      fontWeight: 700,
      textAlign: 'center',
      transform: \`translateX(\${slideX}px) scale(\${scale})\`,
      opacity,
      filter: \`blur(\${blur}px)\`,
      textShadow: glow ? \`0 0 \${glowIntensity}px white\` : '0 4px 20px rgba(0, 0, 0, 0.8)'
    }}>
      {text}
    </div>
  );
};
\`\`\`

2. TypewriterText - Character-by-character reveal with blinking cursor:
\`\`\`
const TypewriterText = ({ text, delay = 0, duration = 60, fontSize = '6rem' }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear
  });
  const charsToShow = Math.floor(progress * text.length);
  
  return (
    <div style={{ fontSize, color: 'white', fontWeight: 700, textAlign: 'center' }}>
      {text.substring(0, charsToShow)}
      {charsToShow < text.length && frame > delay && (
        <span style={{ opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0 }}>|</span>
      )}
    </div>
  );
};
\`\`\`

3. ExplodingText - Text explodes with character staggering and wobble:
\`\`\`
const ExplodingText = ({ text, fontSize = '12rem' }) => {
  const frame = useCurrentFrame();
  const mainScale = interpolate(frame, [0, 10, 20], [0.5, 1.1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(2))
  });
  
  return (
    <div style={{
      fontSize,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 900,
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center'
    }}>
      {text.split('').map((char, i) => {
        const charWobble = Math.sin(frame * 0.3 + i) * 3;
        const charFlicker = Math.sin((frame + i * 7) * 0.6) > 0.2 ? 1 : 0.7;
        return (
          <span key={i} style={{
            display: 'inline-block',
            transform: \`scale(\${mainScale}) translateY(\${charWobble}px)\`,
            color: '#ff0000',
            opacity: charFlicker,
            textShadow: '0 0 30px rgba(255, 0, 0, 0.8)'
          }}>
            {char}
          </span>
        );
      })}
    </div>
  );
};
\`\`\`

4. GradientText - Delayed gradient color transition with sparkle:
\`\`\`
const GradientText = ({ text, fromColor = '#00ff66', toColor = '#00ddff', delay = 0, fontSize = '6rem' }) => {
  const frame = useCurrentFrame();
  const gradientProgress = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  const isGradient = gradientProgress > 0.3;
  const sparkle = Math.sin(frame * 0.1) * 3;
  
  return (
    <span style={{
      fontSize,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 800,
      color: isGradient ? 'transparent' : 'white',
      backgroundImage: isGradient ? \`linear-gradient(\${45 + sparkle}deg, \${fromColor}, \${toColor})\` : 'none',
      WebkitBackgroundClip: isGradient ? 'text' : undefined,
      WebkitTextFillColor: isGradient ? 'transparent' : undefined,
      display: 'inline-block',
      filter: isGradient ? \`drop-shadow(0 0 8px \${fromColor}99)\` : 'none'
    }}>
      {text}
    </span>
  );
};
\`\`\`

5. RollingText - Slot machine style character scrolling:
\`\`\`
const RollingText = ({ text, delay = 0, fontSize = '6rem' }) => {
  const frame = useCurrentFrame();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  return (
    <div style={{
      fontSize,
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      fontWeight: 800,
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center'
    }}>
      {text.split('').map((char, i) => {
        const scrollProgress = interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.quad)
        });
        const scrollSpeed = interpolate(scrollProgress, [0, 0.6, 0.9, 1], [20, 8, 2, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });
        const charOffset = Math.floor((frame - delay) * scrollSpeed);
        const displayChar = scrollProgress < 0.95 && frame > delay ?
          alphabet[(charOffset + i * 3) % alphabet.length] : char;
        const blur = interpolate(scrollProgress, [0, 0.7, 1], [1.5, 0.3, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });
        
        return (
          <span key={i} style={{
            display: 'inline-block',
            filter: \`blur(\${blur}px)\`
          }}>
            {displayChar}
          </span>
        );
      })}
    </div>
  );
};
\`\`\`

6. GlitchText - RGB split with jitter effect:
\`\`\`
const GlitchText = ({ text, fontSize = '7rem' }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  
  return (
    <div style={{
      fontSize,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 700,
      textAlign: 'center',
      color: 'white',
      display: 'flex',
      gap: '0.4em',
      justifyContent: 'center'
    }}>
      {words.map((word, i) => {
        const wordDelay = i * 6;
        const slideX = interpolate(frame - wordDelay, [0, 8], [-50, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic)
        });
        const glitchPhase = frame > 25;
        const glitchX = glitchPhase ? Math.sin(frame * 0.5 + i) * 2 : 0;
        const glitchY = glitchPhase ? Math.cos(frame * 0.7 + i) * 1.5 : 0;
        
        return (
          <span key={i} style={{
            display: 'inline-block',
            transform: \`translateX(\${slideX + glitchX}px) translateY(\${glitchY}px)\`,
            textShadow: glitchPhase ? '2px 2px 0 #ff00ff, -2px -2px 0 #00ffff' : 'none'
          }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};
\`\`\`

7. AnimatedUnderline - Text with expanding underline:
\`\`\`
const AnimatedUnderline = ({ text, delay = 0, fontSize = '6rem' }) => {
  const frame = useCurrentFrame();
  const underlineWidth = interpolate(frame - delay, [0, 45], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });
  
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ fontSize, fontFamily: 'Arial, sans-serif', color: 'white', fontWeight: 700 }}>
        {text}
      </span>
      <div style={{
        position: 'absolute',
        bottom: '0px',
        left: '0px',
        width: \`\${underlineWidth}%\`,
        height: '6px',
        backgroundColor: 'white',
        borderRadius: '3px'
      }} />
    </span>
  );
};
\`\`\`

8. ParallaxRepeated - Grid of repeated text for emphasis:
\`\`\`
const ParallaxRepeated = ({ text, fontSize = '6rem' }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rows = 5;
  const cols = 4;
  
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const index = row * cols + col;
          const delay = (row + col) * 2;
          const scale = interpolate(frame - delay, [0, 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const opacity = interpolate(frame - delay, [0, 10, 35, 45], [0, 0.2, 0.2, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          
          return (
            <div key={\`bg-\${index}\`} style={{
              position: 'absolute',
              left: \`\${col * (width / cols)}px\`,
              top: \`\${row * (height / rows)}px\`,
              width: \`\${width / cols}px\`,
              height: \`\${height / rows}px\`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 900,
                color: '#00ff66',
                opacity,
                transform: \`scale(\${scale})\`,
                filter: 'blur(2px)'
              }}>
                {text}
              </div>
            </div>
          );
        })
      )}
      
      {/* Center focus text */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          fontSize: '16rem',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 900,
          color: '#00ff99',
          opacity: interpolate(frame, [20, 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          }),
          textShadow: '0 0 50px rgba(0, 255, 127, 0.9)'
        }}>
          {text}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
\`\`\`

ANIMATED BACKGROUNDS (Use between scenes for variety):

\`\`\`
const AnimatedBackground = ({ variant = 'particles' }) => {
  const frame = useCurrentFrame();
  
  if (variant === 'particles') {
    return (
      <AbsoluteFill style={{ opacity: 0.3 }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            backgroundColor: '#00ff66',
            borderRadius: '50%',
            left: \`\${(i * 5) % 100}%\`,
            top: \`\${(i * 7) % 100}%\`,
            transform: \`translateY(\${Math.sin(frame * 0.02 + i) * 50}px) translateX(\${Math.cos(frame * 0.02 + i) * 30}px)\`,
            opacity: 0.5 + Math.sin(frame * 0.05 + i) * 0.5
          }} />
        ))}
      </AbsoluteFill>
    );
  }
  
  if (variant === 'waves') {
    return (
      <AbsoluteFill style={{ opacity: 0.2 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '200%',
            height: '100px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.3), transparent)',
            top: \`\${i * 20}%\`,
            left: '-100%',
            transform: \`translateX(\${(frame * 3 + i * 100) % 200}%)\`
          }} />
        ))}
      </AbsoluteFill>
    );
  }
  
  // Default gradient
  return (
    <AbsoluteFill style={{
      background: \`radial-gradient(circle at \${50 + Math.sin(frame * 0.02) * 30}% \${50 + Math.cos(frame * 0.02) * 30}%, rgba(0, 255, 127, 0.1) 0%, transparent 70%)\`
    }} />
  );
};
\`\`\`

COMPONENT STRUCTURE TEMPLATE:

\`\`\`
// Define colors at top (adapt to theme)
const GRADIENT_COLORS = {
  from: '#00ff66',
  to: '#00ddff'
};

// Define ALL scene durations upfront
const SCENE_DURATIONS = {
  intro: 90,      // 3 seconds
  emphasis: 60,   // 2 seconds
  transition: 45, // 1.5 seconds
  outro: 75       // 2.5 seconds
  // ... define ALL keys before using
};

// Create 6-10 animation component functions here
// (SlideText, TypewriterText, etc.)

// Create AnimatedBackground component here

export default function GeneratedVideo() {
  const { width, height } = useVideoConfig();
  let currentFrame = 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Scene 1 */}
      <Sequence from={currentFrame} durationInFrames={SCENE_DURATIONS.intro}>
        <AnimatedBackground variant="particles" />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TypewriterText text="Opening message" duration={50} fontSize="5rem" />
        </AbsoluteFill>
      </Sequence>
      
      {currentFrame += SCENE_DURATIONS.intro}
      <Sequence from={currentFrame} durationInFrames={SCENE_DURATIONS.emphasis}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
          <SlideText text="Key Point" fontSize="8rem" direction="left" glow={true} />
        </AbsoluteFill>
      </Sequence>
      
      {currentFrame += SCENE_DURATIONS.emphasis}
      <Sequence from={currentFrame} durationInFrames={SCENE_DURATIONS.transition}>
        <AnimatedBackground variant="waves" />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <GradientText 
            text="Highlighted Word" 
            fromColor={GRADIENT_COLORS.from} 
            toColor={GRADIENT_COLORS.to}
            delay={10}
            fontSize="7rem"
          />
        </AbsoluteFill>
      </Sequence>
      
      {/* Continue for 10-20 scenes total */}
    </AbsoluteFill>
  );
}
\`\`\`

STYLING RULES:
- Background: Black (#000) or dark theme (#0a0a0a, #1a1a1a) OR light theme (#f5f5f5, #ffffff)
- Change background color/style between major sections for visual breaks
- Text colors: White default, gradients for emphasis (#00ff66 to #00ddff), red/orange for warnings (#ff0000, #ff6600)
- Font size range: 4rem (small) to 16rem (massive impact)
- Always center content: { justifyContent: 'center', alignItems: 'center' }
- Use textShadow for depth: '0 4px 20px rgba(0, 0, 0, 0.8)'

THEMATIC ADAPTATION:
Analyze script subject and apply appropriate effects:
- Tech/Cyber: Glitch effects, matrix rain, neon colors (#00ff00, #00ffff), monospace fonts
- Luxury/Elegant: Smooth fades, gold gradients (#ffd700, #ffed4e), serif fonts
- Energetic/Sports: Bold colors (#ff0000, #00ff00), speed lines, impact zooms
- Playful/Fun: Vibrant colors, bouncy animations, rotation effects
- Corporate/Professional: Blues (#0066cc, #00aaff), clean transitions, minimal effects

CRITICAL TIMING RULES:
- Longer text = longer duration (5+ words = 90 frames, 2-3 words = 45 frames)
- Key messages get more time for emphasis
- Never let text overlap - use Sequence timing carefully
- Verify: sum of all SCENE_DURATIONS ≤ 900 frames (30 seconds)

User's script to animate: ${userPrompt}

Generate the complete component code (NO imports, NO explanations, ONLY code):`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    let code = response.text();

    // Clean up markdown blocks
    code = code.replace(/```jsx?\n?/g, '').replace(/```\n?/g, '').trim();

    // Fix common Math function mistakes
    code = code.replace(/\brandom\(/g, 'Math.random(');
    code = code.replace(/\bsin\(/g, 'Math.sin(');
    code = code.replace(/\bcos\(/g, 'Math.cos(');
    code = code.replace(/\btan\(/g, 'Math.tan(');
    code = code.replace(/\bfloor\(/g, 'Math.floor(');
    code = code.replace(/\bceil\(/g, 'Math.ceil(');
    code = code.replace(/\bround\(/g, 'Math.round(');
    code = code.replace(/\babs\(/g, 'Math.abs(');
    code = code.replace(/\bmax\(/g, 'Math.max(');
    code = code.replace(/\bmin\(/g, 'Math.min(');
    code = code.replace(/\bsqrt\(/g, 'Math.sqrt(');
    code = code.replace(/\bpow\(/g, 'Math.pow(');

    // Fix incomplete easing wrappers
    code = code.replace(/easing:\s*Easing\.back\(/g, 'easing: Easing.out(Easing.back(');
    code = code.replace(/easing:\s*Easing\.elastic\(/g, 'easing: Easing.out(Easing.elastic(');

    // Ensure default export
    if (!code.includes('export default')) {
      console.warn('⚠️ Generated code missing default export, attempting to fix...');
      code = code.replace(/export (function|const)/, 'export default $1');
    }

    // Log for debugging
    console.log('✅ Code generation successful');
    console.log('📏 Generated code length:', code.length);

    return code;
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
};