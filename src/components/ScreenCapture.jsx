import React, { useRef, useState, useEffect } from 'react';
import { Monitor, Video } from 'lucide-react';

import OverlayCanvas from './OverlayCanvas';

const ScreenCapture = ({ onCapture, highlights }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startSharing = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setStream(displayStream);
      if (videoRef.current) {
        videoRef.current.srcObject = displayStream;
      }
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const stopSharing = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (onCapture) onCapture(blob);
      }, 'image/jpeg', 0.8);
    }
  };

  // Expose captureFrame globally for the main controller to call
  useEffect(() => {
    window.screen_captureFrame = captureFrame;
  }, [onCapture]);

  return (
    <div className="screen-capture-container glass-card">
      <div className="status-indicator">
        <Monitor size={18} />
        <span style={{ fontWeight: 600 }}>Screen Sharing Dashboard</span>
      </div>
      
      <div className="screen-preview">
        {stream ? (
          <>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <OverlayCanvas highlights={highlights} />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#71717a' }}>
            <Video size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Your screen will appear here once shared</p>
            <button onClick={startSharing} style={{ backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '12px 24px' }}>Start Sharing Screen</button>
          </div>
        )}
      </div>
      
      {stream && (
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div className="status-indicator">
            <div className="dot online"></div>
            <span>Live Sharing</span>
          </div>
          <button onClick={stopSharing} style={{ background: '#ef4444' }}>Stop Sharing</button>
        </div>
      )}
    </div>
  );
};

export default ScreenCapture;
