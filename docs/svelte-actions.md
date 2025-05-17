# Svelte Actions Usage Guide

This guide explains the different approaches to using actions in Svelte in detail. It covers the innovations that came with Svelte 5 and various usage scenarios.

## Table of Contents

1. [What Are Actions?](#what-are-actions)
2. [Traditional Approach (update/destroy)](#traditional-approach)
3. [Modern Approach ($effect)](#modern-approach)
4. [Differences Between the Two Approaches](#differences)
5. [Usage Scenarios](#usage-scenarios)
6. [Action vs Attachment](#action-vs-attachment)
7. [Performance Evaluation](#performance)
8. [Best Practices](#best-practices)

<a id="what-are-actions"></a>
## 1. What Are Actions?

Actions are a way to add behavior to DOM elements. They are used with the `use:` directive in Svelte and run when an element is mounted to the DOM. Typical use cases include:

- Integrating third-party libraries (tooltips, form validation, etc.)
- Adding special behaviors to DOM elements
- Managing side effects outside of components

Basic action template:

```typescript
import type { Action } from 'svelte/action';

const myAction: Action<HTMLElement, any> = (node, parameter) => {
  // When the DOM element is mounted
  
  // Cleanup/update code
};
```

<a id="traditional-approach"></a>
## 2. Traditional Approach (update/destroy)

The traditional approach, used since the early versions of Svelte, is based on an action returning an object. This object can specifically contain two methods:

- `update`: Called when action parameters change
- `destroy`: Called when the element is removed from the DOM (unmounted)

### Example Code:

```typescript
import type { Action } from 'svelte/action';
import tippy from 'tippy.js';

export const tooltip: Action<HTMLElement, string> = (node, content) => {
  // Tippy instance
  let tip = tippy(node, {
    content: content || "Tooltip content",
    theme: "light",
    arrow: true,
  });

  // Svelte action API
  return {
    // When the parameter changes
    update(newContent: string) {
      content = newContent;
      tip.setContent(content);
    },
    // When the component is destroyed
    destroy() {
      tip.destroy();
    }
  };
};
```

### Advantages:

- **General Compatibility**: Works in all Svelte versions (3.x, 4.x, 5.x)
- **Clear Interface**: Lifecycle methods are distinct and understandable
- **TypeScript Support**: Well-defined type definitions for actions

### Disadvantages:

- **Separate Logic**: Initialization, update, and destruction logic must be defined separately
- **State Sharing**: State sharing between update and destroy methods is done through closure
- **More Code**: May require boilerplate code that could be unnecessary in some cases

<a id="modern-approach"></a>
## 3. Modern Approach ($effect)

The recommended approach for Svelte 5.29 and later is to use the `$effect` rune. This approach provides a more reactive and less code-intensive experience.

### Important Note

`$effect` runes can **only be used in `.svelte` and `.svelte.js/ts` files**. They cannot be used in regular `.ts` or `.js` files.

### Example Code:

```svelte
<script lang="ts">
  import type { Action } from 'svelte/action';
  import tippy from 'tippy.js';

  const tooltip: Action<HTMLElement, string> = (node, content) => {
    let tip: any = null;
    
    $effect(() => {
      // Create tooltip
      tip = tippy(node, {
        content: content || "Tooltip content",
        theme: "light",
        arrow: true,
      });
      
      // Cleanup function - will run when the element is unmounted
      return () => {
        if (tip) tip.destroy();
      };
    });
  };
</script>
```

### Advantages:

- **Less Code**: Shorter, more readable code
- **Reactivity**: Better integration with Svelte's reactivity system
- **Single Location**: Initialization and cleanup logic are defined in the same place
- **Clear Intent**: Cleanup logic is explicitly defined with the return statement

### Disadvantages:

- **Limited Usage**: Can only be used in .svelte files
- **New Concept**: May create a learning curve for new Svelte users
- **Parameter Change Tracking**: May require extra reactivity code to track parameter changes

<a id="differences"></a>
## 4. Differences Between the Two Approaches

| Feature | Traditional Approach | Modern Approach |
|---------|---------------------|-----------------|
| **File Compatibility** | Works in all file types | Only works in .svelte and .svelte.js/ts files |
| **Parameter Change** | Managed with the `update` method | No automatic reactivity, may require manual tracking |
| **Cleanup** | Done with the `destroy` method | Done with a function returned from within `$effect` |
| **Reactivity** | Not explicit | Integrated with Svelte's reactivity system |
| **Readability** | More code, clear interface | Less code, more fluid |
| **Svelte Version** | Works in all versions | Requires ≥ 5.29 |

<a id="usage-scenarios"></a>
## 5. Usage Scenarios

### When to Use the Traditional Approach:

- When you're developing a code package/component and need wide compatibility
- When you need to define actions in `.ts` or `.js` files
- When you want to manually track parameter changes
- When you have pre-Svelte experience and prefer the approach you're familiar with

### When to Use the Modern Approach:

- When working directly in .svelte files
- When you want to create simple, readable logic with less boilerplate code
- When you're using Svelte 5.29+ and have access to modern features
- When you prefer reactivity-focused programming techniques

<a id="action-vs-attachment"></a>
## 6. Action vs Attachment

With Svelte 5, the concept of "attachments" has been introduced as an alternative to actions. The key differences between them are:

### Actions:
- Used with the `use:` directive
- Tied to component lifecycle
- Requires manual management of parameter changes
- Especially suitable for DOM manipulation

### Attachments:
- Used with the `{@attach}` directive
- Provides a more compositional approach
- Provides lifecycle management at the element level
- More declarative and reactive
- A more modern Svelte approach

### Example:

```svelte
<!-- Action usage -->
<button use:tooltip={'This is a tooltip'}>Button</button>

<!-- Attachment usage -->
<button {@attach createTooltip('This is a tooltip')}>Button</button>
```

<a id="performance"></a>
## 7. Performance Evaluation

From a performance perspective, there is no significant difference between the two approaches, but some subtle details should be considered:

- The `$effect` approach may be more optimized in some cases as it integrates better with Svelte's reactivity system
- The traditional approach can more easily track parameter changes because it has an `update` method
- For large projects, especially actions with frequently updated parameter values, the traditional approach may provide finer control

<a id="best-practices"></a>
## 8. Best Practices

### For Both Approaches:

- Actions should achieve a specific task and not have multiple responsibilities
- Use typing (`Action<Node, Params, Events>`)
- Implement error handling with try-catch blocks
- Check browser compatibility
- Keep DOM manipulations to a minimum

### For the Traditional Approach:

```typescript
export const myAction: Action<HTMLElement, MyParams> = (node, params) => {
  // Initial setup
  setupSomething(node, params);
  
  return {
    update(newParams) {
      // When parameters change, reconfigure
      cleanupPrevious(node);
      setupSomething(node, newParams);
    },
    destroy() {
      // Complete cleanup
      cleanupEverything(node);
    }
  };
};
```

### For the Modern Approach:

```svelte
<script>
  export const myAction: Action<HTMLElement, MyParams> = (node, params) => {
    $effect(() => {
      // Setup
      setupSomething(node, params);
      
      // Cleanup
      return () => cleanupEverything(node);
    });
  };
</script>
```

## Conclusion

Svelte actions are a powerful way to add behavior to DOM elements. Both traditional and modern approaches have their own advantages. It's important to choose the most appropriate approach based on your project's needs and your working environment.

With Svelte 5, attachments have become a powerful alternative to actions, and it's beneficial to consider this new approach for new projects. 