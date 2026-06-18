import React, { useContext, useEffect, useRef } from 'react';
import ThemeContext from '@/contexts/ThemeContext';
import PanelIcon from '@/assets/svgs/PanelIcon';

interface ChatHeaderProps {
    drawerOpen?: boolean;
    onDrawerToggle?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ drawerOpen = false, onDrawerToggle }) => {
    const { JSModule, styles } = useContext(ThemeContext);
    const headerRef = useRef<HTMLDivElement>(null);

    // Custom header HTML is injected via dangerouslySetInnerHTML, which does NOT
    // run <script> tags. So we populate the signed-in user's name/avatar here.
    useEffect(() => {
        if (!JSModule?.headerPaneHtml) return;
        let cancelled = false;
        fetch('/api/auth/session')
            .then((r) => r.json())
            .then((d: { name?: string; email?: string }) => {
                if (cancelled || !d?.name) return;
                const root = headerRef.current;
                if (!root) return;
                const nameEl = root.querySelector<HTMLElement>('.ttt-user-name');
                const emailEl = root.querySelector<HTMLElement>('.ttt-user-email');
                const avatarEl = root.querySelector<HTMLElement>('.ttt-user-avatar');
                if (nameEl) nameEl.textContent = d.name;
                if (emailEl && d.email) emailEl.textContent = d.email;
                if (avatarEl) avatarEl.textContent = d.name.trim().charAt(0).toUpperCase();
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [JSModule?.headerPaneHtml]);

    // Close any open dropdown in the injected header when clicking outside it.
    // The <script> tag inside headerPaneHtml does not execute in React, so we
    // wire this up here instead.
    useEffect(() => {
        if (!JSModule?.headerPaneHtml) return;
        const handleOutsideClick = (e: MouseEvent) => {
            const wrap = headerRef.current?.querySelector<HTMLElement>('#ttt-user-wrap');
            if (wrap && !wrap.contains(e.target as Node)) {
                wrap.classList.remove('open');
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [JSModule?.headerPaneHtml]);

    // Bot-level override: full custom header HTML
    if (JSModule?.headerPaneHtml) {
        return (
            <div
                ref={headerRef}
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