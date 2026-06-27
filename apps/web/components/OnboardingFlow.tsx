'use client';
import { useEffect, useState } from 'react';
import { useTheme } from '../lib/context';

const BG = 'linear-gradient(160deg, #1E1B4B 0%, #0F172A 100%)';

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'ob-anim';
    style.textContent = `
      @keyframes ob-card {
        0%,12%   { transform: translateX(0)    rotate(0deg);  }
        28%,42%  { transform: translateX(-60px) rotate(-8deg); }
        56%      { transform: translateX(0)    rotate(0deg);  }
        70%,84%  { transform: translateX(60px)  rotate(8deg);  }
        96%,100% { transform: translateX(0)    rotate(0deg);  }
      }
      @keyframes ob-del {
        0%,18%   { opacity:0; }
        28%,46%  { opacity:1; }
        56%,100% { opacity:0; }
      }
      @keyframes ob-keep {
        0%,56%   { opacity:0; }
        70%,88%  { opacity:1; }
        96%,100% { opacity:0; }
      }
      @keyframes ob-fade-up {
        from { opacity:0; transform:translateY(18px); }
        to   { opacity:1; transform:translateY(0);    }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById('ob-anim')?.remove();
  }, []);

  const TOTAL = 3;

  function advance() {
    if (step === TOTAL - 1) { onComplete(); return; }
    setFading(true);
    setTimeout(() => { setStep((s) => s + 1); setFading(false); }, 220);
  }

  function skip() { onComplete(); }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '56px 28px 44px',
        fontFamily: 'inherit',
      }}
    >
      {/* Skip */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={skip}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 0',
            fontFamily: 'inherit',
          }}
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          opacity: fading ? 0 : 1,
          transform: fading ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        {step === 0 && <WelcomeStep />}
        {step === 1 && <SwipeStep />}
        {step === 2 && <BinStep />}
      </div>

      {/* Dots + button */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 99,
                background: i === step ? '#7C3AED' : 'rgba(255,255,255,0.2)',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={advance}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '18px 0',
            background: 'linear-gradient(90deg, #7C3AED 0%, #6D28D9 100%)',
            border: 'none',
            borderRadius: 16,
            color: '#fff',
            fontSize: 17,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: 0.2,
            boxShadow: '0 4px 24px rgba(124,58,237,0.45)',
          }}
        >
          {step === TOTAL - 1 ? 'Start Cleaning ✨' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

// ── Step 1 ────────────────────────────────────────────────────────────────────

function WelcomeStep() {
  return (
    <div style={{ textAlign: 'center', animation: 'ob-fade-up 0.5s ease both' }}>
      <img
        src="/app-icon.png"
        alt="SwipeClean"
        style={{
          width: 130,
          height: 130,
          objectFit: 'contain',
          margin: '0 auto 24px',
          display: 'block',
          filter: 'drop-shadow(0 8px 32px rgba(124,58,237,0.55))',
        }}
      />
      <p
        style={{
          margin: '0 0 16px',
          fontSize: 24,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: -0.3,
        }}
      >
        Your camera roll, sorted.
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 16,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.65,
          maxWidth: 300,
          marginInline: 'auto',
        }}
      >
        Stop drowning in photos. Swipe through your library and keep only what matters.
      </p>
    </div>
  );
}

// ── Step 2 ────────────────────────────────────────────────────────────────────

function SwipeStep() {
  return (
    <div
      style={{
        textAlign: 'center',
        width: '100%',
        animation: 'ob-fade-up 0.5s ease both',
      }}
    >
      <h2
        style={{
          margin: '0 0 8px',
          fontSize: 28,
          fontWeight: 900,
          color: '#fff',
          letterSpacing: -0.5,
        }}
      >
        Swipe to decide
      </h2>
      <p style={{ margin: '0 0 32px', color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6 }}>
        Drag left to delete · Drag right to keep
        <br />
        Or tap the buttons below each card
      </p>

      {/* Animated demo card */}
      <div
        style={{
          position: 'relative',
          width: 220,
          height: 290,
          margin: '0 auto',
        }}
      >
        {/* Behind card */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 20,
            overflow: 'hidden',
            opacity: 0.55,
            transform: 'scale(0.93)',
            transformOrigin: 'top center',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400"
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Front card — animated */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            overflow: 'hidden',
            animation: 'ob-card 3s ease-in-out infinite',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* DELETE badge */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 16,
              border: '3px solid #EF4444',
              borderRadius: 8,
              padding: '4px 10px',
              transform: 'rotate(-15deg)',
              animation: 'ob-del 3s ease-in-out infinite',
              opacity: 0,
            }}
          >
            <span style={{ color: '#EF4444', fontSize: 16, fontWeight: 900, letterSpacing: 1 }}>
              DELETE
            </span>
          </div>
          {/* KEEP badge */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 16,
              border: '3px solid #22C55E',
              borderRadius: 8,
              padding: '4px 10px',
              transform: 'rotate(15deg)',
              animation: 'ob-keep 3s ease-in-out infinite',
              opacity: 0,
            }}
          >
            <span style={{ color: '#22C55E', fontSize: 16, fontWeight: 900, letterSpacing: 1 }}>
              KEEP
            </span>
          </div>
        </div>
      </div>

      {/* Side labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 20,
          padding: '0 12px',
          maxWidth: 280,
          marginInline: 'auto',
        }}
      >
        <span style={{ color: '#EF4444', fontSize: 14, fontWeight: 700 }}>← Delete</span>
        <span style={{ color: '#22C55E', fontSize: 14, fontWeight: 700 }}>Keep →</span>
      </div>
    </div>
  );
}

// ── Step 3 ────────────────────────────────────────────────────────────────────

function BinStep() {
  return (
    <div style={{ textAlign: 'center', animation: 'ob-fade-up 0.5s ease both' }}>
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 28,
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          fontSize: 52,
          border: '2px solid rgba(255,255,255,0.08)',
        }}
      >
        🗑️
      </div>
      <h2
        style={{
          margin: '0 0 14px',
          fontSize: 32,
          fontWeight: 900,
          color: '#fff',
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}
      >
        Nothing deleted instantly
      </h2>
      <p
        style={{
          margin: '0 0 32px',
          fontSize: 16,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.7,
          maxWidth: 300,
          marginInline: 'auto',
        }}
      >
        Items you swipe away go to your <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Bin</strong> first.
        Review them before anything is permanently removed. You're always in control.
      </p>

      {/* Mini bin preview */}
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '16px 20px',
          maxWidth: 300,
          marginInline: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: 'rgba(239,68,68,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          🗑
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 700 }}>Delete Bin</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            Review · Restore · Delete
          </p>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20, marginLeft: 'auto' }}>›</span>
      </div>
    </div>
  );
}
