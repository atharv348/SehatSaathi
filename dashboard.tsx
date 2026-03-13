import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Apple, Calendar, ChevronRight, AlertCircle,
  TrendingUp, Trophy, Target, Zap, Heart, MessageCircle,
  Clock, Star, Flame, ScanLine, Shield, Brain, Cpu,
  Droplets, Wind, Eye, Wifi, WifiOff, User, Bell,
  BarChart2, PieChart, Layers, RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react';
import api from '../services/api';

interface UserData {
  username: string;
  full_name?: string;
  fitness_goal?: string;
  current_weight?: number;
  target_weight?: number;
}

interface Stats {
  workoutPlans: number;
  mealPlans: number;
  progressEntries: number;
  achievements: number;
  totalPoints: number;
  currentStreak: number;
  predictions: number;
}

interface RecentActivity {
  type: string;
  title: string;
  date: string;
  icon: any;
}

// Animated number counter
function Counter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ECG Line SVG
function ECGLine({ color = '#00f5c4', width = 260, height = 50, animate = true }) {
  const path = `M0,${height / 2} L30,${height / 2} L40,${height / 2} L45,5 L50,${height - 5} L55,${height / 2} L60,${height / 2} L90,${height / 2} L95,5 L100,${height - 5} L105,${height / 2} L${width},${height / 2}`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`ecg-grad-${color.replace('#', '')}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="40%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
        {animate && (
          <clipPath id="ecg-clip">
            <rect x="0" y="0" width={width} height={height}>
              <animate attributeName="x" from={-width} to={width} dur="2.5s" repeatCount="indefinite" />
            </rect>
          </clipPath>
        )}
      </defs>
      <path d={path} fill="none" stroke={`url(#ecg-grad-${color.replace('#', '')})`} strokeWidth="2"
        clipPath={animate ? "url(#ecg-clip)" : undefined} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" opacity="0.15" />
    </svg>
  );
}

