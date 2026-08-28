'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const FLOWER = '/images/pngtree-rose-burgian-watercolor-wedding-flower-png-image_3930540-removebg-preview.png';

/* All gallery images point to the same photo for now — swap in real ones later */
const GALLERY_IMAGES = [
  { src: '/images/couple-photo.jpeg', alt: 'Julian & Vivian – 1' },
  { src: '/images/couple-photo.jpeg', alt: 'Julian & Vivian – 2' },
  { src: '/images/couple-photo.jpeg', alt: 'Julian & Vivian – 3' },
  { src: '/images/couple-photo.jpeg', alt: 'Julian & Vivian – 4' },
  { src: '/images/couple-photo.jpeg', alt: 'Julian & Vivian – 5' },
];

/* ─────────────────────────────────────────
   Depth Carousel — pure CSS 3-D perspective
   Mirrors the DepthCarousel (react-bits pro)
   behaviour: centre card full-size, side cards
   recede in Z with tilt, blur and dim falloff.
───────────────────────────────────────────*/
const CARD_W  = 220;   // px  centre card width
const CARD_H  = 300;   // px  centre card height
const SPREAD  = 110;   // px  horizontal offset per step from centre
const DEPTH   = 160;   // px  Z retreat per step
const TILT    = 18;    // deg Y-rotation per step
const BLUR_F  = 3.5;   // px  extra blur per step
const DIM_F   = 0.28;  // opacity reduction per step
const VISIBLE = 2;     // cards shown each side of centre

