// src/components/common/GlobalScaleManager.tsx
import React, { useLayoutEffect } from 'react';

interface GlobalScaleManagerProps {
  children: React.ReactNode;
}

const GlobalScaleManager: React.FC<GlobalScaleManagerProps> = ({ children }) => {
  const updateScale = () => {
    const DESIGN_WIDTH = 2400; // The resolution the UI was designed for (e.g., 1920px at 80% zoom is 2400px)
    const DESIGN_HEIGHT = 1350; // 16:9 aspect ratio
    const MIN_SCALE = 0.75;
    const MAX_SCALE = 1.1;

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    const scaleX = currentWidth / DESIGN_WIDTH;
    const scaleY = currentHeight / DESIGN_HEIGHT;

    const scale = Math.min(scaleX, scaleY);

    const clampedScale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);

    const body = document.body;
    body.style.transform = `scale(${clampedScale})`;
    body.style.transformOrigin = 'top left';
    body.style.width = `${100 / clampedScale}%`;
    body.style.height = `${100 / clampedScale}%`;
    body.style.overflowX = 'hidden';
    body.style.backgroundColor = '#f0f2f5';
  };

  useLayoutEffect(() => {
    const originalBodyStyle = document.body.style.cssText;

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
      document.body.style.cssText = originalBodyStyle;
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return <>{children}</>;
};

export default GlobalScaleManager;
