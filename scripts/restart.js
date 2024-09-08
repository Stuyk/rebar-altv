async function kickAll() {
    try {
        await fetch('http://127.0.0.1:8787/server/restart');
    } catch (err) {}

    await new Promise((resolve) => setTimeout(resolve, 2000));
}

kickAll();
