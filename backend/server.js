// backend/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { renderMedia } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

// Configuration
const app = express();
const port = 4000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const remotionProject = path.resolve('remotion-assets');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/videos', express.static('output'));

// API Endpoint
app.post('/api/generate-video', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).send('Prompt is required.');
    }
    console.log(`Received prompt: ${prompt}`);

    try {
        // 1. Ask Gemini to generate a JSON object based on the prompt
        console.log('Generating JSON props with Gemini...');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const geminiPrompt = `
            You are a creative assistant. Based on the user's prompt, generate a JSON object to customize a video template.
            The JSON object must have three keys: "title" (string), "subtitle" (string), and "backgroundColor" (a hex color string).
            - The title should be a short, impactful headline inspired by the prompt.
            - The subtitle should be a smaller, supporting line of text.
            - The backgroundColor should be a color that fits the mood of the prompt.
            - Your response must be ONLY the raw JSON object, enclosed in a single \`\`\`json code block. Do not add any other text.

            User Prompt: "${prompt}"

            Example of a valid output format:
            \`\`\`json
            {
              "title": "Sunrise Peak",
              "subtitle": "A new day begins",
              "backgroundColor": "#111827"
            }
            \`\`\`
        `;
        const result = await model.generateContent(geminiPrompt);
        const response = await result.response;
        
        // Clean up and parse the JSON from the markdown block
        let jsonString = response.text().replace(/^```json\n|```$/g, '');
        const inputProps = JSON.parse(jsonString);
        console.log('Gemini JSON generated successfully:', inputProps);

        // 2. Render the video using Remotion, passing the JSON as inputProps
        const compositionId = 'MyComposition';
        const outputLocation = path.resolve(`output/${Date.now()}.mp4`);
        console.log(`Starting Remotion render for composition: ${compositionId}`);

        await renderMedia({
            entryPoint: path.join(remotionProject, 'src/index.ts'),
            compositionId: compositionId,
            outputLocation: outputLocation,
            codec: 'h264',
            inputProps: inputProps, // <-- Pass the AI-generated data here!
        });

        console.log(`Render finished! Video available at: ${outputLocation}`);
        
        // 3. Return the URL to the video
        const videoUrl = `http://localhost:${port}/videos/${path.basename(outputLocation)}`;
        res.json({ videoUrl });

    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Failed to generate video.');
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
    }
});