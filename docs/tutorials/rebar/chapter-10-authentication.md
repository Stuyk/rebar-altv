# Chapter 10. Authentication Plugin

Authentication is our next big ticket item for doing anything with the Rebar Framework. While there are a handful of Authentication plugins out there, I believe it's incredibly important to learn and understand how Authentication works.

We're going to be building a **single account**, and **single character** login system.

It will simply take a username, and a password to register and account.

## Before Beginning

If you followed the previous tutorial on death match, please add a file called `.disable` to your death match game mode folder.

This will disable that plugin from loading.

## Create a New Plugin

You're going to create a new plugin folder called `authentication`. You are going to create 2 folders inside of it.

-   server
-   webview

Go ahead and create the `index.ts` file inside of `plugins/authentication/server/`. We will come back to work on the webview folder later in this tutorial when we're ready.

## Setting up the Camera

We're going to immediately throw the player into the sky when they join the server. As well as change their dimension, and freeze them.

We'll be using a combination of alt:V functions, and properties. As well as Rebar functions.

Here's exactly what we're going to do so you can understand:

1. Move the player position way up high
2. Freeze the player
3. Set the player invisible
4. Set the player's dimension, to a larger dimension Hiding the player from the default dimension
5. Wait 1 second for everything to process
6. Freeze the player's gameplay camera in place

### Handle Player Connect

```ts
// server/index.ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Take careful note that this function is async
alt.on('playerConnect', async (player) => {
    // When the player connects, we do something here
    // all code below should go here for this section
});
```

### Move the Player Up

```ts
// server/index.ts

player.pos = new alt.Vector3(0, 0, 100);
```

### Freeze the Player

```ts
// server/index.ts

player.frozen = true;
```

### Make Player Invisible

```ts
// server/index.ts

player.visible = false;
```

### Change Dimension

```ts
// server/index.ts

player.dimension = player.id + 1;
```

### Freeze Gameplay Camera

```ts
// async means we can wait for code to finish
// await means this is waiting for code to complete
await alt.Utils.wait(1000); // Wait 1 second before freezing camera

const rPlayer = Rebar.usePlayer(player);
rPlayer.world.freezeCamera(true);
```

### Result

![](../../static/book/cam-freeze.png)

## Server Config Settings

Additionally, we're going to add a server configuration setting that will automatically hide the radar in the bottom left when any WebView page is open. This can be done anywhere outside of the player connection function. Make sure it's outside of it.

```ts
// server/index.ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const ServerConfig = Rebar.useServerConfig();

ServerConfig.set('hideMinimapInPage', true);

// Rest of the code
```

## Building a Page

Our next step is going to be creating a `Vue Template` which is ideal for creating user interfaces. Our first step is going to be opening the `plugins/authentication/webview` folder and creating a unique page name. Like... `Authentication.vue`.

```vue
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';

const Events = useEvents();
</script>

<template>
    <div>Hello World!</div>
</template>
```

### Loading the Page

Head back over `server/index.ts` and we'll use the WebView functionality in `rPlayer` to show the page to the user. You may need to run the server once before the pages show up.

```ts
// server/index.ts

rPlayer.webview.show('Authentication', 'page');
```

### Blur the Screen

We're also going to blur the screen so it's a little more pleasing to look at.

```ts
// server/index.ts

rPlayer.world.setScreenBlur(200);
```

### Disable the player controls

Since we don't want the player to accidentally opening the pausemenu if their Username or password contains the letter 'P' we're going to disable the controls. Just remember to enable them again, when releasing the player into the world.

```ts
// server/index.ts

rPlayer.world.disableControls();
```

### Initial Result

You should see a `hello world` in the top-left of your screen.

![](../../static/book/blurred-screen.png)

## Building a Form

We're going to need to modify the `Authentication.vue` and make it act as a form. We'll be utilizing a little bit of Tailwind CSS to make the form take form.

### Before Building

Instead of building in-game and seeing previews every time you reconnect. We actually have a utility command in Rebar that will let you do all of this work out of the browser. Open up a terminal where Rebar is located, and run this command.

```bash
pnpm webview:dev
```

This will open up a server on `http://localhost:5173/` which you can open in your browser.

Alternatively, if you have one screen. In VSCode press `CTRL + SHIFT P` and type `Simple Browser: Show` and paste the URL when prompted. This will show the same page in your VSCode window. You can then drag the tab to the side to split the view.

