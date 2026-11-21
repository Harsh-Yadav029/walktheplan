import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {SmoothScrollProvider} from './components/SmoothScrollProvider.tsx';
import {PageTransitionProvider} from './components/PageTransition.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <SmoothScrollProvider>
    <PageTransitionProvider>
      <App />
    </PageTransitionProvider>
  </SmoothScrollProvider>
);
