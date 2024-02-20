import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LoaderProps {
  loader?: string;
}

const Loader: React.FC<LoaderProps> = ({ loader }) => {
  const container = useRef<HTMLDivElement>(null);
  let animation: AnimationItem | null = null;

  useEffect(() => {
    if (container.current) {
      animation = lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: loader ? loader : 'https://lottie.host/43ec45fc-8d19-4b9f-8f22-ed906d42db71/xdmFrfrtKB.json'
      });
    }

    return () => {
      if (animation) {
        animation.destroy();
      }
    };
  }, [loader]);

  return <div ref={container}></div>;
};

export default Loader;
