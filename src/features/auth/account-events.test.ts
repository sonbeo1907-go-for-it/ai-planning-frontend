import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  connectAccountEvents,
  getAccountEventsUrl,
} from "./account-events";

vi.mock("@/lib/env", () => ({
  env: { apiUrl: "http://localhost:8080/api/v1" },
}));

type Listener = (event: MessageEvent | CloseEvent | Event) => void;

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];

  readonly listeners = new Map<string, Listener[]>();
  readonly send = vi.fn();
  readonly close = vi.fn();

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  addEventListener(type: string, listener: Listener): void {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  emit(type: string, event: MessageEvent | CloseEvent | Event): void {
    this.listeners.get(type)?.forEach((listener) => listener(event));
  }
}

describe("account events", () => {
  beforeEach(() => {
    FakeWebSocket.instances = [];
    vi.stubGlobal("WebSocket", FakeWebSocket);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds the WebSocket endpoint without retaining the API prefix", () => {
    expect(getAccountEventsUrl("https://api.example.com/api/v1"))
      .toBe("wss://api.example.com/ws/account-events");
  });

  it("authenticates and handles account deactivation once", () => {
    const onAccountDeactivated = vi.fn();
    const disconnect = connectAccountEvents("access-token", onAccountDeactivated);
    const socket = FakeWebSocket.instances[0];

    socket.emit("open", new Event("open"));
    expect(socket.send).toHaveBeenCalledWith(JSON.stringify({
      type: "AUTHENTICATE",
      accessToken: "access-token",
    }));

    const event = new MessageEvent("message", {
      data: JSON.stringify({ type: "ACCOUNT_DEACTIVATED" }),
    });
    socket.emit("message", event);
    socket.emit("message", event);

    expect(onAccountDeactivated).toHaveBeenCalledOnce();
    disconnect();
    expect(socket.close).toHaveBeenCalledOnce();
  });
});
