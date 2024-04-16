import * as alt from "alt-server";
import * as Utility from "@Server/utility/index.js";

alt.on("playerConnect", (player) => {
  alt.log(`${player.name} joined, and this was logged in the example plugin`);
  alt.log("new message who dis");
});