// Radial progress ring
function RadialRing({ value, max, size = 80, stroke = 7, color = '#00f5c4', label = '', sublabel = '' }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-white" style={{ fontSize: size * 0.22 }}>{value}</span>
        {sublabel && <span className="text-white/50" style={{ fontSize: size * 0.12 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

// Pulse dot
function PulseDot({ color = '#00f5c4' }) {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: color }} />
    </span>
  );
}

// Mini sparkline
function Sparkline({ data, color = '#00f5c4', width = 80, height = 30 }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#spark-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

// Vital card with big bold display
function VitalCard({ icon: Icon, label, value, unit, trend, color, sparkData }: any) {
  const isUp = trend > 0;
  return (
    <div className="vital-card group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 cursor-pointer"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}18 0%, transparent 70%)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">{label}</span>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'DM Mono', monospace" }}>
              <Counter value={typeof value === 'number' ? value : 0} />
              {typeof value === 'string' && value}
            </span>
            <span className="text-sm text-white/30 mb-1">{unit}</span>
          </div>
        </div>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
      <div className="mt-3">
        <ECGLine color={color} width={200} height={32} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats>({
    workoutPlans: 0, mealPlans: 0, progressEntries: 0,
    achievements: 0, totalPoints: 0, currentStreak: 0, predictions: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [heartRate, setHeartRate] = useState(72);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = setInterval(() => setTime(new Date()), 1000);
    const hrSim = setInterval(() => setHeartRate(68 + Math.floor(Math.random() * 12)), 2000);
    return () => { clearInterval(tick); clearInterval(hrSim); };
  }, []);

  useEffect(() => {
    api.get('/health')
      .then(() => { setBackendStatus('online'); fetchAllData(); })
      .catch(() => { setBackendStatus('offline'); setLoading(false); });
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const userResponse = await api.get('/users/me', { headers });
      setUser(userResponse.data);
      const [workouts, meals, progress, achievements, predictions] = await Promise.all([
        api.get('/workout/history', { headers }).catch(() => ({ data: [] })),
        api.get('/meals/history', { headers }).catch(() => ({ data: [] })),
        api.get('/progress/entries', { headers }).catch(() => ({ data: [] })),
        api.get('/progress/achievements', { headers }).catch(() => ({ data: [] })),
        api.get('/api/predictions/', { headers }).catch(() => ({ data: [] }))
      ]);
      const totalPoints = achievements.data.reduce((s: number, a: any) => s + (a.points || 0), 0);
      setStats({
        workoutPlans: workouts.data.length || 0,
        mealPlans: meals.data.length || 0,
        progressEntries: progress.data.length || 0,
        achievements: achievements.data.length || 0,
        totalPoints,
        currentStreak: progress.data.length || 0,
        predictions: predictions.data.length || 0
      });
      const activities: RecentActivity[] = [];
      if (workouts.data.length > 0) activities.push({ type: 'workout', title: 'Generated workout plan', date: new Date(workouts.data[0].created_at).toLocaleDateString(), icon: Activity });
      if (meals.data.length > 0) activities.push({ type: 'meal', title: 'Created meal plan', date: new Date(meals.data[0].created_at).toLocaleDateString(), icon: Apple });
      if (predictions.data.length > 0) activities.push({ type: 'prediction', title: `AI Diagnosis: ${predictions.data[0].predicted_name}`, date: new Date(predictions.data[0].created_at).toLocaleDateString(), icon: ScanLine });
      if (progress.data.length > 0) activities.push({ type: 'progress', title: `Logged weight: ${progress.data[progress.data.length - 1].weight} kg`, date: new Date(progress.data[progress.data.length - 1].date).toLocaleDateString(), icon: TrendingUp });
      if (achievements.data.length > 0) activities.push({ type: 'achievement', title: `Unlocked: ${achievements.data[achievements.data.length - 1].title}`, date: new Date(achievements.data[achievements.data.length - 1].unlocked_at).toLocaleDateString(), icon: Trophy });
      setRecentActivities(activities.slice(0, 5));
      setLoading(false);
    } catch (e) { console.error(e); setLoading(false); }
  };

  const motivationalQuotes = [
    { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
    { text: "Health is not valued until sickness comes.", author: "Thomas Fuller" },
    { text: "Take care of your body — it's the only place you have to live.", author: "Jim Rohn" },
    { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
    { text: "Fitness is not about being better than someone else; it's about being better than you used to be.", author: "Unknown" }
  ];
  const todayQuote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  if (loading) {
    return (
      <div style={styles.loadScreen}>
        <div style={styles.loadInner}>
          <div style={styles.loadRing}>
            <div style={styles.loadRingInner} />
            <Heart size={28} style={{ color: '#00f5c4', position: 'absolute' }} />
          </div>
          <p style={styles.loadTitle}>Initializing Health Matrix</p>
          <div style={styles.loadBar}><div style={styles.loadBarFill} /></div>
          <p style={styles.loadSub}>Syncing biometric data...</p>
        </div>
      </div>
    );
  }

  const sparkHR = [68, 72, 70, 75, 71, 73, 74, heartRate, heartRate - 2, heartRate + 1];
  const sparkSteps = [6200, 7800, 5400, 8100, 9200, 7500, 8800, 10200, 9600, 11000];
  const sparkSleep = [6.5, 7.2, 6.8, 7.5, 8.0, 7.1, 6.9, 7.8, 8.2, 7.6];
  const sparkOxy = [96, 97, 96, 98, 97, 96, 97, 98, 97, 98];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        body {
          background: #030a0f;
          font-family: 'Syne', sans-serif;
        }

        .dashboard-root {
          min-height: 100vh;
          background: #030a0f;
          color: white;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(0,245,196,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,196,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        .orb-1 {
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,245,196,0.07) 0%, transparent 70%);
          top: -200px; right: -100px;
          pointer-events: none;
          animation: orb-float 8s ease-in-out infinite;
        }

        .orb-2 {
          position: fixed;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          bottom: -100px; left: -100px;
          pointer-events: none;
          animation: orb-float 10s ease-in-out infinite reverse;
        }

        @keyframes orb-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .nav-pill {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-pill:hover, .nav-pill.active {
          background: rgba(0,245,196,0.1);
          border-color: rgba(0,245,196,0.3);
          color: #00f5c4;
        }

        .vital-card {
          transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s;
        }
        .vital-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .module-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .module-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .module-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }

        .module-card:hover::before { opacity: 1; }

        .mc-blue::before { background: radial-gradient(circle at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%); }
        .mc-green::before { background: radial-gradient(circle at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 70%); }
        .mc-purple::before { background: radial-gradient(circle at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%); }
        .mc-teal::before { background: radial-gradient(circle at 50% 0%, rgba(20,184,166,0.12) 0%, transparent 70%); }
        .mc-indigo::before { background: radial-gradient(circle at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%); }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-blue { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
        .btn-blue:hover { background: rgba(59,130,246,0.3); }
        .btn-green { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
        .btn-green:hover { background: rgba(16,185,129,0.3); }
        .btn-purple { background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
        .btn-purple:hover { background: rgba(139,92,246,0.3); }
        .btn-teal { background: rgba(20,184,166,0.2); color: #2dd4bf; border: 1px solid rgba(20,184,166,0.3); }
        .btn-teal:hover { background: rgba(20,184,166,0.3); }
        .btn-indigo { background: rgba(99,102,241,0.2); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); }
        .btn-indigo:hover { background: rgba(99,102,241,0.3); }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
          transition: all 0.2s;
        }
        .activity-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }

        .score-bar-bg {
          height: 6px;
          border-radius: 99px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .score-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 1.2s cubic-bezier(.4,0,.2,1);
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        @keyframes beat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.15); }
          30% { transform: scale(1); }
          45% { transform: scale(1.08); }
          60% { transform: scale(1); }
        }
        .heart-beat { animation: beat 1.5s ease-in-out infinite; }

        @keyframes scan-line {
          0% { top: 0; opacity: 0.5; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0.5; }
        }

        .scan-anim::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00f5c4, transparent);
          animation: scan-line 2.5s linear infinite;
        }

        .health-score-ring {
          filter: drop-shadow(0 0 12px rgba(0,245,196,0.4));
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }
        .delay-5 { animation-delay: 0.5s; opacity: 0; }

        .divider { height: 1px; background: rgba(255,255,255,0.06); }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,245,196,0.2); border-radius: 99px; }
      `}</style>

      <div className="dashboard-root">
        <div className="grid-bg" />
        <div className="orb-1" />
        <div className="orb-2" />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 48px' }}>

          {/* TOP NAV */}
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 32 }}
            className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00f5c4, #00c9ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} color="#030a0f" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>SehatSaathi</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#00f5c4', background: 'rgba(0,245,196,0.1)', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(0,245,196,0.2)', textTransform: 'uppercase' }}>v2.0 Pro</span>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="nav-pill active">Overview</span>
              <span className="nav-pill" onClick={() => navigate('/workout')}>Fitness</span>
              <span className="nav-pill" onClick={() => navigate('/meals')}>Nutrition</span>
              <span className="nav-pill" onClick={() => navigate('/predict')}>Diagnostics</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {backendStatus === 'online' ? <PulseDot color="#00f5c4" /> : <PulseDot color="#f43f5e" />}
                <span style={{ fontSize: 12, fontWeight: 600, color: backendStatus === 'online' ? '#00f5c4' : '#f43f5e' }}>
                  {backendStatus === 'online' ? 'Systems Online' : 'Offline'}
                </span>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Bell size={16} color="rgba(255,255,255,0.5)" />
              </div>
              <div onClick={() => navigate('/profile')} style={{ width: 36, height: 36, borderRadius: 99, background: 'linear-gradient(135deg, rgba(0,245,196,0.3), rgba(0,201,255,0.3))', border: '1px solid rgba(0,245,196,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <User size={16} color="#00f5c4" />
              </div>
            </div>
          </nav>

          {/* HERO ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, marginBottom: 32, alignItems: 'start' }} className="fade-in delay-1">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                <Flame size={14} style={{ color: '#f97316' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316' }}>{stats.currentStreak} day streak</span>
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 12 }}>
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},<br />
                <span style={{ color: '#00f5c4' }}>{user?.full_name || user?.username || 'User'}</span>
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', maxWidth: 480, lineHeight: 1.6 }}>
                "{todayQuote.text}"
                <span style={{ display: 'block', marginTop: 4, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>— {todayQuote.author}</span>
              </p>
            </div>

            {/* Health Score Widget */}
            <div style={{ background: 'linear-gradient(135deg, rgba(0,245,196,0.08), rgba(0,201,255,0.04))', border: '1px solid rgba(0,245,196,0.15)', borderRadius: 24, padding: '24px 32px', textAlign: 'center', minWidth: 200 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>Health Score</p>
              <div className="health-score-ring" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <RadialRing value={Math.min(40 + stats.totalPoints + stats.currentStreak * 2, 100)} max={100} size={100} stroke={8} color="#00f5c4" />
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {stats.totalPoints > 50 ? 'Excellent' : stats.totalPoints > 20 ? 'Good' : 'Building...'}
              </p>
            </div>
          </div>

          {backendStatus === 'offline' && (
            <div style={{ marginBottom: 24, padding: '16px 20px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <WifiOff size={18} style={{ color: '#f43f5e', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#f43f5e', marginBottom: 2 }}>Backend Unreachable</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                  Cannot connect to <code style={{ fontFamily: "'DM Mono', monospace", background: 'rgba(244,63,94,0.1)', padding: '1px 6px', borderRadius: 4 }}>http://127.0.0.1:8001</code>. Please start the backend server.
                </p>
              </div>
            </div>
          )}

          {/* VITAL SIGNS ROW */}
          <div style={{ marginBottom: 8 }} className="fade-in delay-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Activity size={14} style={{ color: '#00f5c4' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Live Vitals Monitor</span>
              <div className="divider" style={{ flex: 1, height: 1 }} />
              <PulseDot color="#00f5c4" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <VitalCard icon={Heart} label="Heart Rate" value={heartRate} unit="bpm" trend={2.4} color="#f43f5e" sparkData={sparkHR} />
              <VitalCard icon={Activity} label="Steps Today" value={9847} unit="steps" trend={12.1} color="#f97316" sparkData={sparkSteps} />
              <VitalCard icon={Wind} label="SpO₂" value={97} unit="%" trend={0.5} color="#00c9ff" sparkData={sparkOxy} />
              <VitalCard icon={Droplets} label="Sleep Quality" value={78} unit="%" trend={-3.2} color="#a78bfa" sparkData={sparkSleep} />
            </div>
          </div>

          {/* STATS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }} className="fade-in delay-2">
            {[
              { label: 'Workout Plans', value: stats.workoutPlans, color: '#3b82f6', icon: Activity, ring: 12 },
              { label: 'Meal Plans', value: stats.mealPlans, color: '#10b981', icon: Apple, ring: 8 },
              { label: 'Clinical Scans', value: stats.predictions, color: '#8b5cf6', icon: ScanLine, ring: 4 },
              { label: 'Progress Logs', value: stats.progressEntries, color: '#14b8a6', icon: TrendingUp, ring: stats.progressEntries },
              { label: 'Achievements', value: stats.achievements, color: '#f59e0b', icon: Trophy, ring: stats.achievements },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <RadialRing value={s.value || 0} max={Math.max(s.value || 1, 20)} size={52} stroke={5} color={s.color} sublabel="" />
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: 'white' }}>
                    <Counter value={s.value || 0} />
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN MODULES GRID */}
          <div style={{ marginBottom: 12 }} className="fade-in delay-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Layers size={14} style={{ color: '#00f5c4' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Health Modules</span>
              <div className="divider" style={{ flex: 1 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 1fr', gridTemplateRows: 'auto auto', gap: 16 }}>

              {/* Workout */}
              <div className="module-card mc-blue" style={{ padding: 24 }} onClick={() => navigate('/workout')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <Activity size={22} style={{ color: '#60a5fa' }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Workout Plans</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Personalized AI routines</p>
                  </div>
                  <span className="tag" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                    {stats.workoutPlans} plans
                  </span>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                    <span>Completion</span><span style={{ color: 'white', fontWeight: 700 }}>68%</span>
                  </div>
                  <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '68%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }} /></div>
                </div>
                <button className="action-btn btn-blue" onClick={(e) => { e.stopPropagation(); navigate('/workout'); }}>
                  Generate Plan <ChevronRight size={14} />
                </button>
              </div>

              {/* Meal Plans */}
              <div className="module-card mc-green" style={{ padding: 24 }} onClick={() => navigate('/meals')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <Apple size={22} style={{ color: '#34d399' }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Nutrition Plans</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Macro-optimized meals</p>
                  </div>
                  <span className="tag" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                    {stats.mealPlans} plans
                  </span>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                    <span>Adherence</span><span style={{ color: 'white', fontWeight: 700 }}>81%</span>
                  </div>
                  <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: '81%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} /></div>
                </div>
                <button className="action-btn btn-green" onClick={(e) => { e.stopPropagation(); navigate('/meals'); }}>
                  Create Meal Plan <ChevronRight size={14} />
                </button>
              </div>

              {/* AI Diagnosis - featured card */}
              <div className="module-card mc-purple scan-anim" style={{ padding: 24, position: 'relative' }} onClick={() => navigate('/predict')}>
                <div style={{ position: 'absolute', top: 16, right: 16 }}>
                  <span className="tag" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <Cpu size={9} /> AI-Powered
                  </span>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <ScanLine size={22} style={{ color: '#a78bfa' }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>AI Diagnostics</h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>Multi-organ clinical scan analysis using deep neural networks</p>
                </div>
                <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Scans analyzed</span>
                  <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: '#a78bfa' }}>{stats.predictions}</span>
                </div>
                <button className="action-btn btn-purple" onClick={(e) => { e.stopPropagation(); navigate('/predict'); }}>
                  Start New Scan <ChevronRight size={14} />
                </button>
              </div>

              {/* Sidebar col - spans 2 rows */}
              <div style={{ gridRow: '1 / span 2', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Heart beat live */}
                <div style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(251,113,133,0.04))', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 20, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Heart size={18} style={{ color: '#f43f5e' }} className="heart-beat" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>Heart Rate</span>
                    </div>
                    <PulseDot color="#f43f5e" />
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 900, fontFamily: "'DM Mono', monospace", color: '#f43f5e', lineHeight: 1, marginBottom: 8 }}>
                    {heartRate}
                    <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>bpm</span>
                  </div>
                  <ECGLine color="#f43f5e" width={180} height={40} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Mono', monospace" }}>MIN 64</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Mono', monospace" }}>MAX 94</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>Quick Actions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { icon: Target, label: 'Update Profile', path: '/profile', color: '#00f5c4' },
                      { icon: Heart, label: 'Log Vitals', path: '/progress', color: '#f43f5e' },
                      { icon: MessageCircle, label: 'Consult AROMI', path: '/coach', color: '#818cf8' },
                      { icon: BarChart2, label: 'View Analytics', path: '/progress', color: '#f59e0b' },
                    ].map((a, i) => (
                      <button key={i} onClick={() => navigate(a.path)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, cursor: 'pointer', color: 'white', fontFamily: "'Syne', sans-serif", transition: 'all 0.2s', textAlign: 'left' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <a.icon size={13} style={{ color: a.color }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</span>
                        <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="module-card mc-teal" style={{ padding: 24 }} onClick={() => navigate('/progress')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <TrendingUp size={22} style={{ color: '#2dd4bf' }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Body Progress</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Track your transformation</p>
                  </div>
                  {user?.current_weight && user?.target_weight && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>Goal</div>
                      <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: '#2dd4bf' }}>{user.current_weight}→{user.target_weight}kg</div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, background: 'rgba(20,184,166,0.08)', borderRadius: 10, padding: '10px', textAlign: 'center', border: '1px solid rgba(20,184,166,0.12)' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: '#2dd4bf' }}><Counter value={stats.progressEntries} /></div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entries</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(20,184,166,0.08)', borderRadius: 10, padding: '10px', textAlign: 'center', border: '1px solid rgba(20,184,166,0.12)' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: '#2dd4bf' }}>{stats.currentStreak}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Streak</div>
                  </div>
                </div>
                <button className="action-btn btn-teal" onClick={(e) => { e.stopPropagation(); navigate('/progress'); }}>
                  Log Progress <ChevronRight size={14} />
                </button>
              </div>

              {/* AI Coach */}
              <div className="module-card mc-indigo" style={{ padding: 24 }} onClick={() => navigate('/coach')}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Brain size={22} style={{ color: '#818cf8' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>AROMI AI Coach</h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 16, lineHeight: 1.5 }}>Your intelligent health companion — personalized advice 24/7</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {['Diet Advice', 'Mental Health', 'Recovery', 'Goals'].map(t => (
                    <span key={t} style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>{t}</span>
                  ))}
                </div>
                <button className="action-btn btn-indigo" onClick={(e) => { e.stopPropagation(); navigate('/coach'); }}>
                  Start Consultation <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </div>

          {/* RECENT ACTIVITY + ACHIEVEMENTS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginTop: 16 }} className="fade-in delay-4">

            {/* Recent Activity */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={14} style={{ color: '#00f5c4' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Recent Activity</span>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 11, fontFamily: "'Syne', sans-serif" }}>
                  <RefreshCw size={11} /> Refresh
                </button>
              </div>
              {recentActivities.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    const colorMap: any = { workout: '#3b82f6', meal: '#10b981', prediction: '#8b5cf6', progress: '#14b8a6', achievement: '#f59e0b' };
                    const c = colorMap[activity.type] || '#00f5c4';
                    return (
                      <div key={index} className="activity-item">
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c}18`, border: `1px solid ${c}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={16} style={{ color: c }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{activity.title}</p>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>{activity.date}</p>
                        </div>
                        <div style={{ width: 6, height: 6, borderRadius: 99, background: c, opacity: 0.7, flexShrink: 0 }} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Zap size={32} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>No activity recorded yet</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>Begin your wellness journey today</p>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.03))', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Trophy size={14} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Health Milestones</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RadialRing value={stats.achievements || 0} max={Math.max(stats.achievements || 1, 10)} size={72} stroke={6} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'DM Mono', monospace", color: '#f59e0b', lineHeight: 1 }}>
                    <Counter value={stats.totalPoints} />
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Health Points</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
                    <Counter value={stats.achievements} /> badges earned
                  </div>
                </div>
              </div>

              {/* Badge previews */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[
                  { icon: '🏃', label: 'Runner', active: stats.workoutPlans > 0 },
                  { icon: '🥗', label: 'Nutrition', active: stats.mealPlans > 0 },
                  { icon: '🔬', label: 'Scanner', active: stats.predictions > 0 },
                  { icon: '📈', label: 'Tracker', active: stats.progressEntries > 0 },
                ].map((b, i) => (
                  <div key={i} style={{ flex: 1, background: b.active ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${b.active ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 10, padding: '8px 4px', textAlign: 'center', opacity: b.active ? 1 : 0.4 }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{b.icon}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: b.active ? '#f59e0b' : 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{b.label}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/progress')}
                style={{ width: '100%', padding: '11px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, color: '#f59e0b', fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.22)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.15)')}>
                <Star size={13} /> View All Achievements
              </button>
            </div>
          </div>

          {/* FOOTER STATUS */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="fade-in delay-5">
            <div style={{ display: 'flex', items: 'center', gap: 24, fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace" }}>
              <span>SehatSaathi Health OS v2.0</span>
              <span>•</span>
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>End-to-End Encrypted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={12} style={{ color: '#00f5c4' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Mono', monospace" }}>All systems nominal</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loadScreen: {
    minHeight: '100vh',
    background: '#030a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Syne', sans-serif",
  },
  loadInner: { textAlign: 'center', color: 'white' },
  loadRing: {
    width: 80, height: 80,
    borderRadius: '50%',
    border: '2px solid rgba(0,245,196,0.15)',
    borderTop: '2px solid #00f5c4',
    animation: 'spin 1s linear infinite',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 24px',
    position: 'relative',
  },
  loadRingInner: {
    position: 'absolute', inset: 0,
    borderRadius: '50%',
    border: '2px solid transparent',
    borderBottom: '2px solid rgba(0,201,255,0.4)',
  },
  loadTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'rgba(255,255,255,0.8)' },
  loadBar: { width: 200, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, margin: '0 auto 12px', overflow: 'hidden' },
  loadBarFill: { height: '100%', background: 'linear-gradient(90deg, #00f5c4, #00c9ff)', borderRadius: 99, animation: 'load-fill 1.5s ease-in-out infinite', width: '60%' },
  loadSub: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" },
};
