import React, { useState, useEffect } from 'react';

// 1. NOTIFICATION COMPONENT
export function Notification({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColors = {
    success: 'var(--accent2)',
    error: 'var(--danger)',
    info: '#3B82F6',
    warning: '#F59E0B'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: bgColors[type] || bgColors.info,
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{message}</span>
        <button onClick={() => { setVisible(false); if(onClose) onClose(); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '12px', fontSize: '18px' }}>×</button>
      </div>
    </div>
  );
}

// 2. AVATAR COMPONENT
export function Avatar({ name, size = 40, image }) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div 
      style={{
        width: size, 
        height: size, 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
        color: '#0A0E1A', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: 700, 
        fontSize: size / 2.5,
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      {image ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(name)}
    </div>
  );
}

// 3. TOGGLE COMPONENT
export function Toggle({ on, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!on)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: on ? 'var(--accent2)' : 'var(--surface3)',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        transition: 'background 0.2s'
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: '2px',
          left: on ? '22px' : '2px',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }}
      />
    </button>
  );
}

// 4. STARS COMPONENT
export function Stars({ rating = 0 }) {
  return (
    <div style={{ color: '#F59E0B', fontSize: '14px', letterSpacing: '2px' }}>
      {Array(5).fill(0).map((_, i) => (
        <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
      ))}
    </div>
  );
}

// 5. TIER BADGE COMPONENT
export function TierBadge({ tier }) {
  const colors = {
    standard: 'var(--text2)',
    premium: '#F59E0B',
    luxury: '#8B5CF6'
  };
  
  return (
    <span style={{
      background: colors[tier] || colors.standard,
      color: '#fff',
      fontSize: '10px',
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {tier}
    </span>
  );
}

// 6. LIVEDOT COMPONENT
export function LiveDot() {
  return <span className="live-dot" />;
}

// 7. PROGRESSBAR COMPONENT
export function ProgressBar({ value = 0, max = 100, color = 'var(--accent2)', height = '6px' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress-bar" style={{ height: height }}>
      <div 
        className="progress-fill" 
        style={{ 
          width: `${percentage}%`, 
          background: color
        }} 
      />
    </div>
  );
}

// 8. STATUSBADGE COMPONENT (FIXED)
// This component handles the display of order/status states
export function StatusBadge({ status }) {
  const getStatusStyle = (s) => {
    switch(s) {
      case 'pending':
        return { background: 'rgba(245,158,11,0.15)', color: 'var(--accent)', border: '1px solid rgba(245,158,11,0.25)' };
      case 'active':
        return { background: 'rgba(16,185,129,0.12)', color: 'var(--accent2)', border: '1px solid rgba(16,185,129,0.2)' };
      case 'completed':
        return { background: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' };
      case 'cancelled':
        return { background: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' };
      default:
        return { background: 'rgba(148,163,184,0.1)', color: 'var(--text2)', border: '1px solid rgba(148,163,184,0.15)' };
    }
  };

  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      ...getStatusStyle(status)
    }}>
      {status}
    </span>
  );
}