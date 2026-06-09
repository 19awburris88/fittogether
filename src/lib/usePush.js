import { useEffect } from 'react';
import { subscribePush } from './realApi';

const VAPID_PUBLIC = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  useEffect(() => {
    if (useMock || !VAPID_PUBLIC) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then(async (reg) => {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const existing = await reg.pushManager.getSubscription();
        if (existing) {
          subscribePush(existing).catch(() => {});
          return;
        }

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
        });
        subscribePush(sub).catch(() => {});
      })
      .catch(() => {});
  }, []);
}
