---
order: 99
---

# Installation

Ensure you are on a **Windows Machine**.

## Programs to Install

This is not optional, install these programs.

-   [Git](https://git-scm.com/downloads)
-   [Node.js](https://nodejs.org/en/download)
-   [pnpm](https://pnpm.io/installation)
-   [VSCode](https://code.visualstudio.com/download)
-   [MongoDB Server](https://www.mongodb.com/try/download/community)
    -   Ensure that if you are running it locally, do not set a database password.
    -   When you move your server to production use something like [MongoDB Atlas](https://www.mongodb.com/atlas/database)

## Setup

!!!
Never run the `altv-server` binary directly, you must use `pnpm` commands
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