### Creating the Wrapper

We need the page to take up the whole screen, but also we want to make sure it's centered.

The easiest way to do this is to apply `fixed` css with `flex` and then use centering css for the rest.

```vue
<template>
    <div class="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div class="flex w-1/3 flex-col gap-4 rounded-lg bg-zinc-900 bg-opacity-80 p-6">
            <!-- Our Content Goes Here -->
        </div>
    </div>
</template>
```

This will result in a simple black box with slight transparency, and rounded corners.

It will always take up `1/3` of the screen regardless of how large your resolution is.

### Fill in the Wrapper

We're going to add a header, two inputs, and a single button for registering and logging in.

```vue
<template>
    <div class="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div class="flex w-1/2 flex-col gap-4 rounded-lg bg-zinc-900 bg-opacity-80 p-6">
            <div class="font-bold text-white">Authenticate</div>
            <input type="text" placeholder="username" class="rounded-md bg-zinc-900 p-2 text-white" />
            <input type="password" placeholder="password" class="rounded-md bg-zinc-900 p-2 text-white" />
            <button class="rounded-md bg-emerald-700 p-3 font-medium text-white hover:bg-emerald-800">
                Login / Register
            </button>
        </div>
    </div>
</template>
```

## Building Page Logic

Our next step is going to be making all of these inputs and buttons function in a useable way. What we'll be doing is utilizing `vue` to handle all of the heavy lifting to make all the functionality work.

### Binding Inputs

In `vue` you can use a `ref` to bind the data to the given input box. We're going to do just that.

In the `script` section at the top we'll add the following:

```ts
const username = ref<string>('');
const password = ref<string>('');
```

Then we'll bind those to the given inputs with a v-model

```vue
// Don't copy this, manually add the 'v-model' attribute
<input v-model="username" ... />
<input v-model="password" ... />
```

Our resulting code should look something like this:

```vue
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';

const Events = useEvents();

const username = ref<string>('');
const password = ref<string>('');
</script>

<template>
    <div class="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div class="flex w-1/2 flex-col gap-4 rounded-lg bg-zinc-900 bg-opacity-80 p-6">
            <div class="font-bold text-white">Authenticate</div>
            <input
                v-model="username"
                type="text"
                placeholder="username"
                class="rounded-md bg-zinc-900 p-2 text-white"
            />
            <input
                v-model="password"
                type="password"
                placeholder="password"
                class="rounded-md bg-zinc-900 p-2 text-white"
            />
            <button class="rounded-md bg-emerald-700 p-3 font-medium text-white hover:bg-emerald-800">
                Login / Register
            </button>
        </div>
    </div>
</template>
```

### Binding Buttons

Our first step is going to be creating a simple `loginOrRegister` function in the script section, but we need to make it `async`.

We'll append the `async` keyword and write the function.

```ts
async function loginOrRegister() {
    console.log('something happened!');
}
```

When you have a any `div`, `link` or even a `button` you can use `@click` to bind it to a function.

We'll add `@click=` to the `button` as an attribute.

```vue
<button @click="loginOrRegister" ...
```

Here's what that code should look like...

If you have it open in the browser, you can see the console output if you press `F12`.

```vue
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';

const Events = useEvents();

const username = ref<string>('');
const password = ref<string>('');

function loginOrRegister() {
    console.log('something happened!');
}
</script>

<template>
    <div class="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div class="flex w-1/2 flex-col gap-4 rounded-lg bg-zinc-900 bg-opacity-80 p-6">
            <div class="font-bold text-white">Authenticate</div>
            <input
                v-model="username"
                type="text"
                placeholder="username"
                class="rounded-md bg-zinc-900 p-2 text-white"
            />
            <input
                v-model="password"
                type="password"
                placeholder="password"
                class="rounded-md bg-zinc-900 p-2 text-white"
            />
            <button
                @click="loginOrRegister"
                class="rounded-md bg-emerald-700 p-3 font-medium text-white hover:bg-emerald-800"
            >
                Login / Register
            </button>
        </div>
    </div>
</template>
```

## Verifying Inputs

Next we're going to simply verify the inputs for username and password. We want to make sure that each input has at least 3 letters or characters given to it before the login button does anything, and we'll invalidate everything until it's all correct.

### Add a Boolean Ref

We'll start by adding 2 new refs under `username` and `password`.

```ts
const username = ref<string>('');
const password = ref<string>('');
const usernameValid = ref(false);
const passwordValid = ref(false);
```

