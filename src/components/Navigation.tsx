import React from 'react';
import '../styles/Navigation.css';
import useSound from '../hooks/useSound';

interface NavigationProps {
    currentView: 'status' | 'quests' | 'shop';
    onChangeView: (view: 'status' | 'quests' | 'shop') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
    const playSound = useSound();

    const handleClick = (view: 'status' | 'quests' | 'shop') => {
        playSound('click');
        onChangeView(view);
    };

    return (
        <nav className="system-nav">
            <button
                className={`nav-btn ${currentView === 'status' ? 'active' : ''}`}
                onClick={() => handleClick('status')}
            >
                STATUS
            </button>
            <button
                className={`nav-btn ${currentView === 'quests' ? 'active' : ''}`}
                onClick={() => handleClick('quests')}
            >
                QUESTS
            </button>
            <button
                className={`nav-btn ${currentView === 'shop' ? 'active' : ''}`}
                onClick={() => handleClick('shop')}
            >
                SHOP
            </button>
        </nav>
    );
};

export default Navigation;
