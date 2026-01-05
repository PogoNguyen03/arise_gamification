import React from 'react';
import '../styles/QuestBoard.css';
import { useGame } from '../context/GameContext';

const QuestBoard: React.FC = () => {
    const { quests, completeQuest } = useGame();

    return (
        <div className="quest-container">
            <div className="quest-header">
                <h2>QUEST LOG</h2>
            </div>

            <div className="quest-list">
                {quests.map(quest => (
                    <div
                        key={quest.id}
                        className={`quest-card ${quest.type.toLowerCase()} ${quest.completed ? 'completed' : ''}`}
                        onClick={() => completeQuest(quest.id)}
                    >
                        <div className="quest-info">
                            <div className="quest-type-badge">{quest.type} QUEST</div>
                            <h3>{quest.title}</h3>
                            <p>{quest.description}</p>
                            <div className="quest-rewards">
                                Rewards: EXP +{quest.rewards.exp}, Gold +{quest.rewards.gold}
                                {quest.rewards.statPoints ? `, Stat Points +${quest.rewards.statPoints}` : ''}
                            </div>
                        </div>
                        <div className="quest-status">
                            {quest.completed ? "[COMPLETED]" : "[INCOMPLETE]"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestBoard;
