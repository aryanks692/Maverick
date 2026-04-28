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

