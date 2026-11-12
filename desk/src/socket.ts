import { io } from "socket.io-client";
import { socketio_port } from "../../../../sites/common_site_config.json";

// extend window object
declare global {
  interface Window {
    site_name: string;
  }
}

export function initSocket() {
  let host = window.location.hostname;
  let siteName = window.site_name || host;
  // A production build reaches socket.io through the page's own origin (the web server
  // proxies /socket.io). Only the Vite dev server runs apart, so it uses socketio_port.
  let url = import.meta.env.DEV
    ? `http://${host}:${socketio_port}/${siteName}`
    : `${window.location.origin}/${siteName}`;

  const socket = io(url, {
    withCredentials: true,
    reconnectionAttempts: 5,
  });

  return socket;
}

export const socket = initSocket();
