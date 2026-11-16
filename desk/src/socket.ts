import { io } from "socket.io-client";

// extend window object
declare global {
  interface Window {
    site_name: string;
  }
}

export function initSocket() {
  let host = window.location.hostname;
  let siteName = window.site_name || host;
  // socket.io is always reached through the page's own origin: in production the web server
  // proxies /socket.io, and in development the Vite server does (see vite.config.js).
  let url = `${window.location.origin}/${siteName}`;

  const socket = io(url, {
    withCredentials: true,
    reconnectionAttempts: 5,
  });

  return socket;
}

export const socket = initSocket();
