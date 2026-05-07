"use strict";

const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.textContent = "";
  errorCode.textContent = "";

  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    return;
  }

  const url = search(address.value, searchEngine.value);

  let wispUrl =
    (location.protocol === "https:" ? "wss" : "ws") +
    "://" +
    location.host +
    "/wisp/";

  try {
    if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
      await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    }
  } catch (err) {
    error.textContent = "Transport error: " + err.message;
    return;
  }

  // Full page navigation — no iframe
  location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
});