function DepthCarousel({
  images,
  activeIdx,
  onSelect,
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
      {/* 3-D stage */}
      <div
        style={{
          height: CARD_H + 60,
          perspective: 1200,
          perspectiveOrigin: '50% 50%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {images.map((img, i) => {
          const offset = ((i - activeIdx + total) % total);
          // Normalise so offset is -floor(total/2)..+floor(total/2)
          const step = offset > Math.floor(total / 2) ? offset - total : offset;

          const absStep = Math.abs(step);
          if (absStep > VISIBLE) return null; // skip cards too far away

          const translateX = step * SPREAD;
          const translateZ = -(absStep * DEPTH);
          const rotateY    = -(step * TILT);
          const blur       = absStep * BLUR_F;
          const opacity    = 1 - absStep * DIM_F;
          const scale      = 1 - absStep * 0.06;
          const zIndex     = VISIBLE + 1 - absStep;

          return (
            <div
              key={i}
              onClick={() => step !== 0 && onSelect(i)}
              style={{
                position: 'absolute',
                top: 30,
                left: '50%',
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: step === 0
                  ? '0 16px 48px rgba(90,10,18,0.35)'
                  : '0 8px 24px rgba(0,0,0,0.2)',
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                filter: blur > 0 ? `blur(${blur}px)` : 'none',
                opacity,
                zIndex,
                transition: 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                cursor: step !== 0 ? 'pointer' : 'default',
                // dark tint overlay via box-shadow inset for side cards
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top"
                sizes={`${CARD_W}px`}
                draggable={false}
              />
              {/* tint overlay for side cards */}
              {absStep > 0 && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `rgba(5,6,10,${absStep * 0.18})`,
                  borderRadius: 16,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <button
          onClick={prev}
          aria-label="Previous"
          style={{
            background: 'none', border: '1px solid #b07070', borderRadius: '50%',
            width: 34, height: 34, cursor: 'pointer', color: '#6b0f1a',
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >‹</button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => onSelect(i)}
              style={{
                width: i === activeIdx ? 18 : 8,
                height: 8,
                borderRadius: 999,
                background: i === activeIdx ? '#6b0f1a' : '#c8a0a0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next"
          style={{
            background: 'none', border: '1px solid #b07070', borderRadius: '50%',
            width: 34, height: 34, cursor: 'pointer', color: '#6b0f1a',
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >›</button>
      </div>
    </div>
  );
}

const HEARTS = [
  { top: '8%',  left: '6%',   size: 18, color: '#c8a0a0', opacity: 0.55, delay: 0 },
  { top: '15%', left: '82%',  size: 14, color: '#e8c8c8', opacity: 0.45, delay: 0.6 },
  { top: '28%', left: '14%',  size: 22, color: '#d4a0a0', opacity: 0.5,  delay: 1.2 },
  { top: '38%', left: '91%',  size: 16, color: '#c8a0a0', opacity: 0.4,  delay: 1.8 },
  { top: '55%', left: '4%',   size: 20, color: '#e0b8b8', opacity: 0.5,  delay: 2.4 },
  { top: '62%', left: '88%',  size: 18, color: '#c8a0a0', opacity: 0.45, delay: 0.3 },
  { top: '72%', left: '22%',  size: 14, color: '#d4a0a0', opacity: 0.4,  delay: 1.0 },
  { top: '80%', left: '75%',  size: 22, color: '#e8c8c8', opacity: 0.5,  delay: 1.6 },
];

const SCHEDULE = [
  { time: '15:00', icon: '🎊', label: 'ស្វាគមន៍ភ្ញៀវ' },
  { time: '16:00', icon: '🥂', label: 'ចាប់ផ្តើមពិធីជប់លៀង' },
  { time: '16:30', icon: '💍', label: 'ពិធីអាពាហ៍ពិពាហ៍' },
  { time: '17:00', icon: '🎂', label: 'កាត់នំ និងជូនពរ' },
  { time: '20:30', icon: '✨', label: 'ឋានៈចប់' },
];

const MAY_2026 = [
  [null, null, null, null, null, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29, 30],
  [31, null, null, null, null, null, null],
];

const GUESTBOOK_SAMPLE = [
  { name: 'ហេនរី កូឡឺម៉ាន',   date: '7/8/2026 21:00 PM', msg: 'សូមអបអរសាទរលើពិធីអាពាហ៍ពិពាហ៍! រីករាយណាស់ដែលបានចូលរួមក្នុងរង្វង់នេះ។' },
  { name: 'ហ្គ្រេស មីតជែល',    date: '7/8/2026 21:06 PM', msg: 'គូស្នេហ៍ដ៏ស្រស់ស្អាតមួយ។ សូមឲ្យដំណើរជីវិតរួមគ្នារបស់អ្នករុងរឿងជារៀងរហូត!' },
  { name: 'វីល្យ៉ាម ហ្វូស្ទ័រ', date: '7/8/2026 21:09 PM', msg: 'សូមជូនពរ ជូលីញ និង វីវ្យាន មានសុភមង្គលបំផុតនៅលើផែនដី។ ស្រឡាញ់ទាំងពីរ!' },
  { name: 'ស្បែររ៉ូត រ៉ារ៉ាស', date: '7/8/2026 21:12 PM', msg: 'សូមស្នេហ៍ ស្រណោះ និងរស់នៅជាថ្ងៃស្អាត។ សូមអបអរ!' },
  { name: 'ជេមស ហូលីស',       date: '7/8/2026 21:15 PM', msg: 'អបអរសាទររូបទាំងពីរ! មិនអាចរង់ចាំបានទេ ដើម្បីរួមអបអរ​ថ្ងៃពិសេសនេះ។' },
];

export default function Home() {
  const [isLoaded, setIsLoaded]     = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isOpened, setIsOpened]     = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [wishName, setWishName]     = useState('');
  const [wishMsg, setWishMsg]       = useState('');
  const [wishes, setWishes]         = useState(GUESTBOOK_SAMPLE);

  useEffect(() => { setIsLoaded(true); }, []);

  const handleOpenClick = () => {
    setButtonPressed(true);
    setTimeout(() => setButtonPressed(false), 100);
    setIsOpened(true);
  };

  const submitWish = () => {
    if (!wishName.trim() || !wishMsg.trim()) return;
    const now = new Date();
    const dateStr = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')} ${now.getHours()>=12?'PM':'AM'}`;
    setWishes([{ name: wishName, date: dateStr, msg: wishMsg }, ...wishes]);
    setWishName(''); setWishMsg('');
  };

  /* ── shared styles ── */
  const sectionLabel: React.CSSProperties = {
    fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
    color: '#7a3030', fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif', textAlign: 'center', marginBottom: 16,
  };
  const darkCard: React.CSSProperties = {
    background: '#6b0f1a', borderRadius: 14,
    padding: '32px 28px', position: 'relative', overflow: 'hidden',
  };
  const khmer: React.CSSProperties = {
    fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif',
  };

  return (
    <div className="relative" style={{ background: '#f5ede6', minHeight: '100vh', fontFamily: 'var(--font-poppins), var(--font-khmer), sans-serif', overflowX: 'hidden' }}>

      {/* ── fixed dark-red bg for landing ── */}
      {!isOpened && (
        <>
          <div className="fixed inset-0" style={{ background: 'linear-gradient(135deg,#5a0a12 0%,#7a0f1a 50%,#5a0a12 100%)', zIndex: 0 }} />
          {HEARTS.map((h, i) => (
            <div key={i} className="fixed pointer-events-none animate-pulse"
              style={{ top: h.top, left: h.left, opacity: h.opacity, animationDelay: `${h.delay}s`, animationDuration: '3s', zIndex: 1 }}>
              <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="none">
                <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.691 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z"
                  stroke={h.color} strokeWidth="1.8" fill="none" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* ════════════════════════════════════
          LANDING CARD
      ════════════════════════════════════ */}
      {!isOpened && (
        <main className="flex items-center justify-center min-h-screen px-4 relative z-10">
          <div className={`relative transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ width: '100%', maxWidth: 560, background: '#f5ede6', borderRadius: 18,
              boxShadow: '0 20px 60px rgba(0,0,0,0.45)', padding: '40px 48px 36px', overflow: 'visible' }}>

            {/* Flower top-left */}
            <div className="absolute pointer-events-none" style={{ top: -28, left: -28, width: 150, height: 150, zIndex: 2 }}>
              <Image src={FLOWER} alt="" fill className="object-contain" />
            </div>
            {/* Flower bottom-right */}
            <div className="absolute pointer-events-none" style={{ bottom: -28, right: -28, width: 150, height: 150, zIndex: 2 }}>
              <Image src={FLOWER} alt="" fill className="object-contain" style={{ transform: 'rotate(180deg)' }} />
            </div>

            {/* Heart badge */}
            <div className="flex justify-center mb-5">
              <div className="flex items-center justify-center rounded-full"
                style={{ width: 52, height: 52, background: '#5a0a12', boxShadow: '0 4px 14px rgba(90,10,18,0.5)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.691 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" />
                </svg>
              </div>
            </div>

            {/* Names */}
            <div className="text-center" style={{ lineHeight: 1.15 }}>
              <p className="text-4xl md:text-5xl" style={{ color: '#6b0f1a', fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>Julian</p>
              <p className="text-2xl my-1"        style={{ color: '#6b0f1a', fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>&amp;</p>
              <p className="text-4xl md:text-5xl" style={{ color: '#6b0f1a', fontFamily: 'var(--font-poppins)', fontWeight: 300 }}>Vivian</p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 my-5">
              <div style={{ flex: 1, height: 1, background: '#b07070', opacity: 0.5 }} />
              <span style={{ color: '#8b4040', fontSize: 16 }}>❧</span>
              <div style={{ flex: 1, height: 1, background: '#b07070', opacity: 0.5 }} />
            </div>

            <p className="text-center text-base" style={{ color: '#6b0f1a', ...khmer }}>១៦ ឧសភា ២០២៦</p>
            <p className="text-center text-sm mt-2" style={{ color: '#5a3030', ...khmer }}>សូមគោរពអញ្ជើញ</p>

            <div className="flex justify-center mt-8">
              <button onClick={handleOpenClick}
                style={{ background: '#5a0a12', color: '#fff', border: 'none', borderRadius: 999,
                  padding: '11px 44px', fontSize: 15, cursor: 'pointer',
                  fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif',
                  boxShadow: '0 4px 18px rgba(90,10,18,0.45)', transform: buttonPressed ? 'scale(0.96)' : 'scale(1)',
                  transition: 'transform 0.15s' }}>
                បើក
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ════════════════════════════════════
          FULL INVITATION (scrollable)
      ════════════════════════════════════ */}
      {isOpened && (
        <div className="animate-in fade-in duration-700" style={{ background: '#f5ede6', overflowX: 'hidden' }}>
          <div className="mx-auto" style={{ maxWidth: 480, overflowX: 'hidden' }}>

            {/* ── 1. SAVE THE DATE / ENVELOPE ── */}
            <section className="pb-4 px-4" style={{ paddingTop: '22%', overflowX: 'clip', overflowY: 'visible' }}>
              <p style={sectionLabel}>កត់ត្រាកាលបរិច្ឆេទ</p>

              {/* Envelope wrapper */}
              <div className="relative w-full" style={{ overflow: 'visible' }}>

                {/* ── BASE: full envelope body (1013×1168) ── */}
                <Image src="/images/envelope-background.webp" alt="Envelope"
                  width={1013} height={1168} className="w-full h-auto" priority />

                {/* ── LAYER 1: Polaroid photo — sits inside opening, peeks above top edge ── */}
                <div className="absolute" style={{
                  top: '-10%',
                  left: '28%',
                  width: '64%',
                  zIndex: 10,
                  transform: 'rotate(5deg)',
                  transformOrigin: 'bottom center',
                }}>
                  <div className="bg-white shadow-2xl" style={{ padding: '8px 8px 26px' }}>
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
                      <Image src="/images/couple-photo.jpeg" alt="Julian & Vivian" fill
                        className="object-cover" style={{ objectPosition: 'center 20px' }} sizes="300px" />
                    </div>
                  </div>
                </div>

                {/* ── LAYER 2: Flower — left side, rooted at ~55% down, blooms upward ── */}
                <div className="absolute pointer-events-none" style={{
                  top: '5%',
                  left: '-5%',
                  width: '54%',
                  height: '72%',
                  zIndex: 15,
                }}>
                  <Image
                    src="/images/download-removebg-preview.png"
                    alt=""
                    fill
                    className="object-contain object-bottom"
                  />
                </div>

                {/* ── LAYER 3: Envelope front flap (1013×668) — bottom overlay, same width ── */}
                {/* Ratio: 668/1013 ≈ 65.9% of background height → sits at ~34% from top */}
                <div className="absolute pointer-events-none" style={{
                  bottom: 0,
                  left: 0,
                  right: 0,
                  /* height relative to container = (668/1168)*100 ≈ 57.2% */
                  height: '57.2%',
                  zIndex: 20,
                }}>
                  <Image src="/images/envelope-cover.webp" alt=""
                    fill className="object-fill" />
                </div>

                {/* ── LAYER 4: Wax seal — sits on the fold line of the front flap ── */}
                <div className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
                  style={{
                    /* fold line ≈ 57% from bottom = 43% from top */
                    bottom: '54%',
                    width: 58, height: 58, zIndex: 30,
                    background: 'radial-gradient(circle at 35% 35%, #ffe066, #c8960c)',
                    border: '3px solid #b8860b',
                    boxShadow: '0 4px 16px rgba(180,130,0,0.5)',
                  }}>
                  <span style={{ fontSize: 22, filter: 'drop-shadow(0 1px 2px #7a5800)' }}>♡</span>
                </div>

              </div>
            </section>

            {/* ── 2. NAMES ── */}
            <section className="py-8 px-4 text-center">
              <p className="text-4xl" style={{ color: '#6b0f1a', fontFamily: 'var(--font-poppins)', fontWeight: 300, fontStyle: 'italic' }}>Julian</p>
              <p className="text-xl my-1" style={{ color: '#9a4040' }}>❧</p>
              <p className="text-4xl" style={{ color: '#6b0f1a', fontFamily: 'var(--font-poppins)', fontWeight: 300, fontStyle: 'italic' }}>Vivian</p>
            </section>

            {/* ── 3. CEREMONY INFO ── */}
            <section className="px-4 pb-6">
              <div style={darkCard} className="relative">

                {/* Flower decoration right side */}
                <div className="absolute pointer-events-none" style={{ top: -30, right: -24, width: 130, height: 180, zIndex: 2 }}>
                  <Image src={FLOWER} alt="" fill className="object-contain" style={{ transform: 'scaleX(-1)' }} />
                </div>

                <p style={{ ...sectionLabel, ...khmer, color: '#e8c8c8', marginBottom: 20 }}>ព័ត៌មានពិធីការ</p>

                {/* Parents */}
                <div className="grid grid-cols-2 gap-4 mb-6" style={{ fontSize: 11, color: '#e8c8c8', textAlign: 'center', ...khmer }}>
                  <div>
                    <p style={{ color: '#f0d8d8', fontSize: 10 }}>លោក និង លោកស្រី</p>
                    <p className="font-semibold" style={{ color: '#fff' }}>រ៉ូប៊ឺត សាំងក្លែ</p>
                    <p>ហ្សាខ្លីន សាំងក្លែ</p>
                    <p style={{ fontSize: 10, opacity: 0.7 }}>ភ្នំពេញ, កម្ពុជា</p>
                  </div>
                  <div>
                    <p style={{ color: '#f0d8d8', fontSize: 10 }}>លោក និង លោកស្រី</p>
                    <p className="font-semibold" style={{ color: '#fff' }}>ចាលស ហេស</p>
                    <p>អេឡាណ័រ ហេស</p>
                    <p style={{ fontSize: 10, opacity: 0.7 }}>សៀមរាប, កម្ពុជា</p>
                  </div>
                </div>

                <p className="text-center mb-4" style={{ color: '#e8c8c8', fontSize: 11, ...khmer }}>
                  ដោយបេះដូងពោរពេញដោយអំណរ យើងខ្ញុំ<br />សូមប្រកាសការរៀបការរបស់កូនយើង
                </p>

                {/* Groom */}
                <p className="text-center text-3xl" style={{ color: '#fff', fontFamily: 'var(--font-poppins)', fontWeight: 300, fontStyle: 'italic' }}>
                  Julian Everett
                </p>
                <p className="text-center text-xs mt-1" style={{ color: '#e8b4b4', ...khmer }}>ជាកូនប្រុស</p>

                <p className="text-center text-2xl my-3" style={{ color: '#e8b4b4' }}>&amp;</p>

                {/* Bride */}
                <p className="text-center text-3xl" style={{ color: '#fff', fontFamily: 'var(--font-poppins)', fontWeight: 300, fontStyle: 'italic' }}>
                  Vivian Hayes
                </p>
                <p className="text-center text-xs mt-1" style={{ color: '#e8b4b4', ...khmer }}>ជាក្មេងស្រី</p>

                <div className="my-6" style={{ height: 1, background: 'rgba(255,255,255,0.15)' }} />

                <p className="text-center text-xs" style={{ color: '#e8c8c8', ...khmer }}>ពិធីអាពាហ៍ពិពាហ៍នឹងប្រព្រឹត្តទៅនៅ</p>
                <p className="text-center font-semibold mt-1" style={{ color: '#fff', ...khmer }}>ផ្ទះគ្រួសារ</p>
                <p className="text-center text-xs mt-1" style={{ color: '#e8b4b4', ...khmer }}>ម៉ោង ០៣:០០ · ថ្ងៃសៅរ៍</p>

                {/* Date display */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <p className="text-5xl font-bold" style={{ color: '#fff' }}>16</p>
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: '#fff', letterSpacing: '0.15em' }}>MAY</p>
                    <p className="text-sm" style={{ color: '#e8c8c8' }}>2026</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 4. PHOTO GALLERY — Depth Carousel ── */}
            <section className="pb-8">
              <p style={{ ...sectionLabel, paddingLeft: 16, paddingRight: 16 }}>វិចិត្រសាលរូបភាព</p>
              <DepthCarousel
                images={GALLERY_IMAGES}
                activeIdx={galleryIdx}
                onSelect={setGalleryIdx}
              />
            </section>

            {/* ── 5. RECEPTION INFO ── */}
            <section className="px-4 pb-6">
              <div style={darkCard} className="relative">

                {/* Flower decoration */}
                <div className="absolute pointer-events-none" style={{ bottom: -30, right: -20, width: 130, height: 160, zIndex: 2 }}>
                  <Image src={FLOWER} alt="" fill className="object-contain" style={{ transform: 'rotate(180deg) scaleX(-1)' }} />
                </div>

                <p style={{ ...sectionLabel, ...khmer, color: '#e8c8c8', marginBottom: 20 }}>ព័ត៌មានពិធីជប់លៀង</p>
                <p className="text-center font-semibold mb-6"
                  style={{ color: '#fff', fontSize: 13, ...khmer }}>
                  ពិធីជប់លៀងនឹងប្រព្រឹត្តទៅនៅ
                </p>

                <p className="text-center text-xs" style={{ color: '#e8c8c8', ...khmer }}>ថ្ងៃសៅរ៍ · ម៉ោង ១៧:០០</p>

                <div className="flex items-center justify-center gap-4 my-4">
                  <p className="text-5xl font-bold" style={{ color: '#fff' }}>16</p>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#fff', letterSpacing: '0.15em' }}>MAY</p>
                    <p className="text-sm" style={{ color: '#e8c8c8' }}>2026</p>
                  </div>
                </div>

                <div className="my-4" style={{ height: 1, background: 'rgba(255,255,255,0.15)' }} />

                <div className="grid grid-cols-2 gap-4" style={{ fontSize: 12, textAlign: 'center', color: '#e8c8c8' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#fff' }}>ស្វាគមន៍</p>
                    <p>16:30</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#fff' }}>ពិធីជប់លៀង</p>
                    <p>17:00</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. CALENDAR ── */}
            <section className="px-4 pb-6">
              <div style={darkCard}>
                <p className="text-center text-lg font-semibold mb-4"
                  style={{ color: '#fff', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>
                  ឧសភា ២០២៦
                </p>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['អា','ច','អ','ព','ព្រ','សុ','ស'].map(d => (
                    <p key={d} className="text-center text-xs font-semibold" style={{ color: '#e8b4b4' }}>{d}</p>
                  ))}
                </div>

                {/* Dates */}
                {MAY_2026.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 mb-1">
                    {week.map((day, di) => (
                      <div key={di} className="flex items-center justify-center" style={{ height: 30 }}>
                        {day && (
                          <div className="flex items-center justify-center rounded-full"
                            style={{
                              width: 26, height: 26,
                              background: day === 16 ? '#fff' : 'transparent',
                              position: 'relative',
                            }}>
                            {day === 16 && (
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="#6b0f1a"
                                style={{ position: 'absolute' }}>
                                <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.691 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" />
                              </svg>
                            )}
                            <span style={{
                              fontSize: 11, color: day === 16 ? '#fff' : '#e8c8c8',
                              position: 'relative', zIndex: 1, fontWeight: day === 16 ? 700 : 400,
                            }}>{day}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Add to calendar */}
                <div className="flex justify-center mt-5">
                  <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
                    color: '#fff', borderRadius: 999, padding: '8px 28px', fontSize: 12,
                    fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif', cursor: 'pointer' }}>
                    បន្ថែមទៅប្រតិទិន
                  </button>
                </div>

                {/* Confirm attendance */}
                <div className="flex justify-center mt-3">
                  <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.5)',
                    color: '#fff', borderRadius: 999, padding: '10px 32px', fontSize: 11,
                    fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif', cursor: 'pointer' }}>
                    បញ្ជាក់ការចូលរួម
                  </button>
                </div>
              </div>
            </section>

            {/* ── 7. VENUE ── */}
            <section className="px-4 pb-8 text-center">
              <p style={sectionLabel}>ទីតាំងពិធីជប់លៀង</p>
              <p style={{ color: '#4a2020', fontSize: 13, fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif' }}>សាលហ្គ្រែន បូលរូម, ផ្លូវ ២៥០, ភ្នំពេញ, កម្ពុជា</p>
            </section>

            {/* ── 8. DRESS CODE ── */}
            <section className="px-4 pb-8 text-center">
              <p style={sectionLabel}>រចនាប័ទ្មសំលៀកបំពាក់</p>
              <p className="mb-4" style={{ color: '#4a2020', fontSize: 13, fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif' }}>សំលៀកបំពាក់ពិធីជប់លៀង</p>
              <div className="flex justify-center gap-4">
                {['#6b0f1a', '#2d2d2d', '#c8a830'].map((c, i) => (
                  <div key={i} className="rounded-full shadow-md"
                    style={{ width: 36, height: 36, background: c,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }} />
                ))}
              </div>
            </section>

            {/* ── 9. WEDDING DAY SCHEDULE ── */}
            <section className="px-4 pb-6">
              <div style={darkCard} className="relative">

                {/* Flower right */}
                <div className="absolute pointer-events-none" style={{ top: -20, right: -20, width: 130, height: 170, zIndex: 2 }}>
                  <Image src={FLOWER} alt="" fill className="object-contain" style={{ transform: 'scaleX(-1)' }} />
                </div>

                <p style={{ ...sectionLabel, color: '#e8c8c8', marginBottom: 24 }}>កាលវិភាគថ្ងៃអាពាហ៍ពិពាហ៍</p>

                <div className="space-y-4" style={{ position: 'relative', zIndex: 3 }}>
                  {SCHEDULE.map((s, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span style={{ color: '#e8c8c8', fontSize: 13, minWidth: 42, fontVariantNumeric: 'tabular-nums' }}>
                        {s.time}
                      </span>
                      <div className="rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ width: 8, height: 8, background: '#e8b4b4' }} />
                      <span style={{ color: '#fff', fontSize: 13 }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 10. GUESTBOOK ── */}
            <section className="px-4 pb-12">
              <div className="rounded-2xl p-6 relative" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(90,10,18,0.1)' }}>

                {/* Flower bottom-left */}
                <div className="absolute pointer-events-none" style={{ bottom: -24, left: -16, width: 110, height: 130, zIndex: 2 }}>
                  <Image src={FLOWER} alt="" fill className="object-contain" />
                </div>

                <p style={{ ...sectionLabel, marginBottom: 20 }}>សៀវភៅបំណងប្រាថ្នា</p>

                {/* Input form */}
                <input
                  value={wishName}
                  onChange={e => setWishName(e.target.value)}
                  placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                  style={{ width: '100%', border: '1px solid #e0c8c8', borderRadius: 8,
                    padding: '10px 14px', fontSize: 13, marginBottom: 10, outline: 'none',
                    fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif',
                    color: '#4a2020', background: '#fffaf9', boxSizing: 'border-box' }}
                />
                <textarea
                  value={wishMsg}
                  onChange={e => setWishMsg(e.target.value)}
                  placeholder="បញ្ចូលបំណងប្រាថ្នារបស់អ្នក"
                  rows={3}
                  style={{ width: '100%', border: '1px solid #e0c8c8', borderRadius: 8,
                    padding: '10px 14px', fontSize: 13, marginBottom: 12, outline: 'none', resize: 'none',
                    fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif',
                    color: '#4a2020', background: '#fffaf9', boxSizing: 'border-box' }}
                />
                <div className="flex justify-end">
                  <button onClick={submitWish}
                    style={{ background: '#6b0f1a', color: '#fff', border: 'none', borderRadius: 999,
                      padding: '10px 28px', fontSize: 12,
                      fontFamily: 'var(--font-khmer), var(--font-poppins), sans-serif',
                      cursor: 'pointer' }}>
                    ផ្ញើបំណងប្រាថ្នា
                  </button>
                </div>

                {/* Messages */}
                <div className="mt-6 space-y-4">
                  {wishes.map((w, i) => (
                    <div key={i} style={{ borderBottom: '1px solid #f0e0e0', paddingBottom: 12 }}>
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-semibold" style={{ fontSize: 13, color: '#4a2020' }}>{w.name}</p>
                        <p style={{ fontSize: 10, color: '#b09090' }}>{w.date}</p>
                      </div>
                      <p style={{ fontSize: 12, color: '#6a4040', lineHeight: 1.6 }}>{w.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      )}
    </div>
  );
}
