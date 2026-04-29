# 🚑 Omni-Triage – Progress Update (Checkpoint 2)

## ✅ Completed

### 1. Backend Setup
- Express.js server initialized
- REST API endpoints created
- Modular file structure (routes, models, logic separation)

### 2. Signal Processing
- Implemented keyword-based signal extraction
- Added negation handling for better accuracy
- Mapped signals to weighted severity scoring

### 3. Severity Classification
- Defined 4 severity levels:
  - LOW
  - MEDIUM
  - HIGH
  - CRITICAL
- Added override rules for critical signals (e.g., not breathing, unconscious)

### 4. Database Integration
- Connected backend to MongoDB Atlas
- Created collections:
  - cases
  - reports
  - resources
  - logs

### 5. Case Pipeline
- Input → Signal Extraction → Scoring → Severity → Storage
- Structured storage with:
  - raw input
  - processed signals
  - decision tree
  - confidence score

### 6. Resource Allocation (Basic)
- Implemented ambulance assignment logic
- Supports multiple resources
- Handles initial allocation based on availability

### 7. Logging System
- Tracks:
  - CASE_CREATED
  - RESOURCE_ASSIGNED
- Enables transparency and traceability

---

## 🔄 In Progress

- Dynamic resource reallocation logic (priority-based)
- Improving decision reasoning structure
- Enhancing confidence calculation

---

## 🚀 Next Steps

- Real-time prioritization and reassignment
- UI dashboard for visualization
- Map-based resource tracking
- Advanced NLP improvements

---

## 💡 Key Focus

- Real-time decision making
- Transparency through logs
- Scalable architecture for emergency systems

  

-------------------------------------------------------------------------------------------------------------------



# 🚑 Omni-Triage – Progress Update (Checkpoint 3)


### 🖥️ 1. Frontend Command Center (Dashboard)

* Developed a **dark-mode emergency dashboard** using HTML + Tailwind CSS
* Integrated **Leaflet.js map** to visualize real-time incident locations
* Implemented **3-stage lifecycle UI**:

  * Pending
  * En Route
  * On-Site
* Auto-sorting by severity ensures **critical cases stay on top**

---

### 📊 2. Real-Time Simulation Layer

* Created a **mock data pipeline (`mock_cases.json`)** to simulate live emergency scenarios
* Built a **Python generator script** to produce realistic:

  * locations
  * timestamps
  * emergency descriptions
* Enables **stress testing without backend dependency**

---

### 🔗 3. Partial Backend Integration

* Connected frontend to backend API using `fetch()`
* Implemented **graceful fallback system**:

  * Uses live backend data if available
  * Automatically switches to mock data if backend is unavailable
* Ensures **demo reliability under all conditions**

---

### 🧠 4. Enhanced Visualization of Decision Logic

* Displayed **severity classification directly in UI** (LOW → CRITICAL)
* Added **system recommendations** (unit type suggestions)
* Structured UI to reflect backend triage decisions clearly

---

### 🚑 5. Multi-Resource Expansion

* Extended system beyond ambulances to include:

  * Fire engines
  * Police units
  * Heli-vac (conceptual)
* Designed UI to support **multi-agency emergency response**

---

### 🗺️ 6. Dynamic Map & Routing Visualization

* Integrated **road-based routing (OSRM)** for realistic path rendering
* Visual distinction between:

  * predicted routes (unassigned cases)
  * active tracking routes (assigned units)
* Simulated **live vehicle movement using interpolation**

---

### ⚙️ 7. System Resilience & Reliability

* Implemented **offline failsafe mode**
* Detects backend failure and switches to local data without breaking UI
* Ensures **uninterrupted demo experience**

---

## 🚀 Key Improvements

* Transitioned from **backend-only system → full-stack prototype**
* Added **visual and interactive layer** for better understanding
* Improved **system robustness and demo readiness**

---

## 🔄 In Progress / Next Steps

* Full frontend ↔ backend synchronization
* Real-time updates via WebSockets (instead of polling)
* Improved reallocation visibility in UI
* Performance optimization and testing


-------------------------------------------------------------------------------------------------------------

# 🚑 Omni-Triage – Progress Update (Checkpoint 4)


---

🖥️ **1. Frontend Emergency Interface**
Developed a responsive web-based interface using React (Vite)

Designed a clean UI for:

* Voice input handling
* Manual emergency selection
* Real-time feedback display

Structured layout to prioritize quick interaction during emergencies

---

🎤 **2. Voice-Based Detection Engine**
Implemented speech-to-text based emergency phrase detection

Recognizes critical keywords such as:

* “not breathing”
* “car accident”
* “severe bleeding”

Enables hands-free reporting for faster response in critical situations

---

🧠 **3. Smart Signal Mapping System**
Built a rule-based keyword classification engine

Mapped detected signals into emergency categories:

* Breathing issues
* Burns
* Accidents
* Fractures
* Fire / smoke / collapse

Forms the foundation for future severity scoring and triage logic

---

📍 **4. Real-Time Location Tracking**
Integrated browser Geolocation API

Captures:

* Latitude
* Longitude

Ensures accurate location sharing during emergency reporting

---

🗺️ **5. Live Map Visualization**
Integrated Leaflet + React-Leaflet for map rendering

Displays:

* User’s real-time position
* Marker-based location visualization

Provides spatial awareness for emergency situations

---

🖱️ **6. Manual Emergency Input Layer**
Implemented fallback manual selection system

Allows users to:

* Select emergency type manually
* Override or assist voice detection

Improves reliability when voice recognition fails

---

⚙️ **7. System Architecture & Tech Stack**
Frontend built using:

* React (Vite)
* JavaScript (ES6)
* CSS
* Leaflet (maps)
* Lucide React (icons)

Maintains modular and scalable structure for future backend integration

---

🔐 **8. Permissions & System Requirements**
Requires user permissions for:

* Microphone (voice detection)
* Location (geolocation tracking)

Ensures real-time data acquisition for emergency handling

---

🚀 **Key Achievements**

* Built a fully functional frontend prototype
* Enabled real-time voice + manual emergency reporting
* Integrated live location tracking with map visualization
* Established base for intelligent triage system

---

🔄 **In Progress / Next Steps**

* Integrate AI-based speech recognition (Whisper / Deepgram)
* Add backend connectivity (Node.js / Firebase)
* Implement real-time alert system (SMS / APIs)
* Introduce severity scoring & triage classification
* Add multi-language support for wider accessibility

-------------------------------------------------------------------------------------------------------------



