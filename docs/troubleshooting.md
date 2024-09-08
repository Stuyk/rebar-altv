---
order: 96
---

# Troubleshooting

!!!
This troubleshooting guide mostly pertains to people who have successfully installed this framework.

If you are still having trouble installing, kindly visit the Discord's help section.
!!!

## Clear `node_modules`

Simply delete the entire `node_modules` folder.

**Windows**

```
rmdir node_modules
```

**Linux**

```
rm -rf node_modules
```

Run `pnpm install` after completing this step.

## Upgrade Server Binaries

Run `pnpm upgrade` to get the latest version of alt:V Server Binaries.

If this does not work remove the following files manually, and then upgrade:

-   altv-crash-handler.exe
-   altv-server.exe
-   libnode.dll
-   cache
-   modules
-   .server-crashes-cache

Run `pnpm upgrade` after this has completed.

## Clone Rebar Again

If you're following the general principal of not modifying core code, you can simply move your plugins to a new instance of Rebar.

Download a new copy of Rebar, move your plugins to the plugins folder.

Install everything again with `pnpm install`, `pnpm upgrade`, and then do `pnpm start`.

## Still Not Working?

You're at a point where you'll need to start disabling plugins, or moving them out 1-by-1 to see which is the most problematic plugin.

Remove all of your plugins, and start adding them back in 1-by-1, and running the server each time.

If your server stops working after you re-introduced a plugin, then you've found your troublemaker.
