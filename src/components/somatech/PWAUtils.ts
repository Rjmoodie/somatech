// PWA Configuration
const PWA_CONFIG = {
  name: "SomaTech",
  short_name: "SomaTech",
  description: "Professional Financial Intelligence Platform",
  start_url: "/somatech?module=dashboard&utm_source=pwa",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#3b82f6",
  orientation: "portrait",
  categories: ["finance", "business", "productivity"],
  shortcuts: [
    {
      name: "Stock Analysis",
      short_name: "Analysis",
      description: "Analyze stocks with AI-powered insights",
      url: "/somatech?module=stock-analysis",
      icons: [{ src: "/icons/analysis-96x96.png", sizes: "96x96", type: "image/png" }]
    },
    {
      name: "Watchlist",
      short_name: "Watchlist",
      description: "View your investment watchlist",
      url: "/somatech?module=watchlist",
      icons: [{ src: "/icons/watchlist-96x96.png", sizes: "96x96", type: "image/png" }]
    },
    {
      name: "Dashboard",
      short_name: "Dashboard",
      description: "View your financial dashboard",
      url: "/somatech?module=dashboard",
      icons: [{ src: "/icons/dashboard-96x96.png", sizes: "96x96", type: "image/png" }]
    }
  ]
};

// Service Worker Registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('ServiceWorker registration successful:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update available notification
              showUpdateNotification();
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }
};

// Push Notifications
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const subscribeToPushNotifications = async (userId: string) => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '')
    });
    
    // Send subscription to backend
    const response = await fetch('/api/push-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        userId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save push subscription');
    }
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    throw error;
  }
};

// Utility functions
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const showUpdateNotification = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('SomaTech Update Available', {
      body: 'A new version of SomaTech is available. Refresh to update.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'app-update'
    });
  }
};

// Install Prompt
export class PWAInstaller {
  private deferredPrompt: any = null;
  private installed = false;

  constructor() {
    this.init();
  }

  private init() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      this.deferredPrompt = e;
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      this.installed = true;
      this.deferredPrompt = null;
    });
  }

  canInstall(): boolean {
    return !!this.deferredPrompt && !this.installed;
  }

  async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    // Clear the deferredPrompt
    this.deferredPrompt = null;
    
    return outcome === 'accepted';
  }

  isInstalled(): boolean {
    return this.installed || window.matchMedia('(display-mode: standalone)').matches;
  }
}

// Offline Storage
export class OfflineStorage {
  private dbName = 'SomaTechOffline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores for offline data
        if (!db.objectStoreNames.contains('watchlist')) {
          const watchlistStore = db.createObjectStore('watchlist', { keyPath: 'id' });
          watchlistStore.createIndex('ticker', 'ticker', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('analyses')) {
          const analysesStore = db.createObjectStore('analyses', { keyPath: 'id' });
          analysesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('notifications')) {
          const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notificationsStore.createIndex('timestamp', 'created_at', { unique: false });
        }
      };
    });
  }

  async store(storeName: string, data: any[]) {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    for (const item of data) {
      await store.put(item);
    }
    
    return new Promise<void>((resolve) => {
      transaction.oncomplete = () => resolve();
    });
  }

  async get(storeName: string, key?: string) {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    if (key) {
      return store.get(key);
    } else {
      return store.getAll();
    }
  }

  async clear(storeName: string) {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return store.clear();
  }
}

export { PWA_CONFIG };