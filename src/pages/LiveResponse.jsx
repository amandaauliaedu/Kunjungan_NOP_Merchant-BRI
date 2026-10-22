import { RefreshCw, FileSpreadsheet } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import ReportTable from '../components/ReportTable.jsx';
import { LoadingState, ErrorState } from '../components/States.jsx';
import { useData } from '../hooks/useData.jsx';
import { COLUMNS } from '../utils/dataUtils.js';
import { exportVisits } from '../utils/exportExcel.js';
import { formatSync } from '../utils/dateUtils.js';

export default function LiveResponse() {
  const { data, loading, error, reload, updatedAt } = useData();
  return (<>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">Live Response</p>
        <h1 className="mt-1 text-3xl font-bold">Live Response</h1>
        <p className="text-slate-500">Data kunjungan merchant yang tercatat pada sistem</p>
        <p className="mt-1 font-mono text-xs text-slate-500">{data.length.toLocaleString('id-ID')} record · diperbarui {formatSync(updatedAt)}</p>
      </div>
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={reload} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</button>
        <button className="btn-primary" disabled={!data.length} onClick={() => exportVisits(data)}><FileSpreadsheet className="h-4 w-4" />Unduh Semua (Excel)</button>
      </div>
    </div>
    <GlassCard>
      {loading && !data.length ? <LoadingState /> : error && !data.length ? <ErrorState message={error} onRetry={reload} /> : <ReportTable rows={data} columns={COLUMNS} exportName="Live-Response-NOP-Merchant" />}
    </GlassCard>
  </>);
}
