import React from 'react';

const DriveIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M7.71 3.99L1.99 13.6L5.85 20.39L11.57 10.8L7.71 3.99Z" />
    <path d="M12 10.5L8.14 17.29L12 24L19.71 10.5H12Z" />
    <path d="M12.29 3L16.15 9.79L22 10.2L16.28 0.61L12.29 3Z" />
  </svg>
);

export default DriveIcon;
