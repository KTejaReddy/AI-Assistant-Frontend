import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

const VoiceController = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        if (onCommand) onCommand(text);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onCommand]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("Listening...");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Helper function for TTS (Voice Output)
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Expose speak via ref or other means if needed, but for now just simple local call
  useEffect(() => {
    window.voiceAssistant_speak = speak; // Global for easy trigger from parent
  }, []);

  return (
    <div className="voice-container">
      <div 
        className={`voice-circle ${isListening ? 'active' : ''}`} 
        onClick={toggleListening}
        title={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? <Mic size={48} color="white" /> : <MicOff size={48} color="rgba(255,255,255,0.6)" />}
      </div>
      <div className="status-indicator">
        <div className={`dot ${isListening ? 'online' : 'online'}`}></div>
        <span>{isListening ? "I'm listening..." : "Tap to speak"}</span>
      </div>
      {transcript && <div className="chat-bubble">"{transcript}"</div>}
    </div>
  );
};

export default VoiceController;
