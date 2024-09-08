# Draggable Component

The draggable component is a built-in component that allows you to wrap up any code to make it draggable.

This is a one-stop solution for building moveable inventories, and drag & drop interfaces.

The most important part of a draggable component is that it contains an `id`.

This is what helps the draggable element decide what to send back.

```html
<Draggable
    @onDrag="handleDrag"
    @onLeftClick="handleClick"
    @onDblClick="handleDoubleClick"
    @onMiddleClick="handleMiddleClick"
    @onRightClick="handleRightClick"
>
    <div class="size-32 bg-red-500" id="item-a">Item A</div>
</Draggable>
```

!!!
Did you know that in alt:V we don't have access to HTML5 Drag APIs, that's why this exists.
!!!

## Example Page

This is an example page showing 2 draggable divs that can be dragged over each other.

They print their status into the console.

```html
<script lang="ts" setup>
    import Draggable from '../../../../webview/src/components/Draggable.vue';

    function handleDrag(from_id: string, to_id: string) {
        console.log(`drag: `, from_id, to_id);
    }

    function handleClick(id: string) {
        console.log('left-click: ', id);
    }

    function handleDoubleClick(id: string) {
        console.log('dbl-click: ', id);
    }

    function handleMiddleClick(id: string) {
        console.log('middle-click: ', id);
    }

    function handleRightClick(id: string) {
        console.log('right-click: ', id);
    }
</script>

<template>
    <div class="flex flex-row gap-2">
        <Draggable
            @onDrag="handleDrag"
            @onLeftClick="handleClick"
            @onDblClick="handleDoubleClick"
            @onMiddleClick="handleMiddleClick"
            @onRightClick="handleRightClick"
        >
            <div class="size-32 bg-red-500" id="item-a">Item A</div>
        </Draggable>
        <Draggable
            @onDrag="handleDrag"
            @onLeftClick="handleClick"
            @onDblClick="handleDoubleClick"
            @onMiddleClick="handleMiddleClick"
            @onRightClick="handleRightClick"
        >
            <div class="size-32 bg-red-500" id="item-b">Item B</div>
        </Draggable>
    </div>
</template>
```