### Build Validation

We can build validation by using the `watch` function from `vue`. What this will do is that every time `username` and `password` is updated it'll call another function. This can be used to check if the length matches correctly.

```ts
watch(username, (value) => {
    usernameValid.value = false;

    // If the length of the username is less than 3, return
    if (value.length <= 2) {
        return;
    }

    usernameValid.value = true;
});

watch(password, (value) => {
    passwordValid.value = false;

    // If the length of the password is less than 3, return
    if (value.length <= 2) {
        return;
    }

    passwordValid.value = true;
});
```

### Hide the Button

We're going to show the button only when `usernameValid && passwordValid` are set to `true`. We can use a `v-if` statement to do this.

```vue
<button
    @click="loginOrRegister"
    class="rounded-md bg-emerald-700 p-3 font-medium text-white hover:bg-emerald-800"
    v-if="usernameValid && passwordValid"
>
   Login / Register
</button>
```

You can now verify that this all works by typing into both boxes until the login button shows up.

### Sanitize Inputs

Now we're going to sanitize the username input further, and only allow `A-Z` and `0-9` in the username. We can do this by using something called Regex. Regex is a confusing little monster that validates inputs. The option below will do exactly what we need.

```ts
watch(username, (value) => {
    usernameValid.value = false;

    // If the length of the username is less than 3, return
    if (value.length <= 2) {
        return;
    }

    // If the length of the username does not match the given character set, return
    if (!username.value.match(/^[A-Za-z0-9]+$/gm)) {
        return;
    }

    // LGTM!
    usernameValid.value = true;
});
```

### Feedback

One thing we should definitely add is a feedback message for when any of the inputs are invalid.

We can do this by creating an element under each input that will complain about what is wrong.

We'll only show the feedback when the `username` or `password` is invalid.

```vue
<input v-model="username" type="text" placeholder="username" class="rounded-md bg-zinc-900 p-2 text-white" />
<span class="text-xs text-red-300" v-if="!usernameValid">
    Username must be at least 3 characters long, no special characters. Alphanumeric only.
</span>
<input v-model="password" type="password" placeholder="password" class="rounded-md bg-zinc-900 p-2 text-white" />
<span class="text-xs text-red-300" v-if="!passwordValid">
    Password must be at least 3 characters long.
</span>
```

### Code Check

We're going to just use this section to verify that your code is similar to what is below.

```vue
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';

const Events = useEvents();

const username = ref<string>('');
const password = ref<string>('');
const usernameValid = ref(false);
const passwordValid = ref(false);

async function loginOrRegister() {
    console.log('hi there');
}

watch(username, (value) => {
    usernameValid.value = false;
    if (value.length <= 2) {
        return;
    }

    if (!username.value.match(/^[A-Za-z0-9_.]+$/gm)) {
        return;
    }

    usernameValid.value = true;
});

watch(password, (value) => {
    passwordValid.value = false;
    if (value.length <= 2) {
        return;
    }

    passwordValid.value = true;
});
</script>

<template>
    <div class="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div class="flex w-1/2 flex-col gap-4 rounded-lg bg-zinc-900 bg-opacity-80 p-6">
            <div class="font-bold text-white">Authenticate</div>
            <input
                v-model="username"
                type="text"
                placeholder="username"
                class="rounded-md bg-zinc-900 p-2 text-white"
            />
            <span class="text-xs text-red-300" v-if="!usernameValid">
                Username must be at least 3 characters long, no special characters. Alphanumeric only.
            </span>
            <input
                v-model="password"
                type="password"
                placeholder="password"
                class="rounded-md bg-zinc-900 p-2 text-white"
            />
            <span class="text-xs text-red-300" v-if="!passwordValid">
                Password must be at least 3 characters long.
            </span>
            <button
                @click="loginOrRegister"
                class="rounded-md bg-emerald-700 p-3 font-medium text-white hover:bg-emerald-800"
                v-if="usernameValid && passwordValid"
            >
                Login / Register
            </button>
        </div>
    </div>
</template>
```

## Emitting to Server

We're going to use an `rpc` event to emit the request to the server, and get a result back. This means that when the user clicks the `login / register` button it will send an event to the server with their `username` and `password` and then we can verify if an account exists, or if we need to create a new account.

### Emit to Server

Modify the `loginOrRegister` function in the Vue file to use the `Events` variable to emit to the server.

