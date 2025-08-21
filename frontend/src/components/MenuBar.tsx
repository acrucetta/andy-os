import React, { useState } from 'react';

interface MenuBarProps {
  onThemeToggle: () => void;
  currentTheme: string;
}

interface MenuItem {
  label?: string;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({ onThemeToggle, currentTheme }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = {
    file: [
      { label: 'New File', action: () => console.log('New File') },
      { label: 'Open...', action: () => console.log('Open') },
      { label: 'Save', action: () => console.log('Save') },
      { label: 'Save As...', action: () => console.log('Save As') },
      { separator: true },
      { label: 'Exit', action: () => console.log('Exit') }
    ],
    edit: [
      { label: 'Undo', action: () => console.log('Undo'), disabled: true },
      { label: 'Redo', action: () => console.log('Redo'), disabled: true },
      { separator: true },
      { label: 'Cut', action: () => console.log('Cut') },
      { label: 'Copy', action: () => console.log('Copy') },
      { label: 'Paste', action: () => console.log('Paste') },
      { label: 'Select All', action: () => console.log('Select All') }
    ],
    view: [
      { label: 'Zoom In', action: () => console.log('Zoom In') },
      { label: 'Zoom Out', action: () => console.log('Zoom Out') },
      { label: 'Reset Zoom', action: () => console.log('Reset Zoom') },
      { separator: true },
      { label: 'Full Screen', action: () => console.log('Full Screen') }
    ],
    window: [
      { label: 'Minimize', action: () => console.log('Minimize') },
      { label: 'Maximize', action: () => console.log('Maximize') },
      { label: 'Close', action: () => console.log('Close') },
      { separator: true },
      { label: 'Bring All to Front', action: () => console.log('Bring All to Front') }
    ],
    help: [
      { label: 'About andy-os', action: () => console.log('About') },
      { label: 'Documentation', action: () => console.log('Documentation') },
      { separator: true },
      { label: 'Report Bug', action: () => console.log('Report Bug') }
    ]
  };

  const handleMenuClick = (menuName: string) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  const handleMenuItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setActiveDropdown(null);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const renderDropdown = (menuName: string, items: MenuItem[]) => {
    if (activeDropdown !== menuName) return null;

    return (
      <div className="dropdown-menu">
        {items.map((item, index) => (
          <div key={index}>
            {item.separator ? (
              <div className="dropdown-separator" />
            ) : (
              <div
                className={`dropdown-item ${item.disabled ? 'disabled' : ''}`}
                onClick={() => !item.disabled && handleMenuItemClick(item.action)}
              >
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="menu-bar">
        <div className="menu-item">
          <strong>andy-os</strong>
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('file')}>
          File
          {renderDropdown('file', menuItems.file)}
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('edit')}>
          Edit
          {renderDropdown('edit', menuItems.edit)}
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('view')}>
          View
          {renderDropdown('view', menuItems.view)}
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('window')}>
          Window
          {renderDropdown('window', menuItems.window)}
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('help')}>
          Help
          {renderDropdown('help', menuItems.help)}
        </div>
        
        <div style={{ marginLeft: 'auto' }}>
          <div className="menu-item" onClick={onThemeToggle}>
            Theme: {currentTheme === 'system7' ? 'System 7' : 'Windows XP'}
          </div>
        </div>
      </div>
      {activeDropdown && (
        <div className="dropdown-overlay" onClick={handleClickOutside} />
      )}
    </>
  );
};

export default MenuBar;
