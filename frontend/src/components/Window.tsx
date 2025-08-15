import React, { useState, useRef, useEffect } from 'react';

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

interface WindowProps {
  window: WindowData;
  onUpdate: (id: string, updates: Partial<WindowData>) => void;
  onClose: (id: string) => void;
}

const Window: React.FC<WindowProps> = ({ window, onUpdate, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize') => {
    e.preventDefault();
    if (type === 'drag') {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.x,
        y: e.clientY - window.y
      });
    } else if (type === 'resize') {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: window.width,
        height: window.height
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onUpdate(window.id, { x: newX, y: newY });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(300, resizeStart.width + deltaX);
      const newHeight = Math.max(200, resizeStart.height + deltaY);
      onUpdate(window.id, { width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleMinimize = () => {
    onUpdate(window.id, { minimized: !window.minimized });
  };

  const handleClose = () => {
    onClose(window.id);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(window.id, { content: e.target.value });
  };

  if (window.minimized) {
    return null;
  }

  const renderContent = () => {
    switch (window.type) {
      case 'text-editor':
        return (
          <textarea
            className="text-editor"
            value={window.content || ''}
            onChange={handleContentChange}
            placeholder="Welcome to andy-os Text Editor! Start typing..."
          />
        );
      case 'browser':
        return (
          <div className="browser">
            <h3>Browser</h3>
            <p>Browser functionality coming soon...</p>
          </div>
        );
      case 'file-manager':
        return (
          <div className="file-manager">
            <h3>File Manager</h3>
            <p>File management functionality coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="default-content">
            <h3>{window.title}</h3>
            <p>This is a {window.type} window.</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={windowRef}
      className="window"
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: isDragging || isResizing ? 1000 : 1
      }}
    >
      <div
        className="window-header"
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
      >
        <div className="window-title">{window.title}</div>
        <div className="window-controls">
          <div
            className="window-control minimize"
            onClick={handleMinimize}
            title="Minimize"
          />
          <div
            className="window-control maximize"
            title="Maximize"
          />
          <div
            className="window-control close"
            onClick={handleClose}
            title="Close"
          />
        </div>
      </div>
      
      <div className="window-content">
        {renderContent()}
      </div>
      
      <div
        className="window-resize-handle"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '20px',
          height: '20px',
          cursor: 'nw-resize',
          background: 'transparent'
        }}
        onMouseDown={(e) => handleMouseDown(e, 'resize')}
      />
    </div>
  );
};

export default Window;