```ts
async function loginOrRegister() {
    const result = await Events.emitServerRpc('authenticate:login', username.value, password.value);
    console.log(result);
}
```

### Handle the Event

On the server-side now we're going to listen for the `authenticate:login` event in our `server/index.ts` file. We can do this by using `alt.onRpc` as it will have a corresponding RPC event coming up from the client.

We're going to also make this RPC event `async`, so we can get results from our database.

```ts
// server/index.ts

alt.onRpc('authenticate:login', async (player: alt.Player, username: string, password: string) => {
    console.log(username, password);
    return true;
});
```

Verify that you receive the input data on server-side by spamming some data into the input fields in-game.

### Build the Registration

Now that we've successfully gotten the event, we can move on to using the database.

We're going to grab our `db` function and use `getMany` to find as many documents as possible that match the `username`.

```ts
// server/index.ts

// This will extend the existing `Account` structure and add a username field
type AccountExtended = Account & { username: string };

alt.onRpc('authenticate:login', async (player: alt.Player, username: string, password: string) => {
    const db = Rebar.database.useDatabase();
    const results = await db.getMany<AccountExtended>({ username }, Rebar.database.CollectionNames.Accounts);

    // This should return an empty array if the account does not exist
    console.log(results);
});
```

After we've gotten the results, if the results are `<= 0` we're going to register the user.

```ts
// server/index.ts

if (results.length <= 0) {
    // Hash the plain text password with pbkdf2
    const pbkdf2Password = Rebar.utility.password.hash(password);

    // Create a database entry for the account, which returns an _id
    const _id = await db.create({ username, password: pbkdf2Password }, Rebar.database.CollectionNames.Accounts);

    // Use the '_id' to get the full document, and log it to console
    return true;
}
```

After registering the user, we're going to want to pull that document down, and get it ready for some later steps. For now we'll just print it to the server console so that we can use it later.

```ts
// server/index.ts

if (results.length <= 0) {
    const pbkdf2Password = Rebar.utility.password.hash(password);
    const _id = await db.create({ username, password: pbkdf2Password }, Rebar.database.CollectionNames.Accounts);
    const document = await db.get({ _id }, Rebar.database.CollectionNames.Accounts);

    // This document is in the database, well done
    console.log(document);

    // For now we'll return true
    return true;
}
```

If you're successful you'll get something like this in your console:

```bash
{
  _id: '6670a71daafac905d549f376',
  username: 'hello',
  password: 'c1wXtKqGCzUxXgOjmfrQt0tOQN5AjYSLer4/jwMeICM=$dWF2Wc7wL1VgnSTo1RcMAmcH7Oa5nidQ9SctqXb+51BZLa6wcKBgTwmztir61yDPVWPmH+OCC72Jsv9nip2UNPJF/kPrbNOohhl3VVjYg5ovGZ3Evw4Qyr8IJABvrjiSZ65hict60EBci0tY+VWmijg3jbKXsCshxWpq7V7n3L4zmXni1kp+YSwGN5IJtIBn3LuOrbEKrkDN+cIoKvlyISU0CvZGze0wxsTjlEqQKUye151qIHTW/+fkafQZPEwsuTcbgdtv5A35z37VjtT46PVgAHJAJ8Rp2joSxn2+2LkzVd8l4YtpI3f3tRNcq/ziWnd6zTONHsadu4nF4QQMIYZfWsHQkynfP1fFgJJCP5dlPAggR5VDkQTNmug34FB5X1+9i86Tpf1P/87OXlzrVITRfFYs8SCsmFKOnYailvgtyZ899sAuXl85ZIUdd0xoI397ewZRKZmcRIv647TywhxhnyCOudOSIBm7tUHmeHx+xMTKQEuT98JX04oYb69KekMmu83ZwE6O4OKtxc71tU/ojblXuMSZRSigTAPKEolDxaaf5zW5DFnHeNeGV+Esn2WPwvEAur6zeWnIZeeUZYRfHIZKQMJRkaY6TQH1qlkqGJoCDgQePSG4b6bU1cvaI9qf7J57uSHMF4rgVO71hhxWFPXRNrU7vVSk6WS1y8A='
}
```

### Build the Login

Our next step is going to be handling the other pathway in which we've found a result for the username.

We're going to need to check their password against the password that exists in the database.

This part is pretty simple, as we'll be doing this below the `results.length <= 0` section.

