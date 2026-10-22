import { useState } from 'react';

// Logo BRI ada di public/assets/bri-logo.png. Jika file hilang, tampil monogram cadangan.
const LOGO_SRC = '/assets/bri-logo.png';

export default function BrandMark({ className = 'h-11 w-11' }) {
  const [failed, setFailed] = useState(false);
  if (!failed) return <img src={LOGO_SRC} alt="Logo BRI" className={`${className} object-contain`} onError={() => setFailed(true)} />;
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Kunjungan NOP Merchant">
      <rect width="64" height="64" rx="16" fill="#0857C3" />
      <path d="M22 15v34M22 32l21-15M22 32l21 15" stroke="#fff" strokeWidth="6.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
