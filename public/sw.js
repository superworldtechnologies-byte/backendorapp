// public/sw.js
// This minimal service worker is required for Chrome to trigger the install prompt.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests
});