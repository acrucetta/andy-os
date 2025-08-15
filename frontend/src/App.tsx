import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Window from './components/Window';
import MenuBar from './components/MenuBar';
import DesktopIcons from './components/DesktopIcons';

interface WindowData {
  id: string;
  title: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  content?: string;
}

interface SystemState {
  windows: WindowData[];
  files: any[];
  theme: string;
}

function App() {
  const [state, setState] = useState<SystemState>({
    windows: [],
    files: [],
    theme: 'system7'
  });
  const [nextWindowId, setNextWindowId] = useState(1);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:3001/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const data: SystemState = JSON.parse(event.data);
      setState(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  const createWindow = (type: string, title: string) => {
    const newWindow: WindowData = {
      id: `window-${nextWindowId}`,
      title,
      type,
      x: 100 + (nextWindowId * 20),
      y: 100 + (nextWindowId * 20),
      width: 600,
      height: 400,
      minimized: false,
      content: type === 'text-editor' ? 'Welcome to andyOs Text Editor!\n\nStart typing here...' : ''
    };

    fetch('/api/windows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newWindow),
    });

    setNextWindowId(prev => prev + 1);
  };

  const updateWindow = (id: string, updates: Partial<WindowData>) => {
    const window = state.windows.find(w => w.id === id);
    if (!window) return;

    const updatedWindow = { ...window, ...updates };

    fetch(`/api/windows/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWindow),
    });
  };

  const closeWindow = (id: string) => {
    fetch(`/api/windows/${id}`, {
      method: 'DELETE',
    });
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'system7' ? 'windows-xp' : 'system7';
    
    fetch('/api/theme', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: newTheme }),
    });
  };

  return (
    <div className={`desktop theme-${state.theme}`}>
      <MenuBar onThemeToggle={toggleTheme} currentTheme={state.theme} />
      
      <DesktopIcons onCreateWindow={createWindow} />
      
      {state.windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onUpdate={updateWindow}
          onClose={closeWindow}
        />
      ))}
    </div>
  );
}

export default App;
