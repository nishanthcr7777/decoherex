import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple modal dialog using Tailwind CSS classes.
 * Props:
 *   - isOpen (boolean): whether to render the modal
 *   - onClose (function): called when backdrop clicked or X pressed
 *   - title (string | ReactNode): header text
 *   - children: modal body
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
};

Modal.defaultProps = {
  onClose: () => {},
  title: '',
  children: null,
};

export default Modal;