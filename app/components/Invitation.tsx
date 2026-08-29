'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const FLOWER = '/images/flower1.png';

// ── Colour tokens ──────────────────────────────────────────────
const C = {
  primary:      '#e3c1c2',   // dusty rose — main accent
  primaryDark:  '#c49a9b',   // deeper rose — hover / borders
  primaryDeep:  '#a07070',   // richest rose — card bg, buttons
  bg:           '#fdf6f6',   // near-white warm background
  cardBg:       '#fdf6f6',   // landing card background
  textOnPrimary:'#fff',      // text on dark-rose cards
  textLabel:    '#9b6b6c',   // muted rose — section labels, sub-text
  textDark:     '#5a2d2e',   // dark rose — headings
  divider:      '#d4a8a9',   // soft divider line
  gold:         '#c8960c',   // kept for wax seal / ornament
};

const GALLERY_IMAGES = [
  { src: '/images/couple-photo.jpeg', alt: 'Von Nak & Barn Ravan – 1' },
  { src: '/images/couple-photo.jpeg', alt: 'Von Nak & Barn Ravan – 2' },
  { src: '/images/couple-photo.jpeg', alt: 'Von Nak & Barn Ravan – 3' },
  { src: '/images/couple-photo.jpeg', alt: 'Von Nak & Barn Ravan – 4' },
  { src: '/images/couple-photo.jpeg', alt: 'Von Nak & Barn Ravan – 5' },
];

const CARD_W  = 220;
const CARD_H  = 300;
const SPREAD  = 110;
const DEPTH   = 160;
const TILT    = 18;
const BLUR_F  = 3.5;
const DIM_F   = 0.28;
const VISIBLE = 2;

