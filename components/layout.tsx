import React, { useState, useEffect } from 'react';
import styles from './layout.module.css'; // Import the CSS modules
import Logo from '@/assets/svgs/Logo';
import Button from './ui/Buttons/Button';
import { useRouter } from 'next/router';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [JSModule, setJSModule] = useState<any>(null);
  const router = useRouter();
  const { query: { 'chat-id': chatId } } = router

  useEffect(() => {
    if (chatId) {
      import(`@/configuration/JS/${chatId}`).then(module => {
        setJSModule(module)
      }).catch((error) => {
        import(`@/configuration/JS/default`).then(module => {
          setJSModule(module)
        });
      });
    }
  }, [chatId]);

  return (
    <div className={styles.container}>
      {JSModule?.Navbar && <header className={styles.navbar}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <nav className={styles['nav-links']}>
          <a href="#">Home</a>
          <a href="#">Partner With Us</a>
          <a href="#">How it Works</a>
        </nav>
        <div className={styles.buttons}>
          <Button variant="secondary">+ Post a Project</Button>
          <Button variant="ghost">Login</Button>
          <Button>+ Professional Registeration</Button>
        </div>
      </header>}
      <div className={styles['main-content']}>{children}</div>
    </div>
  );
}
