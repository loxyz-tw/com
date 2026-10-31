import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Php2ShellPage from './pages/Php2ShellPage';
import { isPhp2ShellPath } from './routes';
import reportWebVitals from './reportWebVitals';
import 'aos/dist/aos.css';

const container = document.getElementById('root');
const Page = isPhp2ShellPath(window.location.pathname) ? Php2ShellPage : App;
const app = (
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
