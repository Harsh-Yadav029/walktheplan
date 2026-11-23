import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from '../lib/router';

interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: () => void;
  endTransition: () => void;
  navigateWithTransition: (to: string) => void;
  screenReaderAnnouncement: string;
}

const TransitionStateContext = createContext<TransitionContextType>({
  isTransitioning: false,
  startTransition: () => {},
  endTransition: () => {},
  navigateWithTransition: () => {},
  screenReaderAnnouncement: '',
});

export function useTransitionState() {
  return useContext(TransitionStateContext);
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Walk The Plan — 1:1 Architectural Blueprint Projection Studio',
  '/about': 'About Us — The Minds Behind The Blueprint | Walk The Plan',
  '/services': 'Architectural Services & Spatial Testing | Walk The Plan',
  '/franchise': 'Studio Franchise Network Across India | Walk The Plan',
  '/gallery': 'Real-Scale Walkthrough Gallery | Walk The Plan',
  '/blog': 'Architectural Insights & Design Guides | Walk The Plan',
};

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
    router.setTransitioning(true);
  }, [router]);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    router.setTransitioning(false);
  }, [router]);

  const navigateWithTransition = useCallback(
    (to: string) => {
      // 1. Ignore if already transitioning (anti-double-click lock)
      if (isTransitioning) return;

      const currentPath = router.pathname.replace(/\/$/, '') || '/';
      const targetPath = to.split('#')[0].replace(/\/$/, '') || '/';

      // 2. Ignore click on the current route without hash
      if (currentPath === targetPath && !to.includes('#')) {
        return;
      }

      // 3. Update announcement for screen readers
      const pageTitle = ROUTE_TITLES[targetPath] ?? 'Walk The Plan';
      setAnnouncement(`Navigating to ${pageTitle}`);

      // 4. Trigger router navigation
      router.navigate(to);
    },
    [isTransitioning, router]
  );

  return (
    <TransitionStateContext.Provider
      value={{
        isTransitioning,
        startTransition,
        endTransition,
        navigateWithTransition,
        screenReaderAnnouncement: announcement,
      }}
    >
      {children}

      {/* Accessible live region for screen reader route change announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {announcement}
      </div>
    </TransitionStateContext.Provider>
  );
}
