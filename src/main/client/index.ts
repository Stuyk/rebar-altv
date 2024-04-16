import * as alt from "alt-client";
import "../translate/index.js";

async function start() {
  // Load Plugins
  alt.log(":: Loading Client Plugins");
  import("./plugins.js");
  alt.log(":: Loaded Client Plugins");
}

start();
