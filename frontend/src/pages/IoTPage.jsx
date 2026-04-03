import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';
import toast from 'react-hot-toast';
import { Thermometer, Droplets, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import TelemetryModule from '../components/TelemetryModule';

const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.9)',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '0.8rem',
      color: 'rgba(255,255,255,0.87)',
    }}>
      <p style={{ marginBottom: 4, color: 'rgba(255,255,255,0.5)' }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
      ))}
    </div>
  );
};

export default function IoTPage() {
  const { t } = useTranslation();
  const [shipments, setShipments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    api.get('/gis/shipments').then((r) => { setShipments(r.data); if (r.data[0]) setSelectedId(r.data[0]._id); }).catch(() => {});
    api.get('/iot/alerts').then((r) => setAlerts(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api.get(`/iot/readings/${selectedId}`).then((r) => setReadings(r.data)).catch(() => {});
  }, [selectedId]);

  const simulate = async () => {
    if (!selectedId) { toast.error('Select a shipment first'); return; }
    setSimLoading(true);
    try {
      const r = await api.post(`/iot/simulate/${selectedId}`);
      setReadings(r.data.readings);
      toast.success(`Simulated ${r.data.inserted} readings`);
    } catch (err) { toast.error(err.response?.data?.message || t('common.error')); }
    finally { setSimLoading(false); }
  };

  const chartData = readings.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: r.temperature,
    humidity: r.humidity,
    alert: r.alert,
  }));

  const latestReading = readings[readings.length - 1];
  const latestTemp = latestReading?.temperature;
  const latestHum = latestReading?.humidity;
  const activeAlerts = readings.filter((r) => r.alert);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title"><Thermometer size={22} /> {t('iot.title')}</h2>
        <div className="header-actions">
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="select-input">
            <option value="">Select Shipment</option>
            {shipments.map((s) => <option key={s._id} value={s._id}>{s.shipmentId?.slice(0, 12)} — {s.origin?.address}</option>)}
          </select>
          <button className="btn-secondary" onClick={simulate} disabled={simLoading}>
            {simLoading ? <Loader2 size={16} className="spin" /> : t('iot.simulate')}
          </button>
        </div>
      </div>

      {/* Live Gauges */}
      <div className="iot-gauges">
        <TelemetryModule
          value={latestReading?.temperature}
          max={50}
          unit="°C"
          label="Temperature"
          icon={Thermometer}
          isAlert={latestReading?.alert}
        />
        <TelemetryModule
          value={latestReading?.humidity}
          max={100}
          unit="%"
          label="Humidity"
          icon={Droplets}
          isAlert={latestReading?.humidity > 90}
        />
        <div className={`gauge-card ${activeAlerts.length > 0 ? 'alert' : 'ok'}`}>
          {activeAlerts.length > 0 ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
          <div className="gauge-value">{activeAlerts.length}</div>
          <div className="gauge-label">{t('iot.alerts')}</div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="chart-card">
          <h3>Temperature & Humidity Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)', fontFamily: 'Roboto Mono, monospace' }} />
              <YAxis yAxisId="temp" domain={[0, 50]} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)', fontFamily: 'Roboto Mono, monospace' }} />
              <YAxis yAxisId="hum" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)', fontFamily: 'Roboto Mono, monospace' }} />
              <Tooltip content={<GlassTooltip />} />
              <Legend />
              <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#fb923c" strokeWidth={2} dot={false} name="Temp (°C)" />
              <Line yAxisId="hum" type="monotone" dataKey="humidity" stroke="#22d3ee" strokeWidth={2} dot={false} name="Humidity (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty-state">{selectedId ? 'No readings yet. Click Simulate.' : 'Select a shipment to view data.'}</div>
      )}

      {/* Alert List */}
      <div className="section">
        <h3 className="section-title">{t('iot.alerts')}</h3>
        {alerts.length === 0 ? (
          <div className="empty-state ok"><CheckCircle size={20} /> {t('iot.noAlerts')}</div>
        ) : (
          <div className="alert-list">
            {alerts.slice(0, 10).map((a) => (
              <div key={a._id} className="alert-row">
                <AlertTriangle size={16} className="red" />
                <span>{a.alertMessage}</span>
                <span className="alert-time">{new Date(a.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
