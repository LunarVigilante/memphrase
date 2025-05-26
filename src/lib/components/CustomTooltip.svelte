<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  export let text = ""; // The tooltip text
  export let position: 'top' | 'bottom' | 'left' | 'right' = "top";
  export let active = true; // Prop to externally control if tooltip can be shown

  let show = false;
  let hostElement: HTMLElement;
  // let tooltipElement: HTMLElement; // Not strictly needed if not measuring its size post-render for complex positioning

  const dispatch = createEventDispatcher();

  let enterTimeout: ReturnType<typeof setTimeout>;
  let leaveTimeout: ReturnType<typeof setTimeout>;
  const hoverDelay = 200; // ms to wait before showing/hiding

  function handlePointerEnter() {
    if (!active || !text) return;
    clearTimeout(leaveTimeout);
    enterTimeout = setTimeout(() => {
      show = true;
      dispatch('tooltipOpen');
    }, hoverDelay);
  }

  function handlePointerLeave() {
    if (!active) return;
    clearTimeout(enterTimeout);
    leaveTimeout = setTimeout(() => {
      show = false;
      dispatch('tooltipClose');
    }, hoverDelay / 2); // Hide a bit faster
  }
  
  function handleFocusIn() {
    if (!active || !text) return;
    clearTimeout(leaveTimeout);
    show = true;
    dispatch('tooltipOpen');
  }

  function handleFocusOut() {
    if (!active) return;
    show = false;
    dispatch('tooltipClose');
  }

  // Basic positioning logic (can be expanded)
  // Using Tailwind classes directly in the template is often cleaner for Svelte if possible,
  // but for dynamic absolute positioning, style attribute is sometimes necessary.
  $: tooltipClasses = (() => {
    // Added shadow-xl to the base classes
    let base = "absolute z-50 px-3 py-2 text-xs font-medium text-gray-200 bg-slate-800 rounded-lg shadow-xl whitespace-normal break-words min-w-[120px] max-w-[500px] text-center transition-opacity duration-200";
    // For more complex positioning, JS is needed after mount to get element dimensions.
    // This basic example will rely on transform for centering.
    if (position === 'top') return `${base} bottom-full left-1/2 -translate-x-1/2 mb-2`;
    if (position === 'bottom') return `${base} top-full left-1/2 -translate-x-1/2 mt-2`;
    if (position === 'left') return `${base} right-full top-1/2 -translate-y-1/2 mr-2`;
    if (position === 'right') return `${base} left-full top-1/2 -translate-y-1/2 ml-2`;
    return `${base} bottom-full left-1/2 -translate-x-1/2 mb-2`; // Default to top
  })();

  $: arrowClasses = (() => {
    let base = "absolute w-0 h-0 border-solid border-transparent";
    let color = "border-slate-800"; // Should match tooltip bg

    if (position === 'top') return `${base} border-t-${color} border-[6px] top-full left-1/2 -translate-x-1/2`;
    if (position === 'bottom') return `${base} border-b-${color} border-[6px] bottom-full left-1/2 -translate-x-1/2`;
    if (position === 'left') return `${base} border-l-${color} border-[6px] left-full top-1/2 -translate-y-1/2`;
    if (position === 'right') return `${base} border-r-${color} border-[6px] right-full top-1/2 -translate-y-1/2`;
    return `${base} border-t-${color} border-[6px] top-full left-1/2 -translate-x-1/2`; // Default to top arrow
  })();

  // Clear timeouts on destroy to prevent memory leaks
  onDestroy(() => {
    clearTimeout(enterTimeout);
    clearTimeout(leaveTimeout);
  });

</script>

<div
  class="tooltip-host relative"
  bind:this={hostElement}
  on:pointerenter={handlePointerEnter} 
  on:pointerleave={handlePointerLeave}
  on:focusin={handleFocusIn}
  on:focusout={handleFocusOut}
>
  <slot></slot>

  {#if show && text && active}
    <div
      role="tooltip"
      class="{tooltipClasses}" 
      transition:fade={{ duration: 150 }}
      aria-live="polite"
    >
      {@html text} <!-- Use @html if text can contain simple formatting like <br> -->
      <div class="{arrowClasses}"></div>
    </div>
  {/if}
</div> 