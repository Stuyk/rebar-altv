async function reloadCore() {
    try {
        await fetch('http://127.0.0.1:8787/server/reload?resource=core');
    } catch (err) {}

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

reloadCore();
