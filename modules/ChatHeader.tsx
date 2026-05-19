import React, { useContext } from 'react';
import ThemeContext from '@/contexts/ThemeContext';
import PanelIcon from '@/assets/svgs/PanelIcon';

interface ChatHeaderProps {
    drawerOpen?: boolean;
    onDrawerToggle?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ drawerOpen = false, onDrawerToggle }) => {
    const { JSModule, styles } = useContext(ThemeContext);

    // Bot-level override: full custom header HTML
    if (JSModule?.headerPaneHtml) {
        return (
            <div
                className={styles?.['main-header']}
                dangerouslySetInnerHTML={{ __html: JSModule.headerPaneHtml }}
            />
        );
    }

    return (
        <div className={styles?.['main-header']}>
            <span>{JSModule?.getTitle}</span>
            {onDrawerToggle && JSModule?.drawerEnabled && (
                <button onClick={onDrawerToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
                    <PanelIcon size={20} stroke={drawerOpen ? '#2563eb' : '#6b7280'} />
                </button>
            )}
        </div>
    );
};