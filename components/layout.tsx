import React, { useState, useEffect } from 'react';
import styles from './layout.module.css'; // Import the CSS modules
import { useRouter } from 'next/router';
import ThemeContext from '@/contexts/ThemeContext';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [CSSStyles, setStyles] = useState<any>({});
  const [JSModule, setJSModule] = useState<any>(null);

  const router = useRouter();
  const {
    query: { 'chat-id': chatId },
  } = router;

  // Function to initialize style and jsmodule config according to chatID
  useEffect(() => {
    if (chatId) {
      import(`@/configuration/${chatId}/webapp/Index.module.css`)
        .then((module) => {
          setStyles(module);
        })
        .catch((error) => {
          import(`@/configuration/default/webapp/Index.module.css`).then(
            (module) => {
              setStyles(module);
            },
          );
        });
      import(`@/configuration/${chatId}/webapp`)
        .then((module) => {
          setJSModule(module);
        })
        .catch((error) => {
          import(`@/configuration/default/webapp`).then((module) => {
            setJSModule(module);
          });
        });
    } else {
      import(`@/configuration/default/webapp/Index.module.css`).then(
        (module) => {
          setStyles(module);
        },
      );
      import(`@/configuration/default/webapp`).then((module) => {
        setJSModule(module);
      });
    }
  }, [chatId]);

  return (
    <ThemeContext.Provider value={{ styles: CSSStyles, JSModule: JSModule }}>
      <div className={styles.container}>
        <div className={`${styles['main-content']} ${CSSStyles['main-content']}`}>{children}</div>
      </div>
    </ThemeContext.Provider>
  );
}
