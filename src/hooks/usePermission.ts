import { useState, useEffect } from "react";

type PermissionState = "granted" | "denied" | "prompt";

/**
 * Returns the current state ("granted" | "denied" | "prompt") of the named browser permission, or null if unavailable.
 *
 * @param name - PermissionName to query (e.g. "camera", "notifications").
 * @returns PermissionState | null
 */
export function usePermission(name: PermissionName): PermissionState | null {
  const [state, setState] = useState<PermissionState | null>(null);

  useEffect(() => {
    if (!navigator.permissions) return;
    let permissionStatus: PermissionStatus;

    navigator.permissions.query({ name }).then((status) => {
      permissionStatus = status;
      setState(status.state);
      status.onchange = () => setState(status.state);
    }).catch(() => {});

    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, [name]);

  return state;
}
