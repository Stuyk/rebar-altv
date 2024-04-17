import { Events } from "@Shared/events/index.js";
import * as alt from "alt-client";

type AnyCallback =
  | ((...args: any[]) => void)
  | ((...args: any[]) => Promise<void>)
  | Function;

const ClientEvents: { [eventName: string]: AnyCallback } = {};

let webview: alt.WebView;
let cursorCount: number = 0;

function handleServerEvent(event: string, ...args: any[]) {
  alt.emitServer(event, ...args);
}

function handleClientEvent(event: string, ...args: any[]) {
  //
}

export function useWebview(path: "http://assets/webview/index.html") {
  let isInitialized = true;

  if (!webview) {
    webview = new alt.WebView(path);

    isInitialized = false;
  }

  function emit(event: string, ...args: any[]) {
    webview.emit(Events.view.onEmit, event, ...args);
  }

  function on<EventNames = string>(eventName: EventNames, cb: AnyCallback) {
    if (ClientEvents[String(eventName)]) {
      console.warn(`[Client] Duplicate Event Name ${eventName}`);
      return;
    }

    ClientEvents[String(eventName)] = cb;
  }

  function showCursor(state: boolean) {
    if (state) {
      cursorCount += 1;
      try {
        alt.showCursor(true);
      } catch (err) {}
    } else {
      for (let i = 0; i < cursorCount; i++) {
        try {
          alt.showCursor(false);
        } catch (err) {}
      }

      cursorCount = 0;
    }
  }

  if (!isInitialized) {
    alt.onServer("webview:emit", emit);
    webview.on(Events.view.emitClient, handleClientEvent);
    webview.on(Events.view.emitServer, handleServerEvent);
    // webview.on(Events.view.emitReady, InternalFunctions.handleReadyEvent);
  }

  return {
    emit,
    on,
  };
}
