import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onHome: () => void;
}

export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro nesta tela:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" style={{ maxWidth: 560, margin: '0 auto', padding: '72px 24px', color: '#EFEDE7' }}>
        <p style={{ font: "9px 'DM Mono', monospace", letterSpacing: '.16em', textTransform: 'uppercase', color: '#C8A96E' }}>Ops</p>
        <h1 style={{ marginTop: 10, font: "italic 300 30px 'Fraunces', serif" }}>Algo deu errado nesta tela</h1>
        <p style={{ marginTop: 10, fontSize: 12, lineHeight: 1.6, color: 'rgba(239,237,231,.5)' }}>
          Seu progresso continua salvo. Volte ao início e tente abrir de novo.
        </p>
        <button
          type="button"
          onClick={() => {
            this.setState({ error: null });
            this.props.onHome();
          }}
          style={{
            marginTop: 22,
            minHeight: 44,
            padding: '12px 18px',
            border: '1px solid #C8A96E',
            background: '#C8A96E',
            color: '#0A0A0D',
            font: "500 12px 'Inter', system-ui, sans-serif",
            cursor: 'pointer',
          }}
        >
          Voltar ao início
        </button>
      </div>
    );
  }
}
