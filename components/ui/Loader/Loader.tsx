import React, { useEffect, useRef } from 'react';
import type { AnimationItem } from 'lottie-web';

interface LoaderProps {
  loader?: string;
}

const Loader: React.FC<LoaderProps> = ({ loader }) => {
  const container = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (container.current) {
      import('lottie-web').then((lottie) => {
        animationRef.current = lottie.default.loadAnimation({
          container: container.current!,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: loader ? loader : 'https://lottie.host/43ec45fc-8d19-4b9f-8f22-ed906d42db71/xdmFrfrtKB.json'
        });
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [loader]);

  return <div ref={container}></div>;
};

export default Loader;
