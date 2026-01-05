import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuestBoard from './components/QuestBoard';
import Navigation from './components/Navigation';
import Awakening from './components/Awakening';
import { useGame } from './context/GameContext';

function App() {
  const { player } = useGame();
  const [currentView, setCurrentView] = useState<'status' | 'quests' | 'shop'>('status');

  if (!player.name) {
    return <Awakening />;
  }

  return (
    <Layout>
      <Navigation currentView={currentView} onChangeView={setCurrentView} />

      {currentView === 'status' && <Dashboard />}
      {currentView === 'quests' && <QuestBoard />}
      {currentView === 'shop' && <div style={{ textAlign: 'center', marginTop: '50px' }}>SHOP UNDER CONSTRUCTION</div>}
    </Layout>
  );
}

export default App;
