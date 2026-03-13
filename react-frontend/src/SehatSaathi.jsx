import { useState, useEffect, useRef } from "react";

const PULSE_DATA = [65, 72, 68, 75, 71, 80, 74, 69, 76, 72, 78, 70];
const OXYGEN_DATA = [98, 97, 99, 98, 96, 99, 98, 97, 98, 99, 97, 98];
const BP_DATA = [120, 118, 122, 119, 121, 117, 123, 120, 118, 122, 119, 121];

const DIAGNOSES = [
  { id: 1, category: "SKIN", disease: "Melanocytic Nevi", risk: "Low", confidence: 0.94, time: "2h ago", icon: "🔬" },
  { id: 2, category: "EYE", disease: "Diabetic Retinopathy", risk: "Medium", confidence: 0.87, time: "1d ago", icon: "👁️" },
  { id: 3, category: "ORAL", disease: "Gingivitis", risk: "Low", confidence: 0.91, time: "3d ago", icon: "🦷" },
];

const MEDS = [
  { name: "Metformin", dose: "500mg", time: "08:00", taken: true },
  { name: "Lisinopril", dose: "10mg", time: "12:00", taken: true },
  { name: "Atorvastatin", dose: "20mg", time: "20:00", taken: false },
  { name: "Aspirin", dose: "81mg", time: "22:00", taken: false },
];

const APPOINTMENTS = [
  { doctor: "Dr. Priya Sharma", spec: "Cardiologist", date: "Mar 14", time: "10:30 AM", avatar: "PS", color: "#0078d4" },
  { doctor: "Dr. Arjun Mehta", spec: "Dermatologist", date: "Mar 18", time: "02:00 PM", avatar: "AM", color: "#7c3aed" },
  { doctor: "Dr. Neha Gupta", spec: "Ophthalmologist", date: "Mar 22", time: "11:00 AM", avatar: "NG", color: "#0369a1" },
];

function SparkLine({ data, color, height = 40 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 200, h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h * 0.75) - h * 0.1}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#g${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ECGLine() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let offset = 0;
    function ecgPoint(x) {
      const pos = (x + offset) % 200;
      if (pos < 40) return Math.sin(pos * 0.08) * 1.5;
      if (pos < 50) return Math.sin((pos - 40) * 0.3) * 6;
      if (pos < 55) return -Math.sin((pos - 50) * 0.4) * 22;
      if (pos < 60) return Math.sin((pos - 55) * 0.8) * 34;
      if (pos < 68) return -Math.sin((pos - 60) * 0.35) * 12;
      if (pos < 80) return Math.sin((pos - 68) * 0.25) * 7;
      if (pos < 90) return Math.sin((pos - 80) * 0.15) * 3;
      return Math.sin(pos * 0.04) * 1;
    }
    function draw() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, "rgba(0,120,212,0)");
      grad.addColorStop(0.3, "rgba(0,120,212,0.5)");
      grad.addColorStop(0.7, "rgba(0,120,212,1)");
      grad.addColorStop(1, "rgba(0,120,212,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(0,120,212,0.4)";
      ctx.beginPath();
      const mid = canvas.height / 2;
      for (let x = 0; x < canvas.width; x++) {
        const y = mid - ecgPoint(x * 0.8);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += 2;
      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "52px" }} />;
}

const RISK_STYLES = {
  Low:      { bg: "#e6f4ea", color: "#16a34a", border: "#86efac" },
  Medium:   { bg: "#fffbeb", color: "#d97706", border: "#fcd34d" },
  High:     { bg: "#fff0e6", color: "#ea580c", border: "#fbb98a" },
  Critical: { bg: "#fde8e8", color: "#dc2626", border: "#f9a8a8" },
};

function RiskBadge({ level }) {
  const s = RISK_STYLES[level] || RISK_STYLES.Low;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
      {level}
    </span>
  );
}

