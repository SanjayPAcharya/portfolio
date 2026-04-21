import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import type { Container, Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

interface ParticlesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function ParticlesBackground({ children, className = '' }: ParticlesBackgroundProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (_container: Container | undefined) => {}, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: { enable: false },
          style: { position: 'absolute', width: '100%', height: '100%' },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              resize: true,
            },
            modes: {
              repulse: { distance: 80, duration: 0.4 },
            },
          },
          particles: {
            color: { value: ['#8B5CF6', '#EC4899', '#22D3EE', '#A78BFA'] },
            links: {
              color: { value: ['#8B5CF6', '#EC4899', '#22D3EE'] },
              distance: 140,
              enable: true,
              opacity: 0.12,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: true,
              speed: 0.6,
              straight: false,
            },
            number: {
              density: { enable: true, area: 900 },
              value: 40,
            },
            opacity: { value: { min: 0.05, max: 0.25 } },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0"
      />
      {children}
    </div>
  );
}
