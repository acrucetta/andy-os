import React from 'react';

interface MenuBarProps {
  onThemeToggle: () => void;
  currentTheme: string;
}

const MenuBar: React.FC<MenuBarProps> = ({ onThemeToggle, currentTheme }) => {
  return (
    <div className="menu-bar">
      <div className="menu-item">
        <strong>andy-os</strong>
      </div>
      
      <div className="menu-item">
        File
      </div>
      
      <div className="menu-item">
        Edit
      </div>
      
      <div className="menu-item">
        View
      </div>
      
      <div className="menu-item">
        Window
      </div>
      
      <div className="menu-item">
        Help
      </div>
      
      <div style={{ marginLeft: 'auto' }}>
        <div className="menu-item" onClick={onThemeToggle}>
          Theme: {currentTheme === 'system7' ? 'System 7' : 'Windows XP'}
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
