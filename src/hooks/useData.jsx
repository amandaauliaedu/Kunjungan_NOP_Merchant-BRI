import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardData } from '../services/api.js';
const Ctx = createContext(null);
export function DataProvider({ children }) {
  const [s, set] = useState({ data: [], database: [], checks: null, status: 'CONNECTION ERROR', updatedAt: null, loading: true, error: null, errorInfo: null });
  const busy = useRef(false);
  const load = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    set((p) => ({ ...p, loading: true, error: null, errorInfo: null }));
    try {
      const r = await getDashboardData();
      set({ data: r.data || [], database: r.database || [], checks: r.checks || null, status: r.status || 'ACTIVE', updatedAt: r.updatedAt, loading: false, error: null, errorInfo: null });
    } catch (e) {
      set((p) => ({ ...p, status: 'CONNECTION ERROR', loading: false, error: e.message, errorInfo: { hints: e.hints || [], testUrl: e.testUrl || '' } }));
    } finally { busy.current = false; }
  }, []);
  useEffect(() => { load(); }, [load]);
  return <Ctx.Provider value={{ ...s, reload: load }}>{children}</Ctx.Provider>;
}
export const useData = () => useContext(Ctx);
