import React, { useState } from 'react';
import type { View } from '../types';
import { getPrefs, savePrefs, exportAllData, importAllData } from '../store';
import { ShareIcon, DownloadIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

export default function Settings({ onNavigate }: Props) {
  const [prefs, setPrefs] = useState(getPrefs);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof prefs>(key: K, value: typeof prefs[K]) {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    savePrefs(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleExport() {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        importAllData(ev.target?.result as string);
        window.location.reload();
      } catch {
        alert('Arquivo inválido ou corrompido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div style={{ flex: 1 }}>
          <div className="label-xs" style={{ marginBottom: 4 }}>Preferências</div>
          <h1 className="page-title">Configurações</h1>
        </div>
        {saved && <span className="badge badge-success">Salvo</span>}
      </div>
      <div className="page-inner">

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div className="label-xs" style={{ marginBottom: 10 }}>Unidades</div>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14 }}>Unidade de peso</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['kg', 'lb'] as const).map(unit => (
                    <button
                      key={unit}
                      className={`chip ${prefs.weightUnit === unit ? 'on' : ''}`}
                      onClick={() => update('weightUnit', unit)}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="label-xs" style={{ marginBottom: 10 }}>Timer de descanso</div>
            <div className="card">
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14 }}>Tempo padrão (segundos)</span>
                <input
                  type="number"
                  className="field"
                  style={{ width: 90, textAlign: 'center' }}
                  value={prefs.restTimerDefault}
                  min={0}
                  max={600}
                  onChange={e => update('restTimerDefault', e.target.value === '' ? 0 : Math.min(600, parseInt(e.target.value) || 0))}
                />
              </label>
            </div>
          </div>

          <div>
            <div className="label-xs" style={{ marginBottom: 10 }}>Dados por série</div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'showRIR' as const, label: 'RIR (Reps in Reserve)', desc: 'Quanto faltava para a falha' },
                { key: 'showRPE' as const, label: 'RPE (Rate of Perceived Exertion)', desc: 'Escala de esforço percebido' },
              ].map(({ key, label, desc }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: 14 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#525259', marginTop: 2 }}>{desc}</div>
                  </div>
                  <div
                    style={{
                      width: 42, height: 24, borderRadius: 12, flexShrink: 0, marginTop: 2,
                      background: prefs[key] ? '#C8A96E' : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.2s',
                      position: 'relative',
                    }}
                    onClick={() => update(key, !prefs[key])}
                  >
                    <div style={{
                      position: 'absolute', top: 2, left: prefs[key] ? 20 : 2,
                      width: 20, height: 20, borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                    }} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="label-xs" style={{ marginBottom: 10 }}>Dados</div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-ghost btn-full" onClick={handleExport}>
                <ShareIcon size={16} />
                Exportar backup (JSON)
              </button>
              <label className="btn btn-ghost btn-full" style={{ cursor: 'pointer' }}>
                <DownloadIcon size={16} />
                Importar backup
                <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
