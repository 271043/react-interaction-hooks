import { useState, useCallback } from "react";

interface UseNotificationReturn {
  permission: NotificationPermission;
  supported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  notify: (title: string, options?: NotificationOptions) => Notification | null;
}

/**
 * Returns {permission, supported, requestPermission, notify} for creating browser Notifications.
 *
 * @returns Object with permission state, supported boolean, requestPermission() async function, notify() function.
 */
export function useNotification(): UseNotificationReturn {
  const supported = typeof Notification !== "undefined" && !!Notification;
  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? Notification.permission : "denied"
  );

  const requestPermission = useCallback(async () => {
    if (!supported) return "denied" as NotificationPermission;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [supported]);

  const notify = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!supported || permission !== "granted") return null;
      return new Notification(title, options);
    },
    [supported, permission]
  );

  return { permission, supported, requestPermission, notify };
}
