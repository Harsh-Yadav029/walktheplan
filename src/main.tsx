import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {SmoothScrollProvider} from './components/SmoothScrollProvider.tsx';
import {PageTransitionProvider} from './components/PageTransition.tsx';
import {RouterProvider} from './lib/router.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <RouterProvider>
    <SmoothScrollProvider>
      <PageTransitionProvider>
        <App />
      </PageTransitionProvider>
    </SmoothScrollProvider>
  </RouterProvider>
);

