"use client";

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isNotificationSupported()) return "unsupported";
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return Notification.permission;
  }
}

export async function sendGreetingNotification(displayName?: string | null): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  let permission: NotificationPermission | "unsupported" = Notification.permission;
  if (permission === "default") {
    permission = await requestNotificationPermission();
  }

  if (permission !== "granted") {
    return false;
  }

  const name = displayName?.trim() || "Reader";
  const title = `Welcome to Sayfold, ${name}! 📖`;
  const options: NotificationOptions = {
    body: "Your voice-first knowledge vault is ready. Speak what you read and hear, and we'll fold it into memory.",
    icon: "/icons/icon-192.png",
    badge: "/brand/sayfold-icon.svg",
    tag: "sayfold-welcome",
    data: {
      url: "/library",
    },
  };

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && "showNotification" in reg) {
        await reg.showNotification(title, options);
        return true;
      }
    }

    new Notification(title, options);
    return true;
  } catch (error) {
    console.error("Failed to display greeting notification:", error);
    return false;
  }
}

export async function sendTestNotification(): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  let permission: NotificationPermission | "unsupported" = Notification.permission;
  if (permission === "default") {
    permission = await requestNotificationPermission();
  }

  if (permission !== "granted") {
    return false;
  }

  const title = "Sayfold Wisdom Alert ✨";
  const options: NotificationOptions = {
    body: "Push notifications are working perfectly on this device! We'll help you capture and remember your reading wisdom.",
    icon: "/icons/icon-192.png",
    badge: "/brand/sayfold-icon.svg",
    tag: "sayfold-test",
    data: {
      url: "/library",
    },
  };

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && "showNotification" in reg) {
        await reg.showNotification(title, options);
        return true;
      }
    }

    new Notification(title, options);
    return true;
  } catch (error) {
    console.error("Failed to display test notification:", error);
    return false;
  }
}
