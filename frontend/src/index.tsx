import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Container from '@mui/material/Container';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Container sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '3em',
        fontSize: 'calc(10px + 2vmin)',
    }}>
      <App />
    </Container>
  </React.StrictMode>
);
