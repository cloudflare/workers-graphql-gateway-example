import { handleRequest } from "./router";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
