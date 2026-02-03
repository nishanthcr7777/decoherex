import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Simple modal dialog using Tailwind CSS classes.
 * Props:
 *   - isOpen (boolean): whether to render the modal
 *   - onClose (function): called when backdrop clicked or X pressed
 *   - title (string | ReactNode): header text
 *   - children: modal body
 */
const Modal = ({ 
  isOpen, 
  onClose = () => {}, 
  title = '', 
  children = null, 
  contentClassName = null, 
  bodyClassName = null 
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={contentClassName || "bg-background border border-border rounded-xl shadow-xl w-full max-w-lg p-6 flex flex-col max-h-[90vh]"}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <button
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div className={cn("space-y-4 min-h-0", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  contentClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
};

export default Modal;