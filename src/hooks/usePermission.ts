import { useState, useEffect } from "react";

type PermissionState = "granted" | "denied" | "prompt";

export function usePermission(name: PermissionName): PermissionState | null {
  const [state, setState] = useState<PermissionState | null>(null);

  useEffect(() => {
    if (!("permissions" in navigator)) return;
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
