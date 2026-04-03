import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LedgerPage() {
  const { t } = useTranslation();
  const [data, setData] = useState({ records: [], total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/ledger?page=${page}&limit=15`);
        setData(res.data);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [page]);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title"><BookOpen size={22} /> {t('ledger.title')}</h2>
        <span className="badge badge-blue">{data.total} records</span>
      </div>

      {loading ? (
        <div className="loading-state">{t('common.loading')}</div>
      ) : data.records.length === 0 ? (
        <div className="empty-state">{t('common.noData')}</div>
      ) : (
        <>
          <div className="chain-list">
            {data.records.map((record, index) => (
              <div key={record._id}>
                <div className={`chain-block ${record.fairPriceCompliant ? 'compliant' : 'violation'}`}>
                  <div className="chain-header">
                    <div>
                      <strong style={{ color: '#1e293b' }}>{record.cropType}</strong>
                      <span style={{ color: '#64748b', marginLeft: 8 }}>{record.farmerName}</span>
                    </div>
                    <span className={`badge ${record.fairPriceCompliant ? 'badge-compliant' : 'badge-violation'}`}>
                      {record.fairPriceCompliant ? 'Compliant' : 'Violation'}
                    </span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.875rem' }}>
                    {record.quantity} {record.unit}
                  </div>
                  <div className="chain-meta">
                    <span className="chain-hash">TX: {record.txHash}</span>
                    <span className="chain-block-num">Block #{record.blockNumber}</span>
                  </div>
                </div>
                {index < data.records.length - 1 && <div className="chain-connector" />}
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
            <span>Page {page} of {data.pages}</span>
            <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages}><ChevronRight size={16} /></button>
          </div>
        </>
      )}
    </div>
  );
}
