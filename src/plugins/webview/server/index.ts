import * as alt from "alt-server";

import "../translate/index.js";
import { useTranslate } from "@Shared/translate.js";

const { t } = useTranslate("en");

alt.on("playerConnect", (player) => {
  alt.log(`${player.name}, ${t("example.joined-server")}`);
});
