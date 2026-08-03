import { env } from "@/lib/env";

const ACCOUNT_EVENTS_PATH = "/ws/account-events";
const INITIAL_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;

interface AccountEvent {
  type?: string;
  code?: string;
  message?: string;
}

export function getAccountEventsUrl(apiUrl = env.apiUrl): string {
  const url = new URL(apiUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = ACCOUNT_EVENTS_PATH;
  url.search = "";
  url.hash = "";
  return url.toString();
}

export function connectAccountEvents(
  accessToken: string,
  onAccountDeactivated: () => void,
): () => void {
  let socket: WebSocket | undefined;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  let reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
  let disposed = false;
  let deactivationHandled = false;

  const connect = () => {
    if (disposed || typeof WebSocket === "undefined") {
      return;
    }

    socket = new WebSocket(getAccountEventsUrl());

    socket.addEventListener("open", () => {
      reconnectDelay = INITIAL_RECONNECT_DELAY_MS;
      socket?.send(JSON.stringify({
        type: "AUTHENTICATE",
        accessToken,
      }));
    });

    socket.addEventListener("message", (message) => {
      try {
        const event = JSON.parse(String(message.data)) as AccountEvent;
        if (event.type !== "ACCOUNT_DEACTIVATED" || deactivationHandled) {
          return;
        }

        deactivationHandled = true;
        onAccountDeactivated();
      } catch {
        // Ignore malformed or unrelated server messages.
      }
    });

    socket.addEventListener("close", (event) => {
      socket = undefined;
      if (disposed || deactivationHandled || event.code === 4003) {
        return;
      }

      reconnectTimer = setTimeout(connect, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY_MS);
    });
  };

  connect();

  return () => {
    disposed = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
    socket?.close();
  };
}
