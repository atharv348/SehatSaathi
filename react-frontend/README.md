# 🏥 SehatSaathi React Frontend

Modern, responsive React interface for the SehatSaathi health platform.

## ✨ Features

- **Modern UI/UX** - Clean, professional medical dashboard
- **Real-time Animations** - Live ECG visualization, sparklines, pulse indicators
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Collapsible Sidebar** - Optimized space management
- **Tab Navigation** - 5 main sections (Overview, Diagnosis, Vitals, Records, AI Coach)
- **AI Chat Interface** - Interactive health coaching with Groq AI

## 🚀 Quick Start

### Option 1: Run Frontend Only
```bash
cd react-frontend
npm install
npm run dev
```
Open http://localhost:3000

### Option 2: Run Full Stack (Recommended)
```bash
# From project root
.\start_fullstack.bat
```

This starts:
- Backend API: http://localhost:5000
- Frontend UI: http://localhost:3000

## 📁 Project Structure

```
react-frontend/
├── src/
│   ├── SehatSaathi.jsx    # Main app component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## 🎨 UI Sections

### 1. **Overview** 📊
- Live vital signs with sparklines
- Real-time ECG visualization
- Recent diagnoses summary
- Medication tracker
- Next appointment
- Health score breakdown

### 2. **Diagnosis** 🔬
- AI disease detection interface
- Image upload for analysis
- Multi-category support (Skin, Eye, Oral, Bone)
- Differential diagnosis display
- AI recommendations

### 3. **Vitals** ❤️
- Blood pressure tracking
- Heart rate monitoring
- SpO₂ levels
- Body composition metrics
- Lab results summary

### 4. **Records** 📋
- Active workout plans
- Daily meal plans
- Upcoming appointments
- Weekly progress tracking

### 5. **AI Coach** 🤖
- Interactive chat interface
- Health advice powered by Groq
- Quick question shortcuts
- Context-aware responses

## 🔧 Configuration

### Backend API Connection

The frontend connects to the Python backend at `http://localhost:5000`. Update `vite.config.js` if your backend runs on a different port:

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:YOUR_PORT',
        changeOrigin: true,
      }
    }
  }
})
```

### Environment Variables

Create `.env` file in `react-frontend/` for custom settings:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE=SehatSaathi
```

## 🛠️ Development

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Canvas API** - ECG animations
- **SVG** - Sparklines and charts
- **CSS-in-JS** - Inline styling for components

## 🎯 Performance

- Fast HMR (Hot Module Replacement) with Vite
- Optimized animations using RequestAnimationFrame
- Lightweight bundle (~100KB gzipped)
- No external UI libraries - pure React

## 📱 Responsive Breakpoints

- Desktop: > 1024px (Full layout)
- Tablet: 768px - 1024px (Adjusted grid)
- Mobile: < 768px (Stacked layout)

## 🔗 Integration with Backend

The frontend expects these API endpoints:

- `POST /api/chat` - AI chat responses
- `POST /api/diagnose` - Disease diagnosis
- `GET /api/vitals` - Patient vital signs
- `GET /api/records` - Medical records

Refer to `api_server.py` in the root directory for backend setup.

## 🎨 Customization

### Colors

Main color palette defined in `SehatSaathi.jsx`:

```js
Primary: #0078d4 (Microsoft Blue)
Success: #16a34a (Green)
Warning: #d97706 (Orange)
Danger: #dc2626 (Red)
Purple: #7c3aed
```

### Fonts

- **UI Font**: Plus Jakarta Sans
- **Mono Font**: JetBrains Mono

Loaded from Google Fonts in component styles.

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill existing process
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### Backend connection failed
1. Ensure Python backend is running on port 5000
2. Check firewall settings
3. Verify `vite.config.js` proxy settings

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

Part of the SehatSaathi project.

## 🤝 Contributing

Improvements welcome! Focus areas:
- Mobile responsive enhancements
- Additional animations
- Accessibility (A11Y) improvements
- Performance optimizations