function DepthCarousel({
  images, activeIdx, onSelect,
}: {
  images: { src: string; alt: string }[];
  activeIdx: number;
  onSelect: (i: number) => void;
}) {
  const total = images.length;
  const prev = () => onSelect((activeIdx - 1 + total) % total);
  const next = () => onSelect((activeIdx + 1) % total);

  return (
    <div style={{ userSelect: 'none' }}>
      <div style={{ height: CARD_H + 60, perspective: 1200, perspectiveOrigin: '50% 50%', position: 'relative', overflow: 'hidden' }}>
        {images.map((img, i) => {
          const offset  = ((i - activeIdx + total) % total);
          const step    = offset > Math.floor(total / 2) ? offset - total : offset;
          const absStep = Math.abs(step);
          if (absStep > VISIBLE) return null;
          const translateX = step * SPREAD;
          const translateZ = -(absStep * DEPTH);
          const rotateY    = -(step * TILT);
          const blur       = absStep * BLUR_F;
          const opacity    = 1 - absStep * DIM_F;
          const scale      = 1 - absStep * 0.06;
          const zIndex     = VISIBLE + 1 - absStep;
          return (
            <div key={i} onClick={() => step !== 0 && onSelect(i)}
              style={{
                position: 'absolute', top: 30, left: '50%',
                width: CARD_W, height: CARD_H, marginLeft: -CARD_W / 2,
                borderRadius: 16, overflow: 'hidden',
                boxShadow: step === 0
                  ? `0 16px 48px rgba(196,154,155,0.45)`
                  : '0 8px 24px rgba(0,0,0,0.15)',
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                filter: blur > 0 ? `blur(${blur}px)` : 'none',
                opacity, zIndex,
                transition: 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                cursor: step !== 0 ? 'pointer' : 'default',
              }}>
              <Image src={img.src} alt={img.alt} fill className="object-cover object-top" sizes={`${CARD_W}px`} draggable={false} />
              {absStep > 0 && (
                <div style={{ position: 'absolute', inset: 0, background: `rgba(90,45,46,${absStep * 0.18})`, borderRadius: 16 }} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 mt-2">
        <button onClick={prev} aria-label="Previous"
          style={{ background: 'none', border: `1px solid ${C.divider}`, borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', color: C.primaryDeep, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        <div className="flex gap-2">
          {images.map((_, i) => (
            <div key={i} onClick={() => onSelect(i)}
              style={{ width: i === activeIdx ? 18 : 8, height: 8, borderRadius: 999, background: i === activeIdx ? C.primaryDeep : C.divider, cursor: 'pointer', transition: 'all 0.3s ease' }} />
          ))}
        </div>
        <button onClick={next} aria-label="Next"
          style={{ background: 'none', border: `1px solid ${C.divider}`, borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', color: C.primaryDeep, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
      </div>
    </div>
  );
}

const HEARTS = [
  { top: '8%',  left: '6%',   size: 18, color: '#e3c1c2', opacity: 0.55, delay: 0 },
  { top: '15%', left: '82%',  size: 14, color: '#f0d4d5', opacity: 0.45, delay: 0.6 },
  { top: '28%', left: '14%',  size: 22, color: '#d4a8a9', opacity: 0.5,  delay: 1.2 },
  { top: '38%', left: '91%',  size: 16, color: '#e3c1c2', opacity: 0.4,  delay: 1.8 },
  { top: '55%', left: '4%',   size: 20, color: '#eacbcc', opacity: 0.5,  delay: 2.4 },
  { top: '62%', left: '88%',  size: 18, color: '#e3c1c2', opacity: 0.45, delay: 0.3 },
  { top: '72%', left: '22%',  size: 14, color: '#d4a8a9', opacity: 0.4,  delay: 1.0 },
  { top: '80%', left: '75%',  size: 22, color: '#f0d4d5', opacity: 0.5,  delay: 1.6 },
];

const F: React.CSSProperties = { fontFamily: 'var(--font-poppins), sans-serif' };

export default function Invitation({ guestName }: { guestName?: string }) {
  const [isLoaded, setIsLoaded]           = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isOpened, setIsOpened]           = useState(false);
  const [galleryIdx, setGalleryIdx]       = useState(0);
  const [isPlaying, setIsPlaying]         = useState(false);
  const audioRef                          = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { setIsLoaded(true); }, []);

  useEffect(() => {
    const audio = new Audio('/music/music.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
  };

  const handleOpen = () => {
    setButtonPressed(true);
    setTimeout(() => setButtonPressed(false), 100);
    setIsOpened(true);
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 15, letterSpacing: '0.3em', textTransform: 'uppercase',
    color: C.primaryDeep, ...F, textAlign: 'center', marginBottom: 16,
  };

  const darkCard: React.CSSProperties = {
    background: `linear-gradient(135deg, ${C.primaryDeep} 0%, ${C.primaryDark} 100%)`,
    borderRadius: 14, padding: '32px 28px', position: 'relative', overflow: 'hidden',
  };

  return (
    <div className="relative" style={{ background: C.bg, minHeight: '100vh', ...F, overflowX: 'hidden' }}>

      {/* ── LANDING BACKGROUND ── */}
      {!isOpened && (
        <>
          <div className="fixed inset-0" style={{
            background: `linear-gradient(135deg, ${C.primaryDeep} 0%, ${C.primary} 50%, ${C.primaryDeep} 100%)`,
            zIndex: 0,
          }} />
          {HEARTS.map((h, i) => (
            <div key={i} className="fixed pointer-events-none animate-pulse"
              style={{ top: h.top, left: h.left, opacity: h.opacity, animationDelay: `${h.delay}s`, animationDuration: '3s', zIndex: 1 }}>
              <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.691 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" stroke={h.color} strokeWidth="1.8" fill="none" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* ── LANDING CARD ── */}
      {!isOpened && (
        <main className="flex items-center justify-center min-h-screen px-4 relative z-10">
          <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ width: '100%', maxWidth: 560 }}>


            {/* Card */}
            <div className="relative w-full"
              style={{ background: C.cardBg, borderRadius: 18, boxShadow: '0 20px 60px rgba(90,45,46,0.35)', padding: '40px 48px 36px', overflow: 'visible' }}>

              {/* Flowers */}
              <div className="absolute pointer-events-none" style={{ top: -28, left: -28, width: 150, height: 150, zIndex: 2 }}>
                <Image src={FLOWER} alt="" fill className="object-contain" />
              </div>
              <div className="absolute pointer-events-none" style={{ bottom: -28, right: -28, width: 150, height: 150, zIndex: 2 }}>
                <Image src={FLOWER} alt="" fill className="object-contain" style={{ transform: 'rotate(180deg)' }} />
              </div>

              {/* Heart badge */}
              <div className="flex justify-center mb-5">
                <div className="flex items-center justify-center rounded-full"
                  style={{ width: 52, height: 52, background: C.primaryDeep, boxShadow: `0 4px 14px rgba(196,154,155,0.6)` }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.691 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" />
                  </svg>
                </div>
              </div>

              {/* Couple names */}
              <div className="text-center" style={{ lineHeight: 1.15 }}>
                <p className="text-4xl md:text-5xl" style={{ color: C.primaryDeep, fontWeight: 300 }}>Von Nak</p>
                <p className="text-2xl my-1" style={{ color: C.primaryDark, fontWeight: 300 }}>&amp;</p>
                <p className="text-4xl md:text-5xl" style={{ color: C.primaryDeep, fontWeight: 300 }}>Barn Ravan</p>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 my-5">
                <div style={{ flex: 1, height: 1, background: C.divider, opacity: 0.7 }} />
                <span style={{ color: C.primaryDark, fontSize: 16 }}>❧</span>
                <div style={{ flex: 1, height: 1, background: C.divider, opacity: 0.7 }} />
              </div>

              <p className="text-center text-base" style={{ color: C.primaryDeep, letterSpacing: '0.1em' }}>04, October 2026</p>
              <p className="text-center text-sm mt-2" style={{ color: C.textLabel, letterSpacing: '0.08em' }}>Cordially Invites</p>

              {guestName && (
                <p className="text-center mt-1" style={{ color: C.primaryDeep, fontSize: 25, fontWeight: 600, fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif' }}>
                  {guestName}
                </p>
              )}

              <div className="flex justify-center mt-6">
                <button onClick={handleOpen}
                  style={{ background: C.primaryDeep, color: '#fff', border: 'none', borderRadius: 999, padding: '11px 44px', fontSize: 15, letterSpacing: '0.1em', cursor: 'pointer', boxShadow: `0 4px 18px rgba(160,112,112,0.5)`, transform: buttonPressed ? 'scale(0.96)' : 'scale(1)', transition: 'transform 0.15s' }}>
                  Open
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── FULL SCROLLABLE INVITATION ── */}
      {isOpened && (
        <div className="animate-in fade-in duration-700" style={{ background: C.bg, overflowX: 'hidden' }}>
          <div className="mx-auto" style={{ maxWidth: 480, overflowX: 'hidden' }}>

            {/* 1. ENVELOPE */}
            <section className="pb-4 px-4" style={{ paddingTop: '22%', overflowX: 'clip', overflowY: 'visible' }}>
              <div className="relative w-full" style={{ overflow: 'visible' }}>
                <Image src="/images/envelope-background1.png" alt="Envelope" width={1013} height={1168} className="w-full h-auto" priority />
                <div className="absolute" style={{ top: '-10%', left: '28%', width: '64%', zIndex: 10, transform: 'rotate(5deg)', transformOrigin: 'bottom center' }}>
                  <div className="bg-white shadow-2xl" style={{ padding: '8px 8px 26px' }}>
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
                      <Image src="/images/couple-photo.jpeg" alt="Von Nak & Barn Ravan" fill className="object-cover" style={{ objectPosition: 'center 20px' }} sizes="300px" />
                    </div>
                  </div>
                </div>
                <div className="absolute pointer-events-none" style={{ top: '5%', left: '-5%', width: '54%', height: '72%', zIndex: 15 }}>
                  <Image src="/images/download-removebg-preview.png" alt="" fill className="object-contain object-bottom" />
                </div>
                <div className="absolute pointer-events-none" style={{ bottom: 0, left: 0, right: 0, height: '57.2%', zIndex: 20 }}>
                  <Image src="/images/envelope-cover1.png" alt="" fill className="object-fill" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
                  style={{ bottom: '54%', width: 58, height: 58, zIndex: 30, background: 'radial-gradient(circle at 35% 35%,#ffe066,#c8960c)', border: '3px solid #b8860b', boxShadow: '0 4px 16px rgba(180,130,0,0.5)' }}>
                  <span style={{ fontSize: 22, filter: 'drop-shadow(0 1px 2px #7a5800)' }}>♡</span>
                </div>
              </div>
            </section>

            {/* 2. NAMES */}
            <section className="py-8 px-4 text-center">
              <p className="text-4xl" style={{ color: C.primaryDeep, fontWeight: 300, fontStyle: 'italic' }}>Von Nak</p>
              <p className="text-xl my-1" style={{ color: C.primaryDark }}>❧</p>
              <p className="text-4xl" style={{ color: C.primaryDeep, fontWeight: 300, fontStyle: 'italic' }}>Barn Ravan</p>
            </section>

            {/* 3. GALLERY */}
            <section className="pb-8">
              <p style={{ ...sectionLabel, paddingLeft: 16, paddingRight: 16 }}>Photo Gallery</p>
              <DepthCarousel images={GALLERY_IMAGES} activeIdx={galleryIdx} onSelect={setGalleryIdx} />
            </section>

            {/* 4. ENGAGEMENT INFO */}
            <section className="px-4 pb-6">
              <div style={darkCard} className="relative">

                <div className="absolute pointer-events-none" style={{ top: -24, right: -16, width: 120, height: 150, zIndex: 2 }}>
                  <Image src={FLOWER} alt="" fill className="object-contain" style={{ transform: 'scaleX(-1)' }} />
                </div>

                <p style={{ ...sectionLabel, color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>Engagement Ceremony</p>

                <div className="flex items-stretch" style={{ position: 'relative', zIndex: 3, marginBottom: 20 }}>
                  {/* Left — big date */}
                  <div className="flex flex-col items-center justify-center"
                    style={{ minWidth: 88, borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: 20 }}>
                    <p style={{ fontSize: 68, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-2px' }}>04</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.2em', marginTop: 4 }}>OCT</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>2026</p>
                  </div>
                  {/* Right — details */}
                  <div className="flex flex-col justify-center gap-3" style={{ paddingLeft: 20, flex: 1 }}>
                    <div>
                      <p style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', marginBottom: 2 }}>Day</p>
                      <p style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>Sunday</p>
                    </div>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.15)' }} />
                    <div>
                      <p style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', marginBottom: 2 }}>Time</p>
                      <p style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>08:00 PM</p>
                    </div>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.15)' }} />
                    <div>
                      <p style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', marginBottom: 2 }}>Location</p>
                      <p style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>Pou Khpuos</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Prey Veng Province,
Cambodia</p>
                    </div>
                  </div>
                </div>

                {/* Gold ornament divider */}
                <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 3, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(200,150,12,0.6))' }} />
                  <span style={{ color: C.gold, fontSize: 18 }}>❦</span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(200,150,12,0.6))' }} />
                </div>
              </div>
            </section>

            {/* 5. VENUE */}
            <section className="px-4 pb-8">
              <p style={sectionLabel}>Venue</p>
              <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: `0 4px 24px rgba(160,112,112,0.15)` }}>

                <div style={{ position: 'relative', width: '100%', height: 160, background: '#f0e8e8' }}>
                  <iframe
                    title="Venue Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3909!2d104.9!3d11.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310bcd000cca0d49%3A0x31ad68f70f8394c5!2sPrey%20Sdau!5e0!3m2!1sen!2skh!4v1"
                    width="100%" height="160"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', pointerEvents: 'none', zIndex: 5 }}>
                    <div style={{ width: 28, height: 28, background: C.primaryDeep, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', boxShadow: `0 2px 8px rgba(160,112,112,0.5)` }} />
                  </div>
                </div>

                <div style={{ padding: '16px 20px 20px' }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={C.primaryDeep} />
                        <circle cx="12" cy="9" r="2.5" fill="#fff" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-khmer" style={{ fontWeight: 600, fontSize: 14, color: C.textDark, marginBottom: 2, fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif' }}>
                        វត្តសិរីសុខារកាដុះ
                      </p>
                      <p style={{ fontSize: 12, color: C.textLabel, lineHeight: 1.5 }}>
                        Pou Khpuos, Prey Veng Province,<br />Cambodia
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://maps.app.goo.gl/Gemrs5JCroNRGCU27"
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      marginTop: 14, width: '100%', padding: '10px 0',
                      background: C.primaryDeep, color: '#fff', borderRadius: 999,
                      fontSize: 12, letterSpacing: '0.1em', textDecoration: 'none',
                      boxShadow: `0 3px 12px rgba(160,112,112,0.35)`,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" />
                      <circle cx="12" cy="9" r="2.5" fill={C.primaryDeep} />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>
      )}

      {/* ── FLOATING MUSIC PLAYER ── */}
      <div style={{ position: 'fixed', bottom: 28, right: 20, zIndex: 100 }}>
        {isPlaying && (
          <>
            <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `2px solid rgba(196,154,155,0.45)`, animation: 'musicPulse 1.8s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: `1.5px solid rgba(196,154,155,0.22)`, animation: 'musicPulse 1.8s ease-out infinite 0.5s' }} />
          </>
        )}
        <button
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          style={{
            width: 50, height: 50, borderRadius: '50%',
            background: isPlaying
              ? `linear-gradient(135deg, ${C.primaryDeep}, ${C.primaryDark})`
              : `rgba(160,112,112,0.82)`,
            border: '2px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 4px 20px rgba(160,112,112,0.55)`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.3s ease',
            position: 'relative',
          }}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <rect x="5"  y="4" width="4" height="16" rx="1.5" />
              <rect x="15" y="4" width="4" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M9 17H5a2 2 0 0 0 0 4 2 2 0 0 0 2-2h2V5l10-2v12h-4a2 2 0 0 0 0 4 2 2 0 0 0 2-2h2V2L9 4v13z" />
            </svg>
          )}
        </button>
      </div>

      <style>{`
        @keyframes musicPulse {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
