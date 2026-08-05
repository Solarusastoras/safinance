// src/components/Icon/Icon.jsx
import React from 'react';

const paths = {
  home:          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  wallet:        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3M3 7h18v10H3M16 12h.01" />,
  'shopping-bag':<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />,
  car:           <path d="M14 16H9m10 0h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-3l-2-4H8L6 9H3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1m16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />,
  film:          <path d="M2 4h20v16H2zM6 4v16M18 4v16M2 8h4M18 8h4M2 12h20M2 16h4M18 16h4" />,
  tv:            <path d="m7 2 4 4-4-4zm10 0-4 4 4-4zM2 8h20v12H2z" />,
  'heart-pulse': <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
  laptop:        <path d="M20 16V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11m-2 4h20a2 2 0 0 0 1.73-3H2.27A2 2 0 0 0 2 20z" />,
  briefcase:     <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M2 6h20v14H2z" />,
  'trending-up': <path d="m22 7-8.5 8.5-5-5L1 18m21-11h-6m6 0v6" />,
  'trending-down':<path d="m22 17-8.5-8.5-5 5L1 6m21 11h-6m6 0v-6" />,
  'shield-check':<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />,
  plane:         <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />,
  music:         <path d="M9 18V5l12-2v13M9 9l12-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm12 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  activity:      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  wifi:          <path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.85a10 10 0 0 1 14 0M8.5 16.88a5 5 0 0 1 7 0" />,
  cloud:         <path d="M17.5 19A4.5 4.5 0 0 0 21 15a4.5 4.5 0 0 0-4.09-4.43A7 7 0 0 0 3 12a4.5 4.5 0 0 0 0 9h14.5z" />,
  plus:          <path d="M12 5v14M5 12h14" />,
  search:        <path d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />,
  trash:         <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
  edit:          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
  moon:          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  sun:           <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />,
  'piggy-bank':  <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h4v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2c2-1.5 2-2.7 2-4.5V9.5c.5-.7 1-1.5 1-2.5 0-1.1-.9-2-2-2zM16 11h.01" />,
  'pie-chart':   <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" />,
  settings:      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  'rotate-ccw':  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" />,
  x:             <path d="M18 6 6 18M6 6l12 12" />,
  check:         <path d="M20 6 9 17l-5-5" />,
  'arrow-up-right':   <path d="M7 17 17 7M7 7h10v10" />,
  'arrow-down-right': <path d="m7 7 10 10M17 7v10H7" />,
  clock:              <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2" />,
  history:            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l3 3" />,
};

export default function Icon({ name, size = 20, color = 'currentColor', className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {paths[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
}
