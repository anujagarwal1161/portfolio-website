/** Short vibration on supported mobile browsers (respects user settings). */
export function hapticTap() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
  } catch {
    /* ignore */
  }
}
