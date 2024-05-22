# Check

Check if a player has an account bound, or character bound.

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

Rebar.player.useStatus(somePlayer).hasCharacter(); // Returns true / false
Rebar.player.useStatus(somePlayer).hasAccount(); // Returns true / false
```
