import React from "react";

export const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --primary: #0A0E1A;
      --primary-light: #111827;
      --primary-card: #161D2E;
      --accent: #F59E0B;
      --accent-dark: #D97706;
      --accent-glow: rgba(245,158,11,0.15);
      --accent2: #10B981;
      --accent2-glow: rgba(16,185,129,0.12);
      --blue: #3B82F6;
      --blue-glow: rgba(59,130,246,0.12);
      --danger: #EF4444;
      --danger-glow: rgba(239,68,68,0.12);
      --purple: #8B5CF6;
      --surface: #1A2236;
      --surface2: #1E2A42;
      --surface3: #243150;
      --glass: rgba(255,255,255,0.04);
      --glass-border: rgba(255,255,255,0.08);
      --text: #F1F5F9;
      --text2: #94A3B8;
      --text3: #4B5563;
      --border: rgba(255,255,255,0.07);
      --border-accent: rgba(245,158,11,0.3);
      --radius: 16px;
      --radius-sm: 10px;
      --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
      --shadow-glow: 0 0 40px rgba(245,158,11,0.08);
      --font-head: 'Clash Display', sans-serif;
      --font-body: 'Plus Jakarta Sans', sans-serif;
      --sidebar-w: 260px;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--primary);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--primary); }
    ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 4px; }

    input, select, textarea {
      font-family: var(--font-body);
      background: var(--surface2);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      font-size: 14px;
      color: var(--text);
      width: 100%;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input::placeholder, textarea::placeholder { color: var(--text3); }
    input:focus, select:focus, textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    button { font-family: var(--font-body); cursor: pointer; border: none; transition: all 0.2s; font-weight: 600; letter-spacing: 0.01em; }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
      color: #0A0E1A;
      padding: 12px 24px;
      font-size: 14px;
      border-radius: var(--radius-sm);
      box-shadow: 0 4px 16px rgba(245,158,11,0.3);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,0.4); }

    .btn-secondary {
      background: var(--glass);
      color: var(--text);
      padding: 12px 24px;
      font-size: 14px;
      border-radius: var(--radius-sm);
      border: 1.5px solid var(--glass-border);
    }
    .btn-secondary:hover { background: var(--surface2); border-color: var(--text3); }

    .btn-danger { background: linear-gradient(135deg, var(--danger), #B91C1C); color: #fff; padding: 9px 18px; font-size: 13px; border-radius: var(--radius-sm); }
    .btn-success { background: linear-gradient(135deg, var(--accent2), #059669); color: #fff; padding: 9px 18px; font-size: 13px; border-radius: var(--radius-sm); }

    .card {
      background: var(--primary-card);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-card);
    }

    .tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    .tag-gold { background: rgba(245,158,11,0.15); color: var(--accent); border: 1px solid rgba(245,158,11,0.25); }
    .tag-teal { background: rgba(16,185,129,0.12); color: var(--accent2); border: 1px solid rgba(16,185,129,0.2); }
    .tag-blue { background: rgba(59,130,246,0.12); color: #60A5FA; border: 1px solid rgba(59,130,246,0.2); }

    /* SIDEBAR */
    .sidebar {
      position: fixed; left: 0; top: 0; bottom: 0;
      width: var(--sidebar-w);
      background: var(--primary-light);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      z-index: 200;
    }
    .sidebar-logo { padding: 28px 24px 20px; border-bottom: 1px solid var(--border); position: relative; }
    .sidebar-logo h1 { font-family: var(--font-head); font-size: 22px; color: var(--accent); font-weight: 700; letter-spacing: -0.5px; }
    .sidebar-logo span { font-size: 11px; color: var(--text3); display: block; margin-top: 3px; letter-spacing: 0.05em; text-transform: uppercase; }

    .sidebar-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
    .sidebar-section { font-size: 10px; font-weight: 700; color: var(--text3); letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 12px 6px; }

    .nav-item {
      display: flex; align-items: center; gap: 11px;
      padding: 11px 14px; border-radius: var(--radius-sm);
      color: var(--text2); font-size: 13.5px; font-weight: 500;
      cursor: pointer; transition: all 0.2s; margin-bottom: 2px;
    }
    .nav-item:hover { background: var(--glass); color: var(--text); }
    .nav-item.active {
      background: var(--accent-glow);
      color: var(--accent);
      border: 1px solid var(--border-accent);
    }
    .nav-badge { margin-left: auto; background: var(--accent); color: #0A0E1A; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; min-width: 20px; text-align: center; }
    .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); }
    .sidebar-user { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: var(--radius-sm); background: var(--glass); border: 1px solid var(--border); margin-bottom: 8px; }

    /* MAIN LAYOUT */
    .main { margin-left: var(--sidebar-w); min-height: 100vh; }

    .topbar {
      background: rgba(10,14,26,0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      padding: 0 32px;
      height: 68px;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 100;
    }
    .topbar-title { font-family: var(--font-head); font-weight: 600; font-size: 20px; letter-spacing: -0.3px; }

    .notif-btn {
      width: 40px; height: 40px; border-radius: var(--radius-sm);
      background: var(--glass); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; position: relative;
    }
    .notif-dot { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); border: 2px solid var(--primary); }

    .page { padding: 32px; animation: fadeInUp 0.4s ease; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* GRIDS */
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
    .grid4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
    .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

    .stat-card { padding: 24px; position: relative; overflow: hidden; cursor: default; }
    .stat-card .label { font-size: 11px; color: var(--text2); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
    .stat-card .value { font-family: var(--font-head); font-size: 36px; font-weight: 700; margin-top: 6px; letter-spacing: -1px; }

    .section-title { font-family: var(--font-head); font-size: 17px; font-weight: 600; letter-spacing: -0.2px; margin-bottom: 16px; }

    /* TABLES */
    .table-wrap { overflow-x: auto; border-radius: 0 0 var(--radius) var(--radius); }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; padding: 12px 20px; text-align: left; background: var(--surface2); border-bottom: 1px solid var(--border); }
    td { padding: 16px 20px; font-size: 14px; border-bottom: 1px solid var(--border); }
    tbody tr:hover td { background: var(--glass); }

    /* AVATAR */
    .avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      color: #0A0E1A; display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 800; flex-shrink: 0;
    }

    /* LIVE INDICATOR */
    .live-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--accent2); margin-right: 6px; animation: blink 1.5s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

    /* ANIMATIONS */
    .animate-in { animation: fadeInUp 0.4s ease both; }
    .delay-1 { animation-delay: 0.1s; }
  `}</style>
);