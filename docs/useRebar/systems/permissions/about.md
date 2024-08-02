---
title: About permissions
order: a
---

# About Player Permissions

There is a documentation for permission system that allows you to control what players can and cannot do.

Rebar exposes the same interface for both account and character permissions.
This means that you can use almost the same code to check permissions regardless of the source.

Also, Rebar allows you to modify permissions when player is offline, with use of [`useVirtualDocument`](/userebar/document/document-virtual/).

## Permission resolution order

When checking permissions, Rebar will check permissions in the following order:

1. Account
2. Account's groups
3. Character
4. Character's groups

This means that if you want to grant a permission to all player's characters, you should set it on the account level.

## Useful links

### Player permissions
[!ref Account permissions](/userebar/systems/permissions/playerPermissions.md#useaccount)
[!ref Character permissions](/userebar/systems/permissions/playerPermissions.md#usecharacter)
[!ref Virtual document permissions](/userebar/systems/permissions/playerPermissions.md#usevirtual)

### Player groups
[!ref Account groups](/userebar/systems/permissions/playerGroups.md#useaccount)
[!ref Character groups](/userebar/systems/permissions/playerGroups.md#usecharacter)
[!ref Virtual document groups](/userebar/systems/permissions/playerGroups.md#usevirtual)

### Using groups
[!ref usePermissionGroup](/userebar/systems/permissions/usePermissionGroup.md)

### Checking permissions
[!ref usePermissions](/userebar/systems/permissions/usePermissions.md)
[!ref useEntityPermissions](/userebar/systems/permissions/useEntityPermissions.md)
