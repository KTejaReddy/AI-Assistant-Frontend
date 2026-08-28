import React, { useState, useEffect } from 'react';
import VoiceController from './components/VoiceController';
import ScreenCapture from './components/ScreenCapture';
import { analyzeScreen, getReasoning } from './services/api';

const App = () => {
  const [currentScreenDescription, setCurrentScreenDescription] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVoiceCommand = async (command) => {
    console.log("Processing Voice Command:", command);
    setIsLoading(true);

    try {
      // Step 1: Tell user I'm thinking 
      setAssistantResponse("One moment, I'm analyzing your screen...");
      // For now, let's capture the frame and analyze it
      if (window.screen_captureFrame) {
        window.screen_captureFrame(async (imageBlob) => {
          // Send to backend vision
          const { description } = await analyzeScreen(imageBlob);
          setCurrentScreenDescription(description);

          // Get reasoning response
          const { response } = await getReasoning(command, description);
          setAssistantResponse(response);

          // Voice out response
          if (window.voiceAssistant_speak) {
            window.voiceAssistant_speak(response);
          }
        });
      }
    } catch (err) {
      console.error("AI Assistant Flow Error:", err);
      setAssistantResponse("I'm sorry, I'm having trouble with the analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '0 1rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>Universal Voice Assistant</h1>
        <p style={{ color: '#a1a1aa' }}>Your real-time AI guide for screen navigation</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Dashboard with screen share */}
        <ScreenCapture onCapture={(blob) => { /* handled via global window.screen_captureFrame for now */ }} />

        {/* Right: Controller and reasoning */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem 1rem' }}>
            <VoiceController onCommand={handleVoiceCommand} />
          </div>
          
          <div className="glass-card" style={{ textAlign: 'left', minHeight: '150px' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Assistant Response
              {isLoading && <div className="dot online" style={{ width: '6px', height: '6px' }}></div>}
            </h3>
            {assistantResponse ? (
               <p style={{ color: '#e4e4e7', fontSize: '1.1rem', lineHeight: '1.6' }}>{assistantResponse}</p>
            ) : (
                <p style={{ color: '#71717a', fontStyle: 'italic' }}>Voice your question and I'll analyze the screen.</p>
            )}
          </div>
        </div>
      </div>
      
      <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#52525b', fontSize: '0.8rem' }}>
        Powered by Hugging Face & Web Speech API • Built for Accessibility
      </footer>
    </div>
  );
};

export default App;
