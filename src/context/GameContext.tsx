import React, { createContext, useContext, useState, useEffect } from 'react';
import useSound from '../hooks/useSound';

// Types
export interface Stats {
    str: number;
    agl: number;
    sen: number;
    vit: number;
    int: number;
    points: number;
}

export interface PlayerState {
    name: string;
    job: string;
    level: number;
    currentExp: number;
    maxExp: number;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    fatigue: number;
    gold: number;
}

export interface Quest {
    id: number;
    title: string;
    description: string;
    type: 'DAILY' | 'NORMAL' | 'EMERGENCY';
    completed: boolean;
    rewards: {
        exp: number;
        gold: number;
        statPoints?: number;
        items?: string[];
        [key: string]: any;
    };
}

interface GameContextType {
    stats: Stats;
    player: PlayerState;
    quests: Quest[];
    completeQuest: (id: number) => void;
    addStatPoint: (stat: keyof Omit<Stats, 'points'>) => void;
    setPlayerName: (name: string) => void;
}

const defaultStats: Stats = {
    str: 10,
    agl: 10,
    sen: 10,
    vit: 10,
    int: 10,
    points: 0
};

const defaultPlayer: PlayerState = {
    name: "",
    job: "NONE",
    level: 1,
    currentExp: 0,
    maxExp: 100,
    hp: 100,
    maxHp: 100,
    mp: 10,
    maxMp: 10,
    fatigue: 0,
    gold: 0
};

const defaultQuests: Quest[] = [
    {
        id: 1,
        title: "Cường hóa cơ thể (Hàng ngày)",
        description: "Hít đất 100 cái, Gập bụng 100 cái, Squat 100 cái, Chạy 10km.",
        type: "DAILY",
        completed: false,
        rewards: { exp: 100, gold: 50, statPoints: 3 }
    },
    {
        id: 2,
        title: "Học thức (Hàng ngày)",
        description: "Đọc sách hoặc học kỹ năng mới trong 2 giờ.",
        type: "NORMAL",
        completed: false,
        rewards: { exp: 50, gold: 10, int: 1 }
    },
    {
        id: 3,
        title: "Home Workout: Core (Plank)",
        description: "Plank 3 sets x 60s.",
        type: "NORMAL",
        completed: false,
        rewards: { exp: 30, gold: 10, vit: 1 }
    },
    {
        id: 4,
        title: "Home Workout: Legs (Squat)",
        description: "Squat 4 sets x 20 reps.",
        type: "NORMAL",
        completed: false,
        rewards: { exp: 40, gold: 15, str: 1 }
    },
    {
        id: 5,
        title: "Home Workout: Push-ups",
        description: "Push-ups 4 sets x 15 reps.",
        type: "NORMAL",
        completed: false,
        rewards: { exp: 40, gold: 15, str: 1 }
    }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const playSound = useSound();

    // Load initial state from localStorage or defaults
    const [stats, setStats] = useState<Stats>(() => {
        const saved = localStorage.getItem('arise_stats');
        return saved ? JSON.parse(saved) : defaultStats;
    });

    const [player, setPlayer] = useState<PlayerState>(() => {
        const saved = localStorage.getItem('arise_player');
        return saved ? JSON.parse(saved) : defaultPlayer;
    });

    const [quests, setQuests] = useState<Quest[]>(() => {
        const saved = localStorage.getItem('arise_quests');
        return saved ? JSON.parse(saved) : defaultQuests;
    });

    // Persist state
    useEffect(() => {
        localStorage.setItem('arise_stats', JSON.stringify(stats));
        localStorage.setItem('arise_player', JSON.stringify(player));
        localStorage.setItem('arise_quests', JSON.stringify(quests));
    }, [stats, player, quests]);

    // Notification Logic
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const checkDailyReminder = () => {
            const now = new Date();
            // Remind at 8 PM (20:00) if Daily Quest (id 1) is incomplete
            if (now.getHours() === 20 && now.getMinutes() === 0) {
                const dailyQuest = quests.find(q => q.id === 1);
                if (dailyQuest && !dailyQuest.completed && Notification.permission === 'granted') {
                    new Notification("SYSTEM ALERT", {
                        body: "Daily Quest 'Player Enhancement' is incomplete. Penalty Zone imminent.",
                        icon: '/pwa-192x192.png'
                    });
                }
            }
        };

        const interval = setInterval(checkDailyReminder, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [quests]);

    const levelUp = (currentExp: number, currentLevel: number) => {
        // Simple logic: overflow exp carries over
        // Exp requirement grows by 20% each level
        let exp = currentExp;
        let level = currentLevel;
        let required = Math.floor(100 * Math.pow(1.2, level - 1));

        while (exp >= required) {
            exp -= required;
            level++;
            required = Math.floor(100 * Math.pow(1.2, level - 1));

            // Level up bonuses
            setStats(prev => ({ ...prev, points: prev.points + 3 }));
            playSound('levelUp');
            // Notify?
        }

        return { level, currentExp: exp, maxExp: required };
    };

    const completeQuest = (id: number) => {
        const quest = quests.find(q => q.id === id);
        if (!quest || quest.completed) return;

        // Mark completed
        setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
        playSound('success');

        // Grant rewards
        let newPlayer = { ...player };
        newPlayer.gold += quest.rewards.gold;

        // XP & Leveling
        const totalExp = newPlayer.currentExp + quest.rewards.exp;
        const { level, currentExp, maxExp } = levelUp(totalExp, newPlayer.level);

        newPlayer.level = level;
        newPlayer.currentExp = currentExp;
        newPlayer.maxExp = maxExp;

        // Full restore on Level Up (classic gamer trope)
        if (level > player.level) {
            newPlayer.hp = newPlayer.maxHp;
            newPlayer.mp = newPlayer.maxMp;
            newPlayer.fatigue = 0;
        }

        setPlayer(newPlayer);

        if (quest.rewards.statPoints) {
            setStats(prev => ({ ...prev, points: prev.points + quest.rewards.statPoints! }));
        }
    };

    const addStatPoint = (stat: keyof Omit<Stats, 'points'>) => {
        if (stats.points > 0) {
            setStats(prev => ({
                ...prev,
                [stat]: prev[stat] + 1,
                points: prev.points - 1
            }));
        }
    };

    const setPlayerName = (name: string) => {
        setPlayer(prev => ({ ...prev, name }));
    };

    return (
        <GameContext.Provider value={{ stats, player, quests, completeQuest, addStatPoint, setPlayerName }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within a GameProvider");
    return context;
};