export default function SehatSaathi() {
  const [activeTab, setActiveTab] = useState("overview");
  const [time, setTime] = useState(new Date());
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! 🙏 I'm your AI health companion. How can I assist you today?" }
  ]);
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setMessages(m => [...m, { role: "user", content: userMsg }]);
    setTyping(true);
    try {
      // TODO: Replace with actual backend API endpoint
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.response || "Please consult your doctor for specific medical advice." }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Unable to connect to backend. Please ensure the Python API server is running." }]);
    }
    setTyping(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "diagnosis", label: "Diagnosis", icon: "🔬" },
    { id: "vitals", label: "Vitals", icon: "❤️" },
    { id: "records", label: "Records", icon: "📋" },
    { id: "ai", label: "AI Coach", icon: "🤖" },
  ];

  const Card = ({ children, style = {} }) => (
    <div style={{
      background: "white", border: "1px solid #e8edf3", borderRadius: 14,
      padding: "18px 20px", boxShadow: "0 2px 10px rgba(0,60,150,0.05)",
      transition: "box-shadow 0.2s, transform 0.2s", ...style
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,60,150,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,60,150,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >{children}</div>
  );

  const SectionTitle = ({ children }) => (
    <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1b2e", marginBottom: 14, paddingBottom: 8, borderBottom: "2px solid #e8f0fe", display: "flex", alignItems: "center", gap: 6 }}>
      {children}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", color: "#1a2332" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f0f4f8; }
        ::-webkit-scrollbar-thumb { background: #c5d2e0; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: #0078d4; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* SIDEBAR */}
        <div style={{
          width: sidebarOpen ? 220 : 64, minWidth: sidebarOpen ? 220 : 64,
          background: "white", borderRight: "1px solid #e8edf3",
          boxShadow: "2px 0 12px rgba(0,60,150,0.06)",
          display: "flex", flexDirection: "column",
          transition: "width 0.25s ease, min-width 0.25s ease",
          overflow: "hidden"
        }}>
          {/* Logo */}
          <div style={{ padding: "18px 16px", borderBottom: "1px solid #e8edf3", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => setSidebarOpen(o => !o)}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#0078d4,#005a9e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, boxShadow: "0 3px 10px rgba(0,120,212,0.3)" }}>🏥</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#0d1b2e", lineHeight: 1.2 }}>ArogyaMitra</div>
                <div style={{ fontSize: 9, color: "#8896a5", letterSpacing: 1.5, textTransform: "uppercase" }}>आरोग्य मित्र</div>
              </div>
            )}
          </div>

          {/* Patient mini */}
          {sidebarOpen && (
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #e8edf3", background: "#f8faff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#e8f0fe,#cce0f5)", border: "1.5px solid #90bde8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>👤</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#0d1b2e" }}>Arjun Kumar</div>
                  <div style={{ fontSize: 10, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
                    Active Patient
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginTop: 10 }}>
                {[["32", "Age"], ["74kg", "Wt"], ["22.4", "BMI"]].map(([v, l]) => (
                  <div key={l} style={{ background: "white", border: "1px solid #e8edf3", borderRadius: 8, padding: "6px 4px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, color: "#0078d4" }}>{v}</div>
                    <div style={{ fontSize: 9, color: "#8896a5", marginTop: 1 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav */}
          <nav style={{ padding: "10px 10px", flex: 1 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: sidebarOpen ? "9px 12px" : "9px", justifyContent: sidebarOpen ? "flex-start" : "center",
                background: activeTab === t.id ? "#e8f0fe" : "transparent",
                border: activeTab === t.id ? "1px solid #cce0f5" : "1px solid transparent",
                borderRadius: 9, cursor: "pointer", marginBottom: 3,
                color: activeTab === t.id ? "#0078d4" : "#6b7a8d",
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: 13, transition: "all 0.2s", textAlign: "left"
              }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{t.icon}</span>
                {sidebarOpen && t.label}
              </button>
            ))}
          </nav>

          {/* Emergency */}
          {sidebarOpen && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid #e8edf3" }}>
              <div style={{ background: "#fde8e8", border: "1px solid #f9a8a8", borderRadius: 9, padding: "9px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626" }}>🆘 Emergency</div>
                <div style={{ fontSize: 11, color: "#6b7a8d", marginTop: 2 }}>102 &nbsp;·&nbsp; 112 &nbsp;·&nbsp; 100</div>
              </div>
            </div>
          )}
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Top bar */}
          <div style={{
            height: 54, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 22px", background: "white", borderBottom: "1px solid #e8edf3",
            boxShadow: "0 1px 6px rgba(0,60,150,0.05)", position: "sticky", top: 0, zIndex: 10
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0d1b2e" }}>
                {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
              </div>
              <div style={{ height: 16, width: 1, background: "#e8edf3" }} />
              <div style={{ fontSize: 11, color: "#8896a5", fontFamily: "'JetBrains Mono', monospace" }}>
                {time.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#0078d4", fontWeight: 600 }}>
                {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#e6f4ea", border: "1px solid #86efac", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#16a34a" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
                System Normal
              </div>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#f0f4f8", border: "1px solid #e8edf3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>🔔</div>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{ flex: 1, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <>
                {/* ECG + quick stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Heart Rate", value: "72", unit: "BPM", icon: "❤️", color: "#dc2626", data: PULSE_DATA },
                    { label: "SpO₂", value: "98", unit: "%", icon: "🫁", color: "#0078d4", data: OXYGEN_DATA },
                    { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: "🩸", color: "#ea580c", data: BP_DATA },
                    { label: "Temperature", value: "36.8", unit: "°C", icon: "🌡️", color: "#7c3aed", data: [36.5,36.7,36.8,36.6,36.9,36.7,36.8,36.8,36.7,36.9,36.8,36.8] },
                  ].map(m => (
                    <div key={m.label} style={{ background: "white", border: "1px solid #e8edf3", borderRadius: 14, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,60,150,0.05)", transition: "all 0.2s", cursor: "default" }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,60,150,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,60,150,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#8896a5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{m.label}</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
                          <div style={{ fontSize: 10, color: "#b0bac5", marginTop: 2 }}>{m.unit}</div>
                        </div>
                        <span style={{ fontSize: 22 }}>{m.icon}</span>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <SparkLine data={m.data} color={m.color} height={36} />
                      </div>
                      <div style={{ position: "absolute" }} />
                      <div style={{ marginTop: 6, fontSize: 10, color: "#16a34a", fontWeight: 600 }}>● Normal Range</div>
                    </div>
                  ))}
                </div>

                {/* ECG Banner */}
                <Card style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#0078d4", display: "inline-block", animation: "pulse 1.2s infinite" }}></span>
                      <span style={{ fontSize: 10, color: "#0078d4", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase" }}>Live ECG — Lead II</span>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#0078d4" }}>72 <span style={{ fontSize: 11, color: "#8896a5" }}>BPM</span></div>
                  </div>
                  <ECGLine />
                </Card>

                {/* Middle row */}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
                  {/* Diagnoses */}
                  <Card>
                    <SectionTitle>🔬 Recent Diagnoses</SectionTitle>
                    {DIAGNOSES.map(d => {
                      const rs = RISK_STYLES[d.risk];
                      return (
                        <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, border: "1px solid #f0f4f8", background: "#fafbfd", marginBottom: 7, transition: "all 0.2s", cursor: "pointer" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#90bde8"; e.currentTarget.style.background = "#f0f7ff"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#f0f4f8"; e.currentTarget.style.background = "#fafbfd"; }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{d.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.disease}</div>
                            <div style={{ fontSize: 10, color: "#8896a5", marginTop: 1 }}>{d.category} · {d.time}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <RiskBadge level={d.risk} />
                            <div style={{ fontSize: 10, color: "#8896a5", fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{(d.confidence * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                      );
                    })}
                    <button onClick={() => setActiveTab("diagnosis")} style={{ width: "100%", marginTop: 6, background: "linear-gradient(135deg,#0078d4,#005a9e)", color: "white", border: "none", borderRadius: 9, padding: "9px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      + New Scan
                    </button>
                  </Card>

                  {/* Meds + Appt */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Card style={{ flex: 1 }}>
                      <SectionTitle>💊 Today's Medications</SectionTitle>
                      {MEDS.map(m => (
                        <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                          <div style={{ width: 18, height: 18, borderRadius: 5, background: m.taken ? "#e6f4ea" : "#f0f4f8", border: `1px solid ${m.taken ? "#86efac" : "#dde3ef"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, flexShrink: 0, color: m.taken ? "#16a34a" : "#b0bac5" }}>
                            {m.taken ? "✓" : "·"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: m.taken ? "#b0bac5" : "#0d1b2e", textDecoration: m.taken ? "line-through" : "none" }}>{m.name}</div>
                          </div>
                          <div style={{ fontSize: 10, color: "#8896a5", fontFamily: "'JetBrains Mono', monospace" }}>{m.dose}</div>
                        </div>
                      ))}
                    </Card>
                    <Card>
                      <SectionTitle>📅 Next Appointment</SectionTitle>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${APPOINTMENTS[0].color}18`, border: `1.5px solid ${APPOINTMENTS[0].color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: APPOINTMENTS[0].color, flexShrink: 0 }}>{APPOINTMENTS[0].avatar}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 12 }}>{APPOINTMENTS[0].doctor}</div>
                          <div style={{ fontSize: 11, color: "#8896a5" }}>{APPOINTMENTS[0].spec}</div>
                          <div style={{ fontSize: 11, color: "#0078d4", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginTop: 2 }}>{APPOINTMENTS[0].date} · {APPOINTMENTS[0].time}</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Health scores */}
                <Card>
                  <SectionTitle>🎯 Health Score Breakdown</SectionTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
                    {[
                      ["Overall", 87, "#0078d4"],
                      ["Cardio", 72, "#dc2626"],
                      ["Immunity", 91, "#16a34a"],
                      ["Metabolic", 68, "#d97706"],
                      ["Respiratory", 95, "#0369a1"],
                      ["Mental", 80, "#7c3aed"],
                    ].map(([label, val, color]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <svg viewBox="0 0 60 60" style={{ width: 60, height: 60 }}>
                          <circle cx="30" cy="30" r="22" fill="none" stroke="#e8edf3" strokeWidth="5" strokeDasharray={`${2*Math.PI*22*0.75} ${2*Math.PI*22}`} strokeDashoffset="0" strokeLinecap="round" transform="rotate(-225 30 30)" />
                          <circle cx="30" cy="30" r="22" fill="none" stroke={color} strokeWidth="5" strokeDasharray={`${2*Math.PI*22*0.75*(val/100)} ${2*Math.PI*22}`} strokeDashoffset="0" strokeLinecap="round" transform="rotate(-225 30 30)" style={{ filter: `drop-shadow(0 0 3px ${color}66)` }} />
                          <text x="30" y="33" textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">{val}</text>
                        </svg>
                        <div style={{ fontSize: 10, color: "#6b7a8d", marginTop: 2, fontWeight: 600 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* ── DIAGNOSIS ── */}
            {activeTab === "diagnosis" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Card>
                    <SectionTitle>🔬 AI Disease Detection</SectionTitle>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: "#8896a5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 5 }}>Disease Category</label>
                      <select style={{ width: "100%", background: "white", border: "1.5px solid #dde3ef", borderRadius: 9, padding: "9px 12px", color: "#0d1b2e", fontSize: 13, outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}>
                        {["🔬 Skin — Dermatology", "👁️ Eye — Ophthalmology", "🦷 Oral — Dental", "🦴 Bone — Orthopedic"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div style={{ border: "2px dashed #90bde8", borderRadius: 12, padding: "28px 16px", textAlign: "center", background: "#f0f7ff", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#0078d4"; e.currentTarget.style.background = "#e3f0fb"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#90bde8"; e.currentTarget.style.background = "#f0f7ff"; }}>
                      <div style={{ fontSize: 32, marginBottom: 6 }}>🩻</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#0d1b2e" }}>Drop medical image here</div>
                      <div style={{ fontSize: 11, color: "#8896a5", marginTop: 3 }}>JPG, PNG · Max 10MB</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4a5568", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: "#0078d4" }} /> Image Enhancement
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4a5568", cursor: "pointer" }}>
                        <input type="checkbox" style={{ accentColor: "#0078d4" }} /> Auto ROI
                      </label>
                    </div>
                    <button style={{ width: "100%", marginTop: 12, background: "linear-gradient(135deg,#0078d4,#005a9e)", color: "white", border: "none", borderRadius: 9, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 3px 12px rgba(0,120,212,0.3)" }}>
                      🔍 Analyse Image
                    </button>
                  </Card>

                  <Card style={{ background: "#f8faff", border: "1px solid #dde3ef" }}>
                    <SectionTitle>⚙️ Analysis Options</SectionTitle>
                    {[["Differential Diagnosis", "Show top-3 alternatives", true], ["Save to Records", "Store in history", true], ["AI Recommendation", "Get health advice", true]].map(([t, d, c]) => (
                      <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #e8edf3" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#0d1b2e" }}>{t}</div>
                          <div style={{ fontSize: 10, color: "#8896a5" }}>{d}</div>
                        </div>
                        <div style={{ width: 34, height: 18, borderRadius: 9, background: c ? "#0078d4" : "#dde3ef", position: "relative", cursor: "pointer", flexShrink: 0 }}>
                          <div style={{ position: "absolute", top: 2, width: 14, height: 14, borderRadius: "50%", background: "white", left: c ? 18 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Card>
                    <SectionTitle>📋 Latest Result</SectionTitle>
                    <div style={{ background: "#fff8e6", border: "1.5px solid #fcd34d", borderRadius: 10, padding: "14px", marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#8896a5", textTransform: "uppercase", letterSpacing: 1 }}>Detected Condition</div>
                          <div style={{ fontWeight: 800, fontSize: 16, color: "#0d1b2e", marginTop: 2 }}>Diabetic Retinopathy</div>
                          <div style={{ fontSize: 11, color: "#8896a5", marginTop: 2 }}>EYE · Ophthalmology</div>
                        </div>
                        <RiskBadge level="Medium" />
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10, color: "#8896a5" }}>
                          <span>Confidence</span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#0078d4" }}>87.4%</span>
                        </div>
                        <div style={{ height: 7, background: "#e8edf3", borderRadius: 7, overflow: "hidden" }}>
                          <div style={{ width: "87.4%", height: "100%", background: "linear-gradient(90deg,#0078d4,#00b4a0)", borderRadius: 7 }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8896a5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Differential Diagnoses</div>
                    {[["Diabetic Retinopathy", 0.874, "#d97706"], ["Hypertensive Retinopathy", 0.091, "#0078d4"], ["Age-related Maculopathy", 0.035, "#7c3aed"]].map(([n, c, col]) => (
                      <div key={n} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color: "#4a5568" }}>{n}</span>
                          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: col }}>{(c * 100).toFixed(1)}%</span>
                        </div>
                        <div style={{ height: 5, background: "#e8edf3", borderRadius: 5, overflow: "hidden" }}>
                          <div style={{ width: `${c * 100}%`, height: "100%", background: col, borderRadius: 5 }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, padding: 12, background: "#e8f4fd", border: "1px solid #90bde8", borderRadius: 9 }}>
                      <div style={{ fontSize: 10, color: "#0078d4", fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>🤖 AI Recommendation</div>
                      <p style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.6, margin: 0 }}>Schedule an urgent ophthalmology consultation. Begin blood sugar monitoring and follow up in 4 weeks.</p>
                    </div>
                  </Card>

                  <Card>
                    <SectionTitle>📚 All Diagnoses</SectionTitle>
                    {DIAGNOSES.map(d => (
                      <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, border: "1px solid #f0f4f8", background: "#fafbfd", marginBottom: 6, cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#90bde8"; e.currentTarget.style.background = "#f0f7ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#f0f4f8"; e.currentTarget.style.background = "#fafbfd"; }}>
                        <span style={{ fontSize: 16 }}>{d.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>{d.disease}</div>
                          <div style={{ fontSize: 10, color: "#8896a5" }}>{d.category} · {d.time}</div>
                        </div>
                        <RiskBadge level={d.risk} />
                      </div>
                    ))}
                  </Card>
                </div>
              </div>
            )}

            {/* ── VITALS ── */}
            {activeTab === "vitals" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  {[
                    { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: "🩸", color: "#ea580c", data: BP_DATA, status: "Normal" },
                    { label: "Heart Rate", value: "72", unit: "BPM", icon: "❤️", color: "#dc2626", data: PULSE_DATA, status: "Optimal" },
                    { label: "SpO₂", value: "98%", unit: "", icon: "🫁", color: "#0078d4", data: OXYGEN_DATA, status: "Excellent" },
                  ].map(m => (
                    <Card key={m.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#8896a5", textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, fontWeight: 700, color: m.color, marginTop: 2 }}>{m.value}</div>
                          <div style={{ fontSize: 10, color: "#b0bac5" }}>{m.unit}</div>
                        </div>
                        <span style={{ fontSize: 28 }}>{m.icon}</span>
                      </div>
                      <SparkLine data={m.data} color={m.color} height={52} />
                      <div style={{ marginTop: 8, fontSize: 11, color: "#16a34a", fontWeight: 600 }}>● {m.status}</div>
                    </Card>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Card>
                    <SectionTitle>⚖️ Body Composition</SectionTitle>
                    {[["Body Fat", "18.2%", "#0078d4", 0.182], ["Muscle Mass", "61.3kg", "#16a34a", 0.7], ["Hydration", "62.4%", "#7c3aed", 0.624], ["Bone Density", "1.24 g/cm²", "#d97706", 0.6], ["Visceral Fat", "Level 4", "#ea580c", 0.3]].map(([l, v, c, pct]) => (
                      <div key={l} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: "#4a5568", fontWeight: 600 }}>{l}</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#0d1b2e" }}>{v}</span>
                        </div>
                        <div style={{ height: 5, background: "#e8edf3", borderRadius: 5, overflow: "hidden" }}>
                          <div style={{ width: `${pct * 100}%`, height: "100%", background: c, borderRadius: 5 }} />
                        </div>
                      </div>
                    ))}
                  </Card>
                  <Card>
                    <SectionTitle>🧪 Lab Results</SectionTitle>
                    {[["Blood Glucose", "94 mg/dL", "Normal", "#16a34a"], ["HbA1c", "5.6%", "Pre-diabetic", "#d97706"], ["Cholesterol", "185 mg/dL", "Borderline", "#d97706"], ["Hemoglobin", "14.2 g/dL", "Normal", "#16a34a"], ["Creatinine", "0.9 mg/dL", "Normal", "#16a34a"]].map(([l, v, s, c]) => (
                      <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f4f8" }}>
                        <span style={{ fontSize: 12, color: "#4a5568" }}>{l}</span>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700 }}>{v}</div>
                          <div style={{ fontSize: 10, color: c, fontWeight: 600 }}>{s}</div>
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              </div>
            )}

            {/* ── RECORDS ── */}
            {activeTab === "records" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Card>
                    <SectionTitle>🏋️ Active Workout Plan</SectionTitle>
                    <div style={{ background: "#e8f4fd", border: "1px solid #90bde8", borderRadius: 9, padding: "10px 12px", marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>Strength + Cardio Hybrid</div>
                      <div style={{ fontSize: 11, color: "#8896a5", marginTop: 2 }}>4 days/week · Intermediate · Home Gym</div>
                    </div>
                    {[["Mon", "Upper Body Strength", "45 min", true], ["Tue", "HIIT Cardio", "30 min", true], ["Thu", "Lower Body Power", "50 min", false], ["Sat", "Full Body Circuit", "60 min", false]].map(([day, name, dur, done]) => (
                      <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f4f8" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: done ? "#e6f4ea" : "#f0f4f8", border: `1px solid ${done ? "#86efac" : "#dde3ef"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: done ? "#16a34a" : "#8896a5", flexShrink: 0 }}>{day}</div>
                        <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: done ? "#b0bac5" : "#0d1b2e", textDecoration: done ? "line-through" : "none" }}>{name}</div>
                        <div style={{ fontSize: 10, color: "#8896a5", fontFamily: "'JetBrains Mono', monospace" }}>{dur}</div>
                        {done && <span style={{ fontSize: 12 }}>✅</span>}
                      </div>
                    ))}
                  </Card>
                  <Card>
                    <SectionTitle>🥗 Today's Meal Plan</SectionTitle>
                    {[["🌅 Breakfast", "Oats + Banana + Almonds", "420 kcal", "08:00"], ["☀️ Lunch", "Dal Chawal + Sabzi + Salad", "650 kcal", "13:00"], ["🌙 Dinner", "Roti + Paneer + Curd", "580 kcal", "20:00"], ["🍎 Snack", "Fruits + Nuts Mix", "180 kcal", "16:00"]].map(([t, m, c, time]) => (
                      <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f4f8" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#0078d4", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{t} · {time}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, marginTop: 1 }}>{m}</div>
                        </div>
                        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#16a34a" }}>{c}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, padding: "8px 12px", background: "#e6f4ea", border: "1px solid #86efac", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Total Daily</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#16a34a", fontWeight: 800 }}>1,830 / 2,000 kcal</span>
                    </div>
                  </Card>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Card>
                    <SectionTitle>📅 Upcoming Appointments</SectionTitle>
                    {APPOINTMENTS.map(a => (
                      <div key={a.doctor} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", background: "#fafbfd", border: "1px solid #e8edf3", borderRadius: 10, marginBottom: 9, cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#90bde8"; e.currentTarget.style.background = "#f0f7ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8edf3"; e.currentTarget.style.background = "#fafbfd"; }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${a.color}18`, border: `1.5px solid ${a.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: a.color, flexShrink: 0 }}>{a.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 12 }}>{a.doctor}</div>
                          <div style={{ fontSize: 11, color: "#8896a5" }}>{a.spec}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, color: a.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{a.date}</div>
                          <div style={{ fontSize: 10, color: "#8896a5" }}>{a.time}</div>
                        </div>
                      </div>
                    ))}
                    <button style={{ width: "100%", background: "linear-gradient(135deg,#0078d4,#005a9e)", color: "white", border: "none", borderRadius: 9, padding: "9px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>+ Book Appointment</button>
                  </Card>
                  <Card>
                    <SectionTitle>📊 Weekly Progress</SectionTitle>
                    {[["👟 Steps", 8420, 10000, "#0078d4"], ["⏱️ Active Min", 42, 60, "#16a34a"], ["😴 Sleep (h)", 7.2, 8, "#7c3aed"], ["💧 Water (L)", 1.8, 2.5, "#ea580c"]].map(([l, v, t, c]) => (
                      <div key={l} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: "#4a5568", fontWeight: 600 }}>{l}</span>
                          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: c, fontWeight: 700 }}>{v} / {t}</span>
                        </div>
                        <div style={{ height: 6, background: "#e8edf3", borderRadius: 6, overflow: "hidden" }}>
                          <div style={{ width: `${(v / t) * 100}%`, height: "100%", background: c, borderRadius: 6 }} />
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              </div>
            )}

            {/* ── AI COACH ── */}
            {activeTab === "ai" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, height: "calc(100vh - 160px)" }}>
                <Card style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #e8edf3", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#e8f0fe,#cce0f5)", border: "1.5px solid #90bde8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>ArogyaMitra AI</div>
                      <div style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16a34a", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
                        Online · Groq-powered
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    {messages.map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeIn 0.3s ease" }}>
                        <div style={{
                          maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                          background: m.role === "user" ? "linear-gradient(135deg,#0078d4,#005a9e)" : "white",
                          color: m.role === "user" ? "white" : "#1a2332",
                          border: m.role === "user" ? "none" : "1px solid #e8edf3",
                          fontSize: 13, lineHeight: 1.5, boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                        }}>
                          {m.role === "assistant" && <div style={{ fontSize: 9, color: "#0078d4", fontWeight: 700, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>AI Health Coach</div>}
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {typing && (
                      <div style={{ display: "flex" }}>
                        <div style={{ background: "white", border: "1px solid #e8edf3", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                          {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#0078d4", animation: `blink 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div style={{ padding: "12px 16px", borderTop: "1px solid #e8edf3", display: "flex", gap: 8 }}>
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
                      placeholder="Ask about symptoms, diet, medications…"
                      style={{ flex: 1, background: "#f8faff", border: "1.5px solid #dde3ef", borderRadius: 9, padding: "9px 14px", fontSize: 13, outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a2332", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "#0078d4"}
                      onBlur={e => e.target.style.borderColor = "#dde3ef"} />
                    <button onClick={sendMessage} style={{ background: "linear-gradient(135deg,#0078d4,#005a9e)", color: "white", border: "none", borderRadius: 9, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0, boxShadow: "0 3px 10px rgba(0,120,212,0.3)" }}>
                      Send ↑
                    </button>
                  </div>
                </Card>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Card>
                    <SectionTitle>⚡ Quick Questions</SectionTitle>
                    {["Analyse my diagnosis", "Diet for diabetes", "7-day workout plan", "Improve sleep quality", "Reduce stress naturally"].map(q => (
                      <button key={q} onClick={() => { setChatInput(q); }} style={{ width: "100%", textAlign: "left", background: "#f8faff", border: "1px solid #e8edf3", borderRadius: 8, padding: "8px 11px", fontSize: 12, cursor: "pointer", marginBottom: 5, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#4a5568", fontWeight: 500, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#90bde8"; e.currentTarget.style.background = "#f0f7ff"; e.currentTarget.style.color = "#0078d4"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8edf3"; e.currentTarget.style.background = "#f8faff"; e.currentTarget.style.color = "#4a5568"; }}>
                        {q}
                      </button>
                    ))}
                  </Card>
                  <Card style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 6 }}>⚠️ Disclaimer</div>
                    <p style={{ fontSize: 11, color: "#6b7a8d", lineHeight: 1.6, margin: 0 }}>This AI provides general health info only. Always consult a qualified doctor for medical decisions.</p>
                  </Card>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
