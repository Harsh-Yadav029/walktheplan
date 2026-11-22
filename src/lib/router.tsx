import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface RouterContextType {
  pathname: string;
  hash: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
  hash: typeof window !== 'undefined' ? window.location.hash : '',
  navigate: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [hash, setHash] = useState<string>(
    typeof window !== 'undefined' ? window.location.hash : ''
  );

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
    if (window.location.pathname !== to) {
      window.history.pushState(null, '', to);
      setPathname(to);
      setHash('');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, hash, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}
