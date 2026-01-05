import React from 'react';
import '../styles/Dashboard.css';
import { useGame } from '../context/GameContext';
import useSound from '../hooks/useSound';

const Dashboard: React.FC = () => {
    const { stats, player, addStatPoint } = useGame();
    const playSound = useSound();

    const requestNotification = () => {
        playSound('click');
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification("SYSTEM CONNECTED", {
                        body: "Notification Link Established.",
                        icon: '/pwa-192x192.png'
                    });
                }
            });
        }
    };

    const getPercentage = (current: number, max: number) => {
        return Math.min(100, Math.max(0, (current / max) * 100)) + '%';
    };

    return (
        <div className="dashboard-container">
            <div className="status-header">
                <h2>STATUS</h2>
            </div>

            <div className="status-grid">
                <div className="info-section">
                    <div className="info-row">
                        <span className="label">NAME:</span>
                        <span className="value">{player.name}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">JOB:</span>
                        <span className="value">PLAYER</span>
                    </div>
                    <div className="info-row">
                        <span className="label">TITLE:</span>
                        <span className="value">WOLF SLAYER</span>
                    </div>
                    <div className="info-row level-row">
                        <span className="label">LEVEL:</span>
                        <span className="value level-value">{player.level}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">GOLD:</span>
                        <span className="value" style={{ color: 'gold' }}>{player.gold}</span>
                    </div>
                    <div className="info-row">
                        <button className="nav-btn" onClick={requestNotification} style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem' }}>
                            ENABLE NOTIFICATIONS
                        </button>
                    </div>
                </div>

                <div className="bars-section">
                    <div className="bar-container">
                        <div className="bar-label">
                            <span>HP</span>
                            <span>{player.hp}/{player.maxHp}</span>
                        </div>
                        <div className="progress-bar hp-bar">
                            <div className="progress-fill" style={{ width: getPercentage(player.hp, player.maxHp) }}></div>
                        </div>
                    </div>
                    <div className="bar-container">
                        <div className="bar-label">
                            <span>MP</span>
                            <span>{player.mp}/{player.maxMp}</span>
                        </div>
                        <div className="progress-bar mp-bar">
                            <div className="progress-fill" style={{ width: getPercentage(player.mp, player.maxMp) }}></div>
                        </div>
                    </div>
                    <div className="bar-container">
                        <div className="bar-label">
                            <span>EXP</span>
                            <span>{player.currentExp}/{player.maxExp}</span>
                        </div>
                        <div className="progress-bar exp-bar" style={{ borderColor: '#fff' }}>
                            <div className="progress-fill" style={{ width: getPercentage(player.currentExp, player.maxExp), background: '#fff' }}></div>
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <h3>ATTRIBUTES</h3>
                    <div className="stat-points">
                        <span>AVAILABLE POINTS: </span>
                        <span className="points-value">{stats.points}</span>
                    </div>

                    {(['str', 'vit', 'agl', 'int', 'sen'] as const).map(stat => (
                        <div className="stat-row" key={stat}>
                            <span className="stat-name">{stat.toUpperCase()}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="stat-value">{stats[stat]}</span>
                                {stats.points > 0 && (
                                    <button
                                        className="stat-btn"
                                        onClick={() => { addStatPoint(stat); playSound('click'); }}
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
