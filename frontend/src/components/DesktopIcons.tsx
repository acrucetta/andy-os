import React from 'react';

interface DesktopIconsProps {
  onCreateWindow: (type: string, title: string) => void;
}

const DesktopIcons: React.FC<DesktopIconsProps> = ({ onCreateWindow }) => {
  const icons = [
    {
      id: 'text-editor',
      name: 'TextEdit',
      type: 'text-editor',
      emoji: '📝'
    },
    {
      id: 'browser',
      name: 'Browser',
      type: 'browser',
      emoji: '🌐'
    },
    {
      id: 'file-manager',
      name: 'Finder',
      type: 'file-manager',
      emoji: '📁'
    },
    {
      id: 'terminal',
      name: 'Terminal',
      type: 'terminal',
      emoji: '💻'
    }
  ];

  const handleIconClick = (icon: any) => {
    onCreateWindow(icon.type, icon.name);
  };

  return (
    <div className="desktop-icons">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="desktop-icon"
          onClick={() => handleIconClick(icon)}
          onDoubleClick={() => handleIconClick(icon)}
        >
          <div style={{ fontSize: '48px', marginBottom: '4px' }}>
            {icon.emoji}
          </div>
          <span>{icon.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DesktopIcons;
