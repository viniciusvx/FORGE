import React, { useState } from 'react';
import type { View } from '../types';
import { HomeIcon, DumbbellIcon, ClipboardIcon, TrendingUpIcon, MenuIcon, XIcon, SettingsIcon, BodyIcon, DownloadIcon } from './Icons';

interface NavProps {
  view: View;
  onNavigate: (v: View) => void;
}

const NAV_ITEMS = [
  { screen: 'home', label: 'Início', Icon: HomeIcon },
  { screen: 'workout', label: 'Treinar', Icon: DumbbellIcon },
  { screen: 'plans', label: 'Fichas', Icon: ClipboardIcon },
  { screen: 'progress', label: 'Evolução', Icon: TrendingUpIcon },
] as const;

interface MenuDrawerProps {
  view: View;
  onNavigate: (v: View) => void;
  onClose: () => void;
}

function MenuDrawer({ view, onNavigate, onClose }: MenuDrawerProps) {
  function go(v: View) {
    onNavigate(v);
    onClose();
  }

  const groups = [
    {
      label: 'Dados',
      items: [
        { screen: 'exercises', label: 'Exercícios', Icon: DumbbellIcon },
        { screen: 'anatomy', label: 'Análise muscular', Icon: BodyIcon },
        { screen: 'history', label: 'Histórico', Icon: ClipboardIcon },
        { screen: 'body', label: 'Medidas Corporais', Icon: BodyIcon },
      ] as const,
    },
    {
      label: 'App',
      items: [
        { screen: 'settings', label: 'Configurações', Icon: SettingsIcon },
        { screen: 'install', label: 'Instalar no celular', Icon: DownloadIcon },
      ] as const,
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60"
        style={{ zIndex: 110, backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 rounded-t-2xl animate-slide-up"
        style={{ zIndex: 111, background: '#16161C', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', maxHeight: '80dvh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 8px' }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 300, color: '#EFEDE7' }}>Menu</span>
          <button onClick={onClose} style={{ color: '#525259', padding: 4 }}>
            <XIcon size={22} />
          </button>
        </div>

        {groups.map(group => (
          <div key={group.label} style={{ padding: '8px 0' }}>
            <div className="label-xs" style={{ padding: '8px 20px 4px' }}>{group.label}</div>
            {group.items.map(({ screen, label, Icon }) => {
              const active = view.screen === screen;
              return (
                <button
                  key={screen}
                  onClick={() => go({ screen } as View)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 20px',
                    color: active ? '#C8A96E' : '#EFEDE7',
                    background: active ? 'rgba(200, 169, 110, 0.08)' : 'transparent',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: 15 }}>{label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Nav({ view, onNavigate }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const inMenuSection = ['exercises', 'anatomy', 'history', 'body', 'settings', 'install'].includes(view.screen);

  return (
    <>
      {menuOpen && (
        <MenuDrawer view={view} onNavigate={onNavigate} onClose={() => setMenuOpen(false)} />
      )}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          background: 'rgba(10, 10, 13, 0.92)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV_ITEMS.map(({ screen, label, Icon }) => {
          const active = view.screen === screen;
          return (
            <button
              key={screen}
              onClick={() => onNavigate({ screen } as View)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '10px 0 8px',
                color: active ? '#C8A96E' : '#525259',
                transition: 'color 0.15s',
              }}
            >
              <Icon size={22} />
              <span style={{ fontSize: 10, letterSpacing: '0.04em', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase' }}>
                {label}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '10px 0 8px',
            color: inMenuSection ? '#C8A96E' : '#525259',
            transition: 'color 0.15s',
          }}
        >
          <MenuIcon size={22} />
          <span style={{ fontSize: 10, letterSpacing: '0.04em', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase' }}>
            Menu
          </span>
        </button>
      </nav>
    </>
  );
}
