import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from './Icons';

interface SheetProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Sheet({ title, onClose, children, footer }: SheetProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />
      <div
        role="dialog"
        className="animate-slide-up"
        style={{
          position: 'relative', width: '100%', maxWidth: 640, background: '#16161C',
          borderRadius: '18px 18px 0 0', maxHeight: '90dvh', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
        </div>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px 8px 20px' }}>
            <div style={{ fontSize: 17, fontWeight: 500 }}>{title}</div>
            <button className="icon-btn" onClick={onClose} aria-label="Fechar"><XIcon size={20} /></button>
          </div>
        )}
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
        <div style={{ padding: footer ? '12px 20px' : 0, paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', borderTop: footer ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
          {footer}
        </div>
      </div>
    </div>,
    document.body
  );
}

interface ConfirmProps {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({ title, message, confirmLabel, danger = true, onConfirm, onCancel }: ConfirmProps) {
  return (
    <Sheet onClose={onCancel}>
      <div style={{ padding: '12px 20px 4px' }}>
        <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: 'rgba(239,237,231,0.55)', marginBottom: 20, lineHeight: 1.5 }}>{message}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} style={{ flex: 1 }} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </Sheet>
  );
}
