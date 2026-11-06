import React from 'react';
import type { View } from '../types';
import { DownloadIcon } from '../components/Icons';

interface Props { onNavigate: (v: View) => void; }

export default function Install({ onNavigate }: Props) {
  return (
    <div className="page animate-fade-in">
      <div className="page-inner">
        <div className="page-header">
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>PWA</div>
            <h1 className="page-title">Instalar no celular</h1>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>iPhone / iPad (Safari)</div>
            <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Abra este site no Safari.',
                'Toque no ícone de compartilhar (□ com seta) na barra inferior.',
                'Role para baixo e toque em "Adicionar à Tela de Início".',
                'Confirme o nome "FORGE" e toque em Adicionar.',
              ].map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span className="label-xs" style={{ color: '#C8A96E', minWidth: 20, paddingTop: 1 }}>{i + 1}</span>
                  <span style={{ fontSize: 14 }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Android (Chrome)</div>
            <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Abra este site no Chrome.',
                'Toque nos três pontinhos (⋮) no canto superior direito.',
                'Selecione "Adicionar à tela inicial" ou "Instalar app".',
                'Confirme e toque em Instalar.',
              ].map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span className="label-xs" style={{ color: '#C8A96E', minWidth: 20, paddingTop: 1 }}>{i + 1}</span>
                  <span style={{ fontSize: 14 }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card" style={{ background: 'rgba(200, 169, 110, 0.06)', border: '1px solid rgba(200, 169, 110, 0.2)' }}>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              Depois de instalar, o FORGE funciona offline. Seus dados ficam salvos no dispositivo e não dependem de internet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
