# Clothing

When you have `dlc` clothing or just need to use clothing in general.

This utility provides a lot of useful information for available clothing maximum values.

!!!
You should 100% use an rpc on server-side to get categories and keep it simple for your userbase.
!!!

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();

// Get all dlc names / categories for male and female
const maleCategories = Rebar.utility.clothing.getCategories('male');
const femaleCategories = Rebar.utility.clothing.getCategories('female');

// Get maximums for a given category
const maximums = Rebar.utility.clothing.getCategory('mp_m_valentines_02');
console.log(maximums.clothes);
console.log(maximums.props);

// Add a custom DLC, will be gettable via categories
// If you set this on server-side, it's only available server-side
// If you set this on client-side, it's only available client-side
// If you set this in webview, it's only available in webview
// What you should do is set it server-side, and use an RPC to get all category data :)
Rebar.utility.clothing.addCategory('my_custom_dlc', { clothes: { 0: 5, 6: 5 }, props: {} });
```
