import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  Mic, 
  MicOff,
  Droplet, 
  HeartPulse, 
  ShieldAlert, 
  TriangleAlert, 
  Waves, 
  Flame,
  MousePointer2,
  MapPin,
  Send,
  Activity,
  Building,
  CloudFog
} from 'lucide-react';

const SIGNAL_KEYWORDS = {
  not_breathing: [
    "not breathing",
    "no breathing",
    "stopped breathing",
    "can't breathe",
    "cannot breathe",
    "gasping for air",
    "barely breathing"
  ],

  unconscious: [
    "unconscious",
    "not responding",
    "not waking",
    "passed out",
    "fainted",
    "collapsed and not responding"
  ],

  bleeding: [
    "bleeding heavily",
    "losing blood",
    "blood everywhere",
    "severe bleeding",
    "profuse bleeding"
  ],

  burns: [
    "severe burns",
    "burn injuries",
    "on fire",
    "skin burned",
    "burned badly"
  ],

  accident: [
    "car accident",
    "road accident",
    "crash",
    "collision",
    "fell",
    "fell from",
    "fall",
    "hit by"
  ],

  fracture: [
    "broken bone",
    "fracture",
    "arm broken",
    "leg broken"
  ],
  trapped: [
    "trapped"
  ],
  fire_nearby: [
    "fire nearby"
  ],
  building_collapse: [
    "building collapse"
  ],
  in_smoke: [
    "in smoke"
  ]
};
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './index.css';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [selectedSignals, setSelectedSignals] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("Detecting location...");
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, loading, success, error

  const emergencies = [
    { id: 'not_breathing', icon: HeartPulse, label: 'Not Breathing' },
    { id: 'unconscious', icon: ShieldAlert, label: 'Unconscious' },
    { id: 'bleeding', icon: Droplet, label: 'Bleeding' },
    { id: 'burns', icon: Flame, label: 'Burns' },
    { id: 'accident', icon: AlertOctagon, label: 'Accident' },
    { id: 'fracture', icon: Activity, label: 'Fracture' },
    { id: 'trapped', icon: TriangleAlert, label: 'Trapped' },
    { id: 'fire_nearby', icon: Flame, label: 'Fire Nearby' },
    { id: 'building_collapse', icon: Building, label: 'Building Collapse' },
    { id: 'in_smoke', icon: CloudFog, label: 'In Smoke' }
  ];

  // Initialize Geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError("Unable to retrieve location");
        }
      );
    } else {
      setLocationError("Geolocation not supported by this browser");
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognitionInstance(recognition);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionInstance) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      setTranscript(""); 
      recognitionInstance.start();
      setIsListening(true);
    }
  };

  const toggleSignal = (id) => {
    setSelectedSignals(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setSubmitStatus("loading");
    
    const payload = {
      input_mode: transcript.trim() ? "voice" : "button",
      text: transcript,
      selected_signals: selectedSignals,
      location: location || { lat: 0, lng: 0 }
    };

    try {
      // API call to /report
      console.log("Sending payload to /report:", payload);
      
      const response = await fetch("http://localhost:3000/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      setSubmitStatus("success");
      
      // Auto-clear form after success
      setTimeout(() => {
        setSubmitStatus("idle");
        setTranscript("");
        setSelectedSignals([]);
      }, 3000);

    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="title-container">
          <AlertOctagon className="title-icon" size={36} color="#ff4a4a" />
          <h1 className="title-text">Omni-Triage</h1>
        </div>
        <p className="subtitle">Disaster Management System</p>
      </header>

      <main className="main-card">
        <div className="card-header">
          <MousePointer2 className="cursor-icon" size={20} />
          <h2>Report Emergency</h2>
        </div>
        <p className="section-subtitle">Send quick alert with location</p>

        <div className="voice-input-section">
          <button 
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
          >
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
          <div className="transcription-box">
            <p>{transcript || "Click the microphone to start speaking..."}</p>
          </div>
          {isListening && <p className="status-text">Listening...</p>}
        </div>

        <div className="emergency-grid">
          {emergencies.map((emp) => {
            const IconComponent = emp.icon;
            const isSelected = selectedSignals.includes(emp.id);
            return (
              <button
                key={emp.id}
                className={`emergency-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleSignal(emp.id)}
              >
                <IconComponent size={24} className="emp-icon" />
                <span>{emp.label}</span>
              </button>
            );
          })}
        </div>

        <div className="map-section">
          {location ? (
            <div className="map-container-wrapper">
              <MapContainer 
                center={[location.lat, location.lng]} 
                zoom={14} 
                scrollWheelZoom={false}
                className="leaflet-map"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]} />
              </MapContainer>
              <div className="location-info">
                <MapPin size={16} color="#4ade80" />
                <span>Location detected ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</span>
              </div>
            </div>
          ) : (
            <div className="location-info error">
              <MapPin size={16} color="#ff4a4a" />
              <span>{locationError}</span>
            </div>
          )}
        </div>

        <button 
          className={`submit-button ${submitStatus}`} 
          onClick={handleSubmit}
          disabled={submitStatus === "loading"}
        >
          {submitStatus === "idle" && <><Send size={20} /> Send Alert</>}
          {submitStatus === "loading" && "Sending..."}
          {submitStatus === "success" && "Case submitted successfully!"}
          {submitStatus === "error" && "Failed to send"}
        </button>

      </main>
    </div>
  );
}

export default App;
