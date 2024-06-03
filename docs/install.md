---
order: 99
---

# Installation

!!!
Hey listen! When you run Rebar for the first time, you won't be able to spawn.

This is simply for server setup, and getting started.

Check out some [Plugins](<https://forge.plebmasters.de/hub?targetFrameworks=Rebar+(alt:V)&contentType=Script>) to get everything working!
!!!

## 1. Programs to Install

Install these programs.

-   [Git](https://git-scm.com/downloads)
-   [Node.js](https://nodejs.org/en/download)
-   [pnpm](https://pnpm.io/installation)
-   [MongoDB Server](https://www.mongodb.com/try/download/community)
    -   Ensure that if you are running it locally, do not set a database password.
    -   When you move your server to production use something like [MongoDB Atlas](https://www.mongodb.com/atlas/database)

If you are having trouble installing `pnpm` you can run this command in a `Powershell Window` with `Admin` **Enabled**.

```
set-executionpolicy unrestricted
```

These are optional but recommended if developing

-   [VSCode](https://code.visualstudio.com/download)

---

## 2. Clone the Repository

Open a `terminal` and `clone` the repository somewhere.

```
git clone https://github.com/Stuyk/rebar-altv/
```

### Navigate into Rebar

```
cd rebar-altv
```

---

## 3a. Windows

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

---

## 3b. Linux

Last installation was tested on Ubuntu 22.04+

### Install libatomic

```
sudo apt-get update 
sudo apt-get install libatomic1
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
pnpm start:linux
```

---

## 3c. Docker

Follow all of the instructions above.

Build with `pnpm build:docker` and then run `./altv-server`.