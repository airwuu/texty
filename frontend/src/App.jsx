// src/App.jsx
import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('A bright sun rising over a mountain range, vector art style');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setVideoUrl('');

    try {
      const response = await fetch('http://localhost:4000/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <main className="w-full max-w-3xl flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-2">
          Gemini <span className="text-cyan-400">➡️</span> Remotion
        </h1>
        <p className="text-md sm:text-lg text-gray-400 mb-8">
          Enter a prompt describing a short animation, and let AI generate it for you.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A bouncing ball that changes color"
            rows="3"
            disabled={isLoading}
            className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white w-full focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors w-full disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating... Please Wait' : 'Generate Video'}
          </button>
        </form>

        {isLoading && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
            <p className="text-gray-400">This can take up to a minute...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg w-full">
            <p className="font-bold">An error occurred:</p>
            <p className="text-sm mt-2 font-mono">{error}</p>
          </div>
        )}

        {videoUrl && (
          <div className="w-full mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Video is Ready!</h2>
            <video
              src={videoUrl}
              controls
              autoPlay
              muted
              loop
              className="w-full rounded-lg shadow-2xl shadow-cyan-900/20 aspect-video"
            ></video>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;