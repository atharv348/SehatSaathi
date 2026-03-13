# 🩺 SehatSaathi: Advanced AI Clinical Diagnostic Platform

SehatSaathi is a sophisticated health-tracking and multi-organ diagnostic application designed to provide a futuristic "Health OS" experience. It leverages Deep Learning and Artificial Intelligence to analyze clinical scans, track vitals, and provide personalized wellness advice.

---

## 🚀 Features

- **AI Diagnostics**: Multi-organ clinical scan analysis (Skin, Lungs, Eye, Oral, Bone) using MobileNetV2 deep learning models.
- **Futuristic Dashboard**: A high-tech "Health Matrix" interface with live SVG ECG animations, radial progress rings, and real-time biometric simulations.
- **Wellness Modules**:
  - **AI Workout Plan**: Personalized exercise routines generated based on user goals.
  - **Nutrition Planner**: Macro-optimized meal plans.
  - **AROMI AI Coach**: Intelligent health companion powered by LLMs (Groq API).
- **Progress Tracking**: Historical logging of body weight and scan results with automated risk assessment.

---

## 🛠️ Technical Stack

- **Frontend**: React.js, Tailwind CSS, Lucide-React, TanStack Query (React Query).
- **Backend**: FastAPI (Python), SQLAlchemy ORM, SQLite Database.
- **Machine Learning**: PyTorch, Torchvision, OpenCV.
- **AI Integration**: Groq API (Llama-3) for medical advice.

---

## 🔮 Future Scope & Roadmap

SehatSaathi is designed to evolve into a fully integrated medical ecosystem. Key future developments include:

### 1. 🌐 IoT Device Integration (Real-time Vitals)
- **Smart Wearables**: Integration with smartwatches and fitness bands for live **Footsteps**, **Heart Rate**, and **SpO2** tracking.
- **Custom IoT Hardware**: Support for ESP32/Arduino-based sensors for continuous health monitoring (ECG, Temperature, and Pulse).
- **Automatic Sync**: Real-time data synchronization between physical devices and the SehatSaathi Dashboard.

### 2. 🧠 Expanded Medical Diagnostics
- **MRI/CT Scan Analysis**: Support for complex 3D medical imaging analysis using advanced CNN architectures.
- **Predictive Analytics**: Using historical data to predict potential health risks before symptoms appear.

### 3. 🏥 Healthcare Ecosystem
- **Telemedicine**: Direct video consultation with doctors based on AI scan results.
- **Pharmacy Integration**: Automatic prescription uploads and medicine delivery.
- **Medical Record Blockchain**: Secure, encrypted storage of patient history using blockchain technology for data privacy.

---

## 📦 Installation

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `python main.py`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

---

## 📄 License
This project is licensed under the MIT License.
