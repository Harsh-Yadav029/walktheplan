import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

interface RouterContextType {
  pathname: string;
  hash: string;
  navigate: (to: string) => void;
  isTransitioning: boolean;
  setTransitioning: (transitioning: boolean) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
  hash: typeof window !== 'undefined' ? window.location.hash : '',
  navigate: () => {},
  isTransitioning: false,
  setTransitioning: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [hash, setHash] = useState<string>(
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  const setTransitioning = useCallback((transitioning: boolean) => {
    isTransitioningRef.current = transitioning;
    setIsTransitioning(transitioning);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      setHash(window.location.hash);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;

    // 1. Anti-double-click lock: Ignore clicks if transition is currently running
    if (isTransitioningRef.current) {
      return;
    }

    if (to.startsWith('#')) {
      // Internal anchor
      window.history.pushState(null, '', to);
      setHash(to);
      const el = document.querySelector(to);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (to.startsWith('/#')) {
      const targetHash = to.substring(1);
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', to);
        setPathname('/');
        setHash(targetHash);
      } else {
        window.history.pushState(null, '', targetHash);
        setHash(targetHash);
        const el = document.querySelector(targetHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Direct path routing, e.g. '/about', '/blog', or '/'
    const targetPath = to.split('#')[0] || '/';
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const normalizedTarget = targetPath.replace(/\/$/, '') || '/';

    // 2. Pre-navigation block: Ignore clicks on the current route without hash
    if (currentPath === normalizedTarget && !to.includes('#')) {
      return;
    }

    if (window.location.pathname !== to) {
      window.history.pushState(null, '', to);
      setPathname(to);
      setHash('');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, hash, navigate, isTransitioning, setTransitioning }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children: React.ReactNode;
}

export function Link({ to, href, onClick, children, className, ...props }: LinkProps) {
  const router = useRouter();
  const target = to || href || '/';
  const currentPath = router.pathname.replace(/\/$/, '') || '/';
  const targetPath = target.split('#')[0].replace(/\/$/, '') || '/';
  const isActive = currentPath === targetPath;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      !e.defaultPrevented &&
      !target.startsWith('http') &&
      !target.startsWith('mailto:') &&
      !target.startsWith('tel:')
    ) {
      e.preventDefault();
      router.navigate(target);
    }
  };

  return (
    <a
      href={target}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive ? 'true' : 'false'}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

