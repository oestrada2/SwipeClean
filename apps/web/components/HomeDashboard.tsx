'use client';
import { useState } from 'react';
import { useApp, useTheme } from '../lib/context';
import { getMockAlbums } from '../lib/mockData';
import type { CleanupCategory } from '../lib/types';

type MonthSort = 'newest' | 'oldest' | 'most-photos' | 'fewest-photos' | 'most-storage';

type CategoryDef = {
  id: CleanupCategory;
  label: string;
  sub?: string;
  gradient: string;
  icon?: string;
  isPremiumOnly?: boolean;
  height?: number;
  colSpan?: 2;
  meta?: { count: number; storageMb: number };
};

function fmtStorage(mb: number) {
  return mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB` : `${mb} MB`;
}

function getMonthLabel(offset: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - offset);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = String(d.getFullYear()).slice(2);
  return `${month} '${year}`;
}

export function HomeDashboard() {
  const theme = useTheme();
  const { setTab, setCleanupCategory, setCleanupAlbum, isPremium } = useApp();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAlbumPicker, setShowAlbumPicker] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<'photos-only' | 'videos-only' | null>(null);
  const [monthSort, setMonthSort] = useState<MonthSort>('newest');
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [reveal, setReveal] = useState<{
    phase: 'spinning' | 'landed';
    target: CategoryDef;
    display: string;
    tickKey: number;
  } | null>(null);

  const categories: CategoryDef[] = [
    {
      id: 'all-photos',
      label: 'all photos',
      sub: 'Your full library',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      icon: '🖼',
      height: 176,
      colSpan: 2,
    },
    {
      id: 'on-this-day',
      label: 'on this day',
      sub: 'From past years',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      icon: '📅',
      height: 168,
    },
    {
      id: 'recents',
      label: 'recents',
      sub: 'Last 30 days',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      icon: '🕐',
      height: 168,
    },
    {
      id: 'screenshots',
      label: 'screenshots',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
      icon: '📸',
      height: 128,
    },
    {
      id: 'large-videos',
      label: 'large videos',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
      icon: '🎬',
      isPremiumOnly: true,
      height: 128,
    },
    {
      id: 'albums',
      label: 'albums',
      sub: 'Browse by folder',
      gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
      icon: '📁',
      height: 120,
      colSpan: 2,
    },
    {
      id: 'smart-cleanup',
      label: 'smart cleanup',
      sub: 'Duplicates · Blurry · AI Picks',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
      icon: '✨',
      isPremiumOnly: true,
      height: 156,
      colSpan: 2,
    },
    { id: 'month-0', label: getMonthLabel(0), gradient: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)', height: 92, meta: { count: 284, storageMb: 2150 } },
    { id: 'month-1', label: getMonthLabel(1), gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', height: 92, meta: { count: 156, storageMb: 890 } },
    { id: 'month-2', label: getMonthLabel(2), gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)', height: 92, meta: { count: 412, storageMb: 3400 } },
    { id: 'month-3', label: getMonthLabel(3), gradient: 'linear-gradient(135deg, #84CC16 0%, #A3E635 100%)', height: 92, meta: { count: 98, storageMb: 640 } },
  ];

  const monthIds = new Set(['month-0', 'month-1', 'month-2', 'month-3']);

  function handleTap(cat: CategoryDef) {
    if (cat.isPremiumOnly && !isPremium) {
      setShowPaywall(true);
      return;
    }
    if (cat.id === 'albums') {
      setShowAlbumPicker(true);
      return;
    }
    setCleanupAlbum(null);
    setCleanupCategory(cat.id);
    setTab('swipe');
  }

  function handleAlbumSelect(albumName: string) {
    setCleanupAlbum(albumName);
    setCleanupCategory('albums');
    setShowAlbumPicker(false);
    setTab('swipe');
  }

  return (
    <div style={{ background: `radial-gradient(ellipse 120% 40% at 50% -5%, rgba(139,92,246,0.22) 0%, ${theme.colors.background} 60%)`, minHeight: '100dvh', paddingBottom: 80 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '56px 20px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/app-icon.png"
            alt=""
            style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: theme.colors.background === '#050505' ? 'screen' : 'multiply' }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 900,
              color: theme.colors.text,
              letterSpacing: -0.5,
              lineHeight: 1,
            }}
          >
            SwipeClean
          </h1>
        </div>
        <button
          onClick={() => setShowSortSheet(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: theme.colors.surfaceOverlay,
            border: `1px solid ${theme.colors.divider}`,
            borderRadius: 99,
            padding: '8px 14px 8px 10px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textSecondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textSecondary }}>Sort</span>
        </button>
      </div>

      <p
        style={{
          margin: '0 20px 16px',
          color: theme.colors.muted,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0.2,
        }}
      >
        What do you want to clean?
      </p>

      {/* Media type quick filters — compact row, top-right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 14px 14px', gap: 6 }}>
        {([
          { id: 'photos-only' as const, icon: '📷', label: 'photos' },
          { id: 'videos-only' as const, icon: '🎥', label: 'videos' },
        ]).map(({ id, icon, label }) => {
          const checked = selectedMediaType === id;
          return (
            <button
              key={id}
              onClick={() => {
                const next = selectedMediaType === id ? null : id;
                setSelectedMediaType(next);
                if (next) { setCleanupAlbum(null); setCleanupCategory(next); setTab('swipe'); }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                background: checked ? theme.colors.primaryLight : theme.colors.inputBackground,
                border: `1px solid ${checked ? theme.colors.primary : theme.colors.border}`,
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  border: `1.5px solid ${checked ? theme.colors.primary : theme.colors.chevron}`,
                  background: checked ? theme.colors.primary : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {checked && (
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                    <path d="M1 3L3 5.5L7 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span style={{ fontSize: 12 }}>{icon}</span>
              <span style={{ color: checked ? theme.colors.text : theme.colors.textSecondary, fontSize: 12, fontWeight: 600 }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bento grid — main categories */}
      <div style={{ padding: '0 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {categories.filter((c) => !monthIds.has(c.id)).map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTap(cat)}
            style={{
              gridColumn: cat.colSpan === 2 ? '1 / -1' : undefined,
              position: 'relative',
              width: '100%',
              height: cat.height ?? 128,
              background: cat.gradient,
              border: 'none',
              borderRadius: 22,
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              padding: cat.colSpan === 2 ? '20px 24px' : '16px 18px',
              textAlign: 'left',
              fontFamily: 'inherit',
              transition: 'transform 0.12s ease, filter 0.12s ease',
            }}
            onPointerEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.08)'; }}
            onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = ''; }}
          >
            {/* Glass sheen */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, transparent 50%)',
              borderRadius: 'inherit',
              pointerEvents: 'none',
            }} />
            {/* Large icon */}
            {cat.icon && (
              <span aria-hidden="true" style={{
                position: 'absolute',
                right: cat.colSpan === 2 ? 18 : 10,
                bottom: cat.colSpan === 2 ? 14 : 12,
                fontSize: cat.colSpan === 2 ? 96 : 64,
                opacity: 0.18,
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}>
                {cat.icon}
              </span>
            )}
            {/* PRO badge */}
            {cat.isPremiumOnly && (
              <span style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(8px)',
                color: '#FCD34D',
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 1.5,
                padding: '4px 8px',
                borderRadius: 99,
                border: '1px solid rgba(252,211,77,0.3)',
              }}>
                PRO
              </span>
            )}
            {/* Label */}
            <span style={{
              color: '#fff',
              fontSize: cat.colSpan === 2 ? 36 : 24,
              fontWeight: 900,
              letterSpacing: -0.8,
              lineHeight: 1.05,
              display: 'block',
              textShadow: '0 1px 8px rgba(0,0,0,0.2)',
              position: 'relative',
            }}>
              {cat.label}
            </span>
            {cat.sub && (
              <span style={{
                color: 'rgba(255,255,255,0.68)',
                fontSize: 12,
                marginTop: 4,
                display: 'block',
                fontWeight: 500,
                position: 'relative',
              }}>
                {cat.sub}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Month archive — 2×2 grid */}
      <p style={{
        margin: '18px 20px 10px',
        color: theme.colors.muted,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      }}>
        By Month
      </p>
      <div style={{ padding: '0 14px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {((): CategoryDef[] => {
          const months = categories.filter((c) => monthIds.has(c.id));
          switch (monthSort) {
            case 'oldest':        return [...months].reverse();
            case 'most-photos':   return [...months].sort((a, b) => (b.meta?.count ?? 0) - (a.meta?.count ?? 0));
            case 'fewest-photos': return [...months].sort((a, b) => (a.meta?.count ?? 0) - (b.meta?.count ?? 0));
            case 'most-storage':  return [...months].sort((a, b) => (b.meta?.storageMb ?? 0) - (a.meta?.storageMb ?? 0));
            default:              return months;
          }
        })().map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTap(cat)}
            style={{
              position: 'relative',
              height: cat.height ?? 92,
              background: cat.gradient,
              border: 'none',
              borderRadius: 18,
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '0 18px',
              fontFamily: 'inherit',
              transition: 'filter 0.12s ease',
              gap: 3,
            }}
            onPointerEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.08)'; }}
            onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = ''; }}
          >
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(140deg,rgba(255,255,255,0.18) 0%,transparent 50%)', borderRadius:'inherit', pointerEvents:'none' }} />
            <span style={{ color:'#fff', fontSize:20, fontWeight:900, letterSpacing:-0.8, lineHeight:1, position:'relative', textShadow:'0 1px 6px rgba(0,0,0,0.2)' }}>
              {cat.label}
            </span>
            {cat.meta && (
              <span style={{ color:'rgba(255,255,255,0.65)', fontSize:10, fontWeight:600, position:'relative', letterSpacing:0.1 }}>
                {cat.meta.count} photos · {fmtStorage(cat.meta.storageMb)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Random month button */}
      <div style={{ padding: '12px 14px 0' }}>
        <button
          onClick={() => {
            const monthCats = categories.filter((c) => monthIds.has(c.id));
            const pick = monthCats[Math.floor(Math.random() * monthCats.length)];
            if (!pick) return;

            setReveal({ phase: 'spinning', target: pick, display: monthCats[0].label, tickKey: 0 });

            let tick = 0;
            const labels = monthCats.map((c) => c.label);

            function spin() {
              tick++;
              const delay = tick < 10 ? 70 : tick < 15 ? 130 : tick < 18 ? 220 : 340;
              if (tick < 21) {
                setReveal((prev) => prev ? { ...prev, display: labels[tick % labels.length], tickKey: tick } : null);
                setTimeout(spin, delay);
              } else {
                setReveal((prev) => prev ? { ...prev, phase: 'landed', display: pick.label, tickKey: tick } : null);
                setTimeout(() => {
                  setReveal(null);
                  handleTap(pick);
                }, 1100);
              }
            }
            setTimeout(spin, 70);
          }}
          style={{
            width: '100%',
            padding: '17px 20px',
            background: 'linear-gradient(110deg, #62CFF4 0%, #FF00FF 100%)',
            border: 'none',
            borderRadius: 18,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 6px 28px rgba(255,0,255,0.35)',
            transition: 'filter 0.12s ease, transform 0.12s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onPointerEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.filter = 'brightness(1.12)';
            b.style.transform = 'scale(1.02)';
          }}
          onPointerLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.filter = '';
            b.style.transform = '';
          }}
        >
          {/* Glass sheen */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(140deg,rgba(255,255,255,0.22) 0%,transparent 55%)', pointerEvents:'none' }} />
          <span style={{ fontSize: 22, position: 'relative' }}>🎲</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: -0.3, position: 'relative', textShadow: '0 1px 6px rgba(0,0,0,0.2)' }}>
            Surprise Me
          </span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600, position: 'relative' }}>
            · random month
          </span>
        </button>
      </div>

      {/* Quick stats 2×2 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '16px 20px 0' }}>
        {([
          { value: '4,382', label: 'Photos & Videos', accent: theme.colors.primary },
          { value: '12.4 GB', label: 'Library Size', accent: theme.colors.muted },
          { value: '342', label: 'To Review', accent: '#F59E0B' },
          { value: '1.2 GB', label: 'Can Free Up', accent: theme.colors.keep },
        ] as const).map(({ value, label, accent }) => (
          <div
            key={label}
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 16,
              padding: '16px 14px 14px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent, opacity: 0.7 }} />
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: theme.colors.text, lineHeight: 1.1 }}>{value}</p>
            <p style={{ margin: '5px 0 0', fontSize: 11, fontWeight: 600, color: theme.colors.muted, letterSpacing: 0.2 }}>{label}</p>
          </div>
        ))}
      </div>

      {reveal && (
        <>
          <style>{`
            @keyframes sc-roll { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
            @keyframes sc-land { 0%{transform:scale(0.72);opacity:0} 65%{transform:scale(1.07)} 100%{transform:scale(1);opacity:1} }
            @keyframes sc-confetti { 0%{opacity:0;transform:scale(0.3) rotate(0deg)} 40%{opacity:1} 100%{opacity:0;transform:scale(2.2) rotate(25deg)} }
            @keyframes sc-in { from{opacity:0} to{opacity:1} }
          `}</style>
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'sc-in 0.18s ease both',
            }}
          >
            {reveal.phase === 'spinning' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 20, lineHeight: 1 }}>🎲</div>
                <div style={{
                  width: 280, height: 110,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:32, background:'linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)', pointerEvents:'none', zIndex:1 }} />
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:32, background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent)', pointerEvents:'none', zIndex:1 }} />
                  <span
                    key={reveal.tickKey}
                    style={{ fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: -1, animation: 'sc-roll 0.11s ease both' }}
                  >
                    {reveal.display}
                  </span>
                </div>
                <p style={{ margin: '14px 0 0', color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                  Picking...
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', position: 'relative' }}>
                {(['✨','🎉','⭐','💫','🌟'] as const).map((emoji, i) => (
                  <span key={i} style={{
                    position: 'absolute', fontSize: 30, pointerEvents: 'none',
                    animation: `sc-confetti 0.95s ease ${i * 0.08}s both`,
                    top: `${([-70, -45, -25, 15, -60] as number[])[i]}px`,
                    left: `${([-90, 125, -120, 105, -25] as number[])[i]}px`,
                  }}>
                    {emoji}
                  </span>
                ))}
                <div style={{
                  width: 280,
                  background: reveal.target.gradient,
                  borderRadius: 28,
                  padding: '36px 28px',
                  animation: 'sc-land 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(140deg,rgba(255,255,255,0.22) 0%,transparent 55%)', pointerEvents:'none' }} />
                  <p style={{ margin:'0 0 8px', color:'rgba(255,255,255,0.65)', fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase' }}>
                    This month
                  </p>
                  <p style={{ margin:0, color:'#fff', fontSize:44, fontWeight:900, letterSpacing:-1.5, lineHeight:1 }}>
                    {reveal.display}
                  </p>
                </div>
                <p style={{ margin:'18px 0 0', color:'rgba(255,255,255,0.35)', fontSize:13, fontWeight:600, letterSpacing:0.2 }}>
                  Let's clean it up...
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {showSortSheet && (
        <div
          style={{ position:'fixed', inset:0, background:theme.colors.overlay, display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:200, paddingBottom:72 }}
          onClick={() => setShowSortSheet(false)}
        >
          <div
            style={{ background:theme.colors.modal, borderRadius:'24px 24px 0 0', width:'100%', maxWidth:480, padding:'20px 16px 28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width:40, height:4, background:theme.colors.chevron, borderRadius:99, margin:'0 auto 20px' }} />
            <p style={{ margin:'0 0 14px 4px', fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:theme.colors.muted }}>Sort months by</p>
            {([
              { id:'newest'         as MonthSort, label:'Newest First',  sub:'Most recent month at top',     icon:'🕐' },
              { id:'oldest'         as MonthSort, label:'Oldest First',  sub:'Oldest month at top',          icon:'📅' },
              { id:'most-photos'    as MonthSort, label:'Most Photos',   sub:'Most items to review first',   icon:'📸' },
              { id:'fewest-photos'  as MonthSort, label:'Fewest Photos', sub:'Quickest to clean first',      icon:'✅' },
              { id:'most-storage'   as MonthSort, label:'Most Storage',  sub:'Biggest space savings first',  icon:'💾' },
            ]).map(({ id, label, sub, icon }) => {
              const active = monthSort === id;
              return (
                <button
                  key={id}
                  onClick={() => { setMonthSort(id); setShowSortSheet(false); }}
                  style={{
                    display:'flex', alignItems:'center', width:'100%',
                    padding:'12px 14px', marginBottom:6,
                    background: active ? theme.colors.primaryLight : theme.colors.inputBackground,
                    border:`1px solid ${active ? theme.colors.primary : theme.colors.divider}`,
                    borderRadius:14, cursor:'pointer', fontFamily:'inherit', textAlign:'left', gap:12,
                  }}
                >
                  <span style={{ fontSize:22 }}>{icon}</span>
                  <span style={{ flex:1 }}>
                    <span style={{ display:'block', fontSize:15, fontWeight:700, color:theme.colors.text }}>{label}</span>
                    <span style={{ display:'block', fontSize:12, color:theme.colors.muted, marginTop:1 }}>{sub}</span>
                  </span>
                  {active && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showPaywall && <PremiumModal onClose={() => setShowPaywall(false)} />}
      {showAlbumPicker && (
        <AlbumPickerModal
          onSelect={handleAlbumSelect}
          onClose={() => setShowAlbumPicker(false)}
        />
      )}
    </div>
  );
}

function AlbumPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (album: string) => void;
  onClose: () => void;
}) {
  const theme = useTheme();
  const albums = getMockAlbums();
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.overlay,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        paddingBottom: 72,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.modal,
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: 480,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + title */}
        <div style={{ padding: '20px 24px 16px', flexShrink: 0 }}>
          <div
            style={{
              width: 40,
              height: 4,
              background: theme.colors.chevron,
              borderRadius: 99,
              margin: '0 auto 20px',
            }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 900,
              color: theme.colors.text,
              letterSpacing: -0.5,
            }}
          >
            choose an album
          </h3>
          <p style={{ margin: '4px 0 0', color: theme.colors.muted, fontSize: 13 }}>
            {albums.reduce((s, a) => s + a.count, 0)} items across {albums.length} albums
          </p>
        </div>

        {/* Album list */}
        <div style={{ overflowY: 'auto', padding: '0 16px 24px' }}>
          {albums.map((album) => (
            <button
              key={album.name}
              onClick={() => onSelect(album.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '14px 16px',
                background: theme.colors.inputBackground,
                border: `1px solid ${theme.colors.divider}`,
                borderRadius: 14,
                marginBottom: 8,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 30 }}>
                  {album.name === 'Camera'
                    ? '📷'
                    : album.name === 'Screenshots'
                    ? '📸'
                    : album.name === 'WhatsApp'
                    ? '💬'
                    : '📁'}
                </span>
                <span style={{ fontSize: 17, fontWeight: 700, color: theme.colors.text }}>
                  {album.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.colors.muted,
                  background: theme.colors.inputBackground,
                  padding: '4px 10px',
                  borderRadius: 99,
                }}
              >
                {album.count} items
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PremiumModal({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  const pricing = {
    monthly: { price: '$4.99', period: '/month', note: 'Billed monthly' },
    annual: { price: '$2.99', period: '/month', note: 'Billed $35.99/year · Save 40%' },
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.overlay,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        paddingBottom: 72,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.modal,
          borderRadius: '24px 24px 0 0',
          padding: '28px 24px 32px',
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: theme.colors.chevron,
            borderRadius: 99,
            margin: '0 auto 20px',
          }}
        />
        <span style={{ fontSize: 48 }}>✨</span>
        <h3 style={{ margin: '10px 0 6px', fontSize: 24, fontWeight: 900, color: theme.colors.text }}>
          SwipeClean Pro
        </h3>
        <p style={{ color: theme.colors.muted, fontSize: 14, lineHeight: 1.55, margin: '0 0 22px' }}>
          Smart Cleanup, Large Videos, duplicate detection, blurry photo finder, and AI suggestions.
        </p>

        {/* Plan toggle */}
        <div
          style={{
            display: 'flex',
            background: theme.colors.inputBackground,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
            padding: 4,
            marginBottom: 16,
          }}
        >
          {(['monthly', 'annual'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: plan === p ? theme.colors.primary : 'transparent',
                border: 'none',
                borderRadius: 11,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 700,
                color: plan === p ? '#fff' : theme.colors.muted,
                transition: 'background 0.18s ease, color 0.18s ease',
                position: 'relative',
              }}
            >
              {p === 'annual' ? 'Annual' : 'Monthly'}
              {p === 'annual' && (
                <span
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: 10,
                    background: '#F59E0B',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: 0.8,
                    padding: '2px 6px',
                    borderRadius: 99,
                  }}
                >
                  SAVE 40%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Price display */}
        <div style={{ marginBottom: 22 }}>
          <span style={{ fontSize: 38, fontWeight: 900, color: theme.colors.text }}>
            {pricing[plan].price}
          </span>
          <span style={{ fontSize: 16, color: theme.colors.muted, fontWeight: 500 }}>
            {pricing[plan].period}
          </span>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: theme.colors.muted }}>
            {pricing[plan].note}
          </p>
        </div>

        <button
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            border: 'none',
            borderRadius: 99,
            fontSize: 17,
            fontWeight: 900,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 10,
            boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
          }}
          onClick={onClose}
        >
          Start Free Trial
        </button>
        <button
          style={{
            width: '100%',
            padding: '12px',
            background: 'none',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            color: theme.colors.muted,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
          onClick={onClose}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
