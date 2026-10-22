import { MapPin } from 'lucide-react';
import { mapsUrl } from '../utils/dataUtils.js';
export default function MapLink({ lat, lng }) {
  const url = mapsUrl(lat, lng);
  if (!url) return <span className="text-xs text-slate-400">Lokasi tidak tersedia</span>;
  return <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"><MapPin className="h-4 w-4" />Lihat Lokasi</a>;
}
