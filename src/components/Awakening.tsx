import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import '../styles/Awakening.css';

const Awakening: React.FC = () => {
    const { setPlayerName } = useGame();
    const [inputName, setInputName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputName.trim()) {
            setPlayerName(inputName.trim());
        }
    };

    return (
        <div className="awakening-container">
            <div className="awakening-content">
                <h1 className="system-alert">SYSTEM NOTICE</h1>
                <p className="awakening-text">
                    Congratulations. You have been chosen as a Player.
                </p>
                <p className="awakening-text">
                    Please enter your name to register with the System.
                </p>

                <form onSubmit={handleSubmit} className="name-form">
                    <input
                        type="text"
                        className="name-input"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="Enter Name..."
                        autoFocus
                    />
                    <button type="submit" className="confirm-btn">
                        ACCEPT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Awakening;
