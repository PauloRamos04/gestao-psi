import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import App from './App';
import reportWebVitals from './reportWebVitals';
import newLogo from './assets/newlogo-gestaopsi.png';

// Força atualização do favicon e apple-touch-icon com a nova logo
(() => {
  const ensureLink = (rel: string) => {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    return link;
  };

  const icon = ensureLink('icon');
  icon.type = 'image/png';
  icon.href = newLogo;

  const shortcut = ensureLink('shortcut icon');
  shortcut.type = 'image/png';
  shortcut.href = newLogo;

  const apple = ensureLink('apple-touch-icon');
  apple.href = newLogo;
})();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider 
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          borderRadius: 6,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
