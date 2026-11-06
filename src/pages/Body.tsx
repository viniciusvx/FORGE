import React, { useState } from 'react';
import type { View, BodyMeasurement } from '../types';
import { getMeasurements, saveMeasurement, deleteMeasurement, uid, getPrefs } from '../store';
import { PlusIcon, XIcon } from '../components/Icons';
import Sheet from '../components/Sheet';

interface Props { onNavigate: (v: View) => void; }

function emptyMeasurement(): BodyMeasurement {
  return {
    id: uid(),
    date: Date.now(),
    weightUnit: 'kg',
    notes: '',
  };
}

interface AddSheetProps {
  onSave: (m: BodyMeasurement) => void;
  onClose: () => void;
}

function AddSheet({ onSave, onClose }: AddSheetProps) {
  const prefs = getPrefs();
  const [m, setM] = useState<BodyMeasurement>({ ...emptyMeasurement(), weightUnit: prefs.weightUnit });
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));

  function patch(key: keyof BodyMeasurement, value: unknown) {
    setM(prev => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave({ ...m, date: new Date(dateStr).getTime() });
    onClose();
  }

  const fields: { key: keyof BodyMeasurement; label: string }[] = [
    { key: 'weight', label: `Peso (${m.weightUnit})` },
    { key: 'bodyFat', label: 'Gordura (%)' },
    { key: 'chest', label: 'Peitoral (cm)' },
    { key: 'waist', label: 'Cintura (cm)' },
    { key: 'hips', label: 'Quadril (cm)' },
    { key: 'leftArm', label: 'Braço E (cm)' },
    { key: 'rightArm', label: 'Braço D (cm)' },
    { key: 'leftThigh', label: 'Coxa E (cm)' },
    { key: 'rightThigh', label: 'Coxa D (cm)' },
  ];

  return (
    <Sheet title="Nova medição" onClose={onClose}
      footer={<button className="btn btn-primary btn-full" onClick={handleSave}>Salvar medição</button>}>
      <div style={{ padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label className="label-xs" style={{ display: 'block', marginBottom: 6 }}>Data</label>
          <input type="date" className="field" value={dateStr} onChange={e => setDateStr(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="label-xs" style={{ display: 'block', marginBottom: 4 }}>{label}</label>
              <input type="number" inputMode="decimal" className="field" placeholder="—"
                value={(m[key] as number | undefined) ?? ''}
                onChange={e => patch(key, e.target.value === '' ? undefined : parseFloat(e.target.value))} />
            </div>
          ))}
        </div>
        <div>
          <label className="label-xs" style={{ display: 'block', marginBottom: 4 }}>Notas</label>
          <input className="field" placeholder="Observações..." value={m.notes} onChange={e => patch('notes', e.target.value)} />
        </div>
      </div>
    </Sheet>
  );
}

export default function Body({ onNavigate }: Props) {
  const [measurements, setMeasurements] = useState(getMeasurements);
  const [showAdd, setShowAdd] = useState(false);

  function handleSave(m: BodyMeasurement) {
    saveMeasurement(m);
    setMeasurements(getMeasurements());
  }

  function handleDelete(id: string) {
    deleteMeasurement(id);
    setMeasurements(getMeasurements());
  }

  const latest = measurements[0];
  const prev = measurements[1];

  function diff(key: keyof BodyMeasurement) {
    if (!latest || !prev) return null;
    const a = latest[key] as number | undefined;
    const b = prev[key] as number | undefined;
    if (a == null || b == null) return null;
    const d = a - b;
    return d === 0 ? null : d;
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div style={{ flex: 1 }}>
          <div className="label-xs" style={{ marginBottom: 4 }}>Corpo</div>
          <h1 className="page-title">Medidas</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <PlusIcon size={16} /> Nova
        </button>
      </div>
      <div className="page-inner">

        {measurements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Sem medidas registradas</div>
            <div style={{ fontSize: 13, color: '#525259', marginBottom: 20 }}>Registre peso, medidas e gordura corporal.</div>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}><PlusIcon size={16} /> Adicionar</button>
          </div>
        ) : (
          <>
            {latest && (
              <div style={{ marginBottom: 24 }}>
                <div className="label-xs" style={{ marginBottom: 12 }}>Última medição · {new Date(latest.date).toLocaleDateString('pt-BR')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Peso', value: latest.weight, unit: latest.weightUnit },
                    { label: 'Gordura', value: latest.bodyFat, unit: '%' },
                    { label: 'Cintura', value: latest.waist, unit: 'cm' },
                  ].filter(f => f.value != null).map(({ label, value, unit }) => (
                    <div key={label} className="card" style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 300, color: '#C8A96E' }}>{value}</div>
                      <div style={{ fontSize: 11, color: '#525259' }}>{label} ({unit})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {measurements.map(m => (
              <div key={m.id} className="card" style={{ marginBottom: 8, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="label-xs">{new Date(m.date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                  <button className="icon-btn" style={{ width: 32, height: 32, marginTop: -6, marginRight: -6 }} onClick={() => handleDelete(m.id)} aria-label="Excluir medição"><XIcon size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 8 }}>
                  {m.weight != null && <span style={{ fontSize: 13 }}>{m.weight}{m.weightUnit}</span>}
                  {m.bodyFat != null && <span style={{ fontSize: 13, color: '#525259' }}>{m.bodyFat}% GC</span>}
                  {m.chest != null && <span style={{ fontSize: 13, color: '#525259' }}>Peit {m.chest}cm</span>}
                  {m.waist != null && <span style={{ fontSize: 13, color: '#525259' }}>Cin {m.waist}cm</span>}
                  {m.hips != null && <span style={{ fontSize: 13, color: '#525259' }}>Quad {m.hips}cm</span>}
                  {m.leftArm != null && <span style={{ fontSize: 13, color: '#525259' }}>Braço E {m.leftArm}cm</span>}
                  {m.rightArm != null && <span style={{ fontSize: 13, color: '#525259' }}>Braço D {m.rightArm}cm</span>}
                  {m.leftThigh != null && <span style={{ fontSize: 13, color: '#525259' }}>Coxa E {m.leftThigh}cm</span>}
                  {m.rightThigh != null && <span style={{ fontSize: 13, color: '#525259' }}>Coxa D {m.rightThigh}cm</span>}
                </div>
                {m.notes && <div style={{ fontSize: 12, color: '#525259', marginTop: 6 }}>{m.notes}</div>}
              </div>
            ))}
          </>
        )}
      </div>

      {showAdd && <AddSheet onSave={handleSave} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
