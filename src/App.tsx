import React, { useState, useEffect } from 'react';
import type { View } from './types';
import { getActiveSession } from './store';
import Nav from './components/Nav';
import Home from './pages/Home';
import WorkoutMode from './pages/WorkoutMode';
import Plans from './pages/Plans';
import PlanDetail from './pages/PlanDetail';
import Exercises from './pages/Exercises';
import ExerciseDetail from './pages/ExerciseDetail';
import History from './pages/History';
import SessionDetail from './pages/SessionDetail';
import Progress from './pages/Progress';
import Body from './pages/Body';
import Settings from './pages/Settings';
import Install from './pages/Install';
import Anatomy from './pages/Anatomy';

function readView(): View {
  try {
    const raw = sessionStorage.getItem('forge.view');
    if (raw) return JSON.parse(raw) as View;
  } catch {}
  return { screen: 'home' };
}

export default function App() {
  const [view, setViewRaw] = useState<View>(readView);

  function setView(v: View) {
    sessionStorage.setItem('forge.view', JSON.stringify(v));
    setViewRaw(v);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const active = getActiveSession();
    if (active && view.screen !== 'workout') {
      setView({ screen: 'workout' });
    }
  }, []);

  function renderPage() {
    switch (view.screen) {
      case 'home': return <Home onNavigate={setView} />;
      case 'workout': return <WorkoutMode key={`${view.planId}-${view.dayId}`} planId={view.planId} dayId={view.dayId} onNavigate={setView} />;
      case 'plans': return <Plans onNavigate={setView} />;
      case 'plan-detail': return <PlanDetail planId={view.planId} onNavigate={setView} />;
      case 'plan-new': return <PlanDetail planId={null} onNavigate={setView} />;
      case 'exercises': return <Exercises onNavigate={setView} />;
      case 'exercise-detail': return <ExerciseDetail exerciseId={view.exerciseId} onNavigate={setView} />;
      case 'exercise-new': return <ExerciseDetail exerciseId={null} onNavigate={setView} />;
      case 'history': return <History onNavigate={setView} />;
      case 'session-detail': return <SessionDetail sessionId={view.sessionId} onNavigate={setView} />;
      case 'progress': return <Progress onNavigate={setView} />;
      case 'body': return <Body onNavigate={setView} />;
      case 'settings': return <Settings onNavigate={setView} />;
      case 'install': return <Install onNavigate={setView} />;
      case 'anatomy': return <Anatomy key={view.exerciseKey} exerciseKey={view.exerciseKey} onNavigate={setView} />;
      default: return <Home onNavigate={setView} />;
    }
  }

  return (
    <div style={{ minHeight: '100dvh' }}>
      {renderPage()}
      {view.screen !== 'workout' && <Nav view={view} onNavigate={setView} />}
    </div>
  );
}
