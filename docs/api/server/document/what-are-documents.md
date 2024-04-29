---
order: 100
---

# What are Documents?

Documents are what are stored inside of MongoDB.

Evey document has an `_id` which is a string of characters.

That string of characters can be used to quickly pull down any document.

Documents require the developer to assign the data once, and once that data is assigned it will only push data out to the database automatically while using document functionality.

We're effectively reading data once.

## Editing Data in the Database

When you edit data inside of the database it will not be automatically bound to the player.

Editing data is usually done through a tool like MongoDB Compass.

This is because documents work in a way that pushes data out rather than reading the data constantly from the databse.

We do this to increase the overall performance of the gamemode for larger servers.

If you wish to update data of a user in a database, you must also `rebind` that data to the user.

Rebinding means to pull the data down from the database again and then assign it to the user again.
