---
order: 750
---

# document

Documents are what are stored inside of MongoDB. Evey document has an `_id` which is a string of characters. That string of characters can be used to quickly pull down any document.

Documents require the developer to assign the data once, and once that data is assigned it will only push data out to the database automatically while using document functionality.

We are effectively reading data once on login, and pushing data outwards only.

!!!
Documents that are edited through the Database are not automatically updated in the server cache, they must be retrieved again to update them while the server is running.
!!!

## Document Types

A document is a set of data that is bound to a player or vehicle until they disconnect or are destroyed.
It automatically saves data to the MongoDB database when any `set` or `setBulk` function is used.

### Account

Account data usually includes email, password, discord info, ban status, etc.

You should bind account data after authenticating to the server.

### Character

Character data usually includes appearance, name, clothes, inventory, money, etc.

You should bind character data after fetching call characters owned by an account.

### Global

These documents work differently than the other documents, they're used as a single document to store a lot of data.

Meanining; they're great for tracking very specific things. Such as global player deaths, global money spent, etc.

### Vehicle

Vehicle data usually includes model, paint, mods, ownership, etc.

Only owned vehicles should be given a document.

### Virtual

Virtual documents allow you to interface with any document type and use with a similar interface to `useAccount`, `useCharacter`, `useVehicle`, etc.
