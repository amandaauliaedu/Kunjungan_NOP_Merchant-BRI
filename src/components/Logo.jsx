import { useState } from 'react';
import { MapPin } from 'lucide-react';

// Taruh logo Anda di public/logo.png. Jika tidak ada, tampil lambang cadangan.
export default function Logo({ size = 44 }) {
  const [failed, setFailed] = useState(false);
  if (!failed) return <img src="/logo.png" alt="Logo" width={size} height={size} style={{ width: size, height: size }} className="object-contain" onError={() => setFailed(true)} />;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.24 }} className="grid place-items-center bg-brand text-white shadow-lg shadow-brand/30">
      <MapPin style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2.4} />
    </div>
  );
}
