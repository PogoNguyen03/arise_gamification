import React from 'react';
import '../styles/Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="system-window">
            <div className="system-border-glow"></div>
            <div className="system-content-wrapper">
                <header className="system-header">
                    <span className="system-title">SYSTEM</span>
                    <div className="system-status-indicator">ONLINE</div>
                </header>
                <main className="system-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
