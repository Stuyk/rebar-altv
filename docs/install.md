---
order: 99
---

# Installation

Ensure you are on a **Windows Machine**

!!!
Hey listen! When you run Rebar for the first time, you won't be able to spawn.

This is simply for server setup, and getting started.

Check out some [Plugins](<https://forge.plebmasters.de/hub?targetFrameworks=Rebar+(alt:V)&contentType=Script>) to get everything working!
!!!

## Programs to Install

This is not optional, install these programs.

-   [Git](https://git-scm.com/downloads)
-   [Node.js](https://nodejs.org/en/download)
-   [pnpm](https://pnpm.io/installation)
-   [VSCode](https://code.visualstudio.com/download)
-   [MongoDB Server](https://www.mongodb.com/try/download/community)
    -   Ensure that if you are running it locally, do not set a database password.
    -   When you move your server to production use something like [MongoDB Atlas](https://www.mongodb.com/atlas/database)

Additionally, if you are having trouble installing `pnpm` you can run this command in a `Powershell Window` with `Admin` **Enabled**.

```
set-executionpolicy unrestricted
```

## Setup

!!!
Never run the `altv-server` binary directly, you should use `pnpm` commands
!!!

---

Open a `terminal` and `clone` the repository somewhere.

```
git clone https://github.com/Stuyk/rebar-altv/
```

### Navigate into Rebar

```
cd rebar-altv
```

### Install

```
pnpm install
```

### Download Binaries

```
pnpm binaries
```

### Start

```
pnpm start
```