```ts
if (results.length <= 0) {
    // ignore this section
}

// you're going to write it here
```

We're going to get the 1st document from the results, and then check if the password matches.

```ts
// We'll get the first document
const document = results[0];

// Then we'll use the password checker to verify it matches
// If it does not match, it'll return false
if (!Rebar.utility.password.check(password, document.password)) {
    return false;
}

return true;
```

That's it for both Login and Registration!

## Handle Login

Now that we have a `document` for when the user either registers, or logs in we can use that document to bind it to the player in-game.

Binding essentially makes it really easy for us to write new data to an account.

### Handling the Document

We're going to create a shared async function that will handle the document and bind it to the player.

```ts
// server/index.ts

async function handleLogin(player: alt.Player, document: AccountExtended) {
    // This is what binds the account document type to the player
    const account = Rebar.document.account.useAccountBinder(player).bind(document);
}

alt.onRpc('authenticate:login', async (player: alt.Player, username: string, password: string) => {
    const db = Rebar.database.useDatabase();
    const results = await db.getMany<AccountExtended>({ username }, Rebar.database.CollectionNames.Accounts);

    if (results.length <= 0) {
        const pbkdf2Password = Rebar.utility.password.hash(password);
        const _id = await db.create({ username, password: pbkdf2Password }, Rebar.database.CollectionNames.Accounts);
        const document = await db.get<AccountExtended>({ _id }, Rebar.database.CollectionNames.Accounts);
        await handleLogin(player, document); // Callong the handle login function
        return true;
    }

    const document = results[0];
    if (!Rebar.utility.password.check(password, document.password)) {
        return false;
    }

    // Calling the handle login function
    await handleLogin(player, document);
    return true;
});
```

## Building a Character

Now that we've bound the account, we can use `account.getCharacters()` to find any characters the player might have on their account.

```ts
async function handleLogin(player: alt.Player, document: AccountExtended) {
    const account = Rebar.document.account.useAccountBinder(player).bind(document);
    const characters = await account.getCharacters();
    console.log(characters);
}
```

If you head in-game and register an account or login, you'll see an empty array logged to the console.

### Adding, and Loading a Character

Now we're going to add a character to this account, because they don't have any. It's almost exactly similar to the account process but we need to provide some character data. For the sake of this tutorial we'll be using the `username` as the character name.

```ts
// server/index.ts

if (characters.length <= 0) {
    // Grab the account identifier
    const accountId = account.getField<AccountExtended>('_id');

    // Grab the username
    const username = account.getField<AccountExtended>('username');

    // Create the character entry with account_id, and name
    const _id = await db.create<Character>(
        { account_id: accountId, name: username },
        Rebar.database.CollectionNames.Characters,
    );

    // Grab the created document
    const document = await db.get<Character>({ _id }, Rebar.database.CollectionNames.Characters);

    // Bind the character document to the player
    Rebar.document.character.useCharacterBinder(player).bind(document);

    // We're done!
    return;
}

// Otherwise, if they have a character. Grab the first result and bind it
Rebar.document.character.useCharacterBinder(player).bind(characters[0]);
```

## Final Step

Lastly we need to close the page when they've logged in successfully. We can do this hiding the page we've loaded and essentially resetting everything we've done to the game from server-side.

Let's take a moment to remember that we:

-   Froze the Player
-   Froze the Camera
-   Changed their Dimension
-   Made them invisible
-   Blurred the screen
-   Disabled the controls

### Finish Loading

Now we're going to make a function to reverse all of that, hide the page, and spawn the player somewhere.

```ts
function finish(player: alt.Player) {
    player.frozen = false;
    player.visible = true;
    player.dimension = 0;
    player.model = 'mp_m_freemode_01';
    player.spawn(
        new alt.Vector3({
            x: -864.1437377929688,
            y: -172.6201934814453,
            z: 37.799232482910156,
        }),
    );

    const rPlayer = Rebar.usePlayer(player);
    rPlayer.world.freezeCamera(false);
    rPlayer.world.clearScreenBlur(200);
    rPlayer.world.enableControls();
    rPlayer.webview.hide('Authentication');
}
```

Now we just need to add this `finish` function and call it wherever we bind the character. Add it immediately after binding the character.

Like this:

```ts
Rebar.document.character.useCharacterBinder(player).bind(document);
finish(player);
```

### We're done!

Now you can test the entire process all the way through.
