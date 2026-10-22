import { AlertTriangle, Inbox, RefreshCw, ExternalLink } from 'lucide-react';
import { useData } from '../hooks/useData.jsx';
export const LoadingState = () => (
  <div className="space-y-3 p-4" aria-busy="true" aria-live="polite">{[...Array(6)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-brand/10" />)}</div>
);
export const EmptyState = ({ text = 'Tidak ada data yang cocok. Ubah kata kunci atau reset filter.' }) => (
  <div className="flex flex-col items-center gap-2 p-10 text-center text-slate-500"><Inbox className="h-8 w-8 text-brand" /><p>{text}</p></div>
);
export const ErrorState = ({ message, onRetry }) => {
  const { errorInfo } = useData() || {};
  const hints = errorInfo?.hints || []; const testUrl = errorInfo?.testUrl;
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center" role="alert">
      <AlertTriangle className="h-8 w-8 text-red-600" /><p className="max-w-xl text-sm font-medium text-red-700">{message}</p>
      {hints.length > 0 && <ul className="max-w-2xl list-disc space-y-1 pl-5 text-left text-xs text-slate-600">{hints.map((h) => <li key={h}>{h}</li>)}</ul>}
      <div className="flex flex-wrap justify-center gap-2">
        <button className="btn-primary" onClick={onRetry}><RefreshCw className="h-4 w-4" />Coba lagi</button>
        {testUrl && <a className="btn-secondary" href={testUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />Uji URL backend</a>}
      </div>
    </div>
  );
};
