<script lang="ts" setup>
import { ref } from 'vue';

type ClickType = 'none' | 'left' | 'middle' | 'right';

type EventCallbacks = {
    onLeftClick: [id: string];
    onDblClick: [id: string];
    onMiddleClick: [id: string];
    onRightClick: [id: string];
    onDrag: [id: string, endId: string];
    onDragStart: [id: string];
    onDragStop: [id: string];
};

const emits = defineEmits<EventCallbacks>();

const clickTypes: ClickType[] = ['none', 'left', 'middle', 'right'];
const coords = ref({ x: 0, y: 0 });
const lastClickTime = ref(Date.now());
const clickType = ref<ClickType>('none');
const id = ref<string>('');
const slotRef = ref<HTMLElement>();
const isDragged = ref(false);

let clonedElement: HTMLElement | undefined;

function mouseMove(ev: MouseEvent) {
    if (!clonedElement) {
        return;
    }

    coords.value = {
        x: ev.clientX,
        y: ev.clientY,
    };

    clonedElement.style.left = `${ev.clientX}px`;
    clonedElement.style.top = `${ev.clientY}px`;
}

function handleClick(ev: MouseEvent) {
    if (isDragged.value) {
        return;
    }

    clickType.value = clickTypes[ev.which];

    if (!slotRef.value) {
        return;
    }

    let refElement: HTMLElement | undefined = undefined;
    for (let child of slotRef.value.childNodes) {
        const childRef = child as HTMLElement;
        if (!childRef.id || childRef.id == '') {
            continue;
        }

        refElement = childRef;
        id.value = childRef.id;
        break;
    }

    if (typeof refElement === 'undefined') {
        return;
    }

    if (clickType.value === 'right') {
        emits('onRightClick', id.value);
        lastClickTime.value = Date.now();
        return;
    }

    if (clickType.value === 'middle') {
        emits('onMiddleClick', id.value);
        lastClickTime.value = Date.now();
        return;
    }

    if (Date.now() - lastClickTime.value <= 250) {
        emits('onDblClick', id.value);
        lastClickTime.value = Date.now();
        return;
    }

    clonedElement = refElement.cloneNode(true) as HTMLElement;
    clonedElement.classList.add('pointer-events-none');
    clonedElement.classList.add('bg-opacity-75');
    clonedElement.classList.add('fixed');
    document.body.append(clonedElement);

    document.addEventListener('mouseup', stop);
    document.addEventListener('mousemove', mouseMove);
    lastClickTime.value = Date.now();
    isDragged.value = true;

    emits('onDragStart', id.value);
}

function stop(ev: MouseEvent) {
    const totalDragTime = Date.now() - lastClickTime.value;
    isDragged.value = false;

    if (typeof clonedElement !== 'undefined') {
        clonedElement.remove();
        clonedElement = undefined;
    }

    document.removeEventListener('mouseup', stop);
    document.removeEventListener('mousemove', mouseMove);

    if (totalDragTime <= 120) {
        emits('onLeftClick', id.value as string);
        return;
    }

    const el = ev.target as HTMLElement;
    if (!el || !el.id) {
        emits('onDragStop', id.value);
        return;
    }

    if (el.id === id.value) {
        emits('onDragStop', id.value);
        return;
    }

    emits('onDrag', id.value, el.id);
    emits('onDragStop', id.value);
}

function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
}
</script>

<template>
    <div @mousedown="handleClick" @contextmenu="handleContextMenu" ref="slotRef" class="select-none">
        <slot></slot>
    </div>
</template>
