import type { Attachment } from "svelte/attachments";

// Attachment to add custom keyboard navigation
export function createKeyboardNav(): Attachment {
  return (element) => {
    // Find all focusable elements inside
    const findFocusable = () => {
      return Array.from(
        element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => {
        // Only get visible elements
        const style = window.getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
      }) as HTMLElement[];
    };

    let focusableEls = findFocusable();
    let currentFocus = -1;

    // Keyboard navigation handler
    const handleKeyDown = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      // Only handle keys inside our component
      if (!element.contains(document.activeElement)) return;

      // Update focusable elements in case DOM changed
      focusableEls = findFocusable();

      // Handle arrow keys
      if (keyEvent.key === "ArrowDown" || keyEvent.key === "ArrowRight") {
        keyEvent.preventDefault();
        currentFocus = (currentFocus + 1) % focusableEls.length;
        focusableEls[currentFocus].focus();
      } else if (keyEvent.key === "ArrowUp" || keyEvent.key === "ArrowLeft") {
        keyEvent.preventDefault();
        currentFocus =
          (currentFocus - 1 + focusableEls.length) % focusableEls.length;
        focusableEls[currentFocus].focus();
      } else if (keyEvent.key === "Home") {
        keyEvent.preventDefault();
        currentFocus = 0;
        focusableEls[currentFocus].focus();
      } else if (keyEvent.key === "End") {
        keyEvent.preventDefault();
        currentFocus = focusableEls.length - 1;
        focusableEls[currentFocus].focus();
      }
    };

    // Check for mutations (dynamic content)
    const observer = new MutationObserver(() => {
      focusableEls = findFocusable();
    });

    // Initialize
    observer.observe(element, {
      childList: true,
      subtree: true,
    });
    element.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      observer.disconnect();
      element.removeEventListener("keydown", handleKeyDown);
    };
  };
}

// Attachment to add ARIA attributes dynamically
export function createAriaAttachment(
  role: string,
  ariaLabel?: string
): Attachment {
  return (element) => {
    // Store original values
    const originalRole = element.getAttribute("role");
    const originalLabel = element.getAttribute("aria-label");

    // Set ARIA attributes
    element.setAttribute("role", role);
    if (ariaLabel) element.setAttribute("aria-label", ariaLabel);

    // Add highlight when element receives focus
    const focusHandler = () => {
      element.classList.add("a11y-highlight");
    };

    const blurHandler = () => {
      element.classList.remove("a11y-highlight");
    };

    element.addEventListener("focus", focusHandler, true);
    element.addEventListener("blur", blurHandler, true);

    // Clean up
    return () => {
      // Restore original attributes
      if (originalRole) element.setAttribute("role", originalRole);
      else element.removeAttribute("role");

      if (originalLabel) element.setAttribute("aria-label", originalLabel);
      else element.removeAttribute("aria-label");

      // Remove event listeners
      element.removeEventListener("focus", focusHandler, true);
      element.removeEventListener("blur", blurHandler, true);
    };
  };
}

// Announce changes for screen readers
export function createAnnouncer(): Attachment {
  return (element) => {
    // Create the live region that's truly invisible
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.classList.add("sr-only");

    // Position it absolutely to prevent layout shifts
    liveRegion.style.position = "absolute";
    liveRegion.style.width = "1px";
    liveRegion.style.height = "1px";
    liveRegion.style.padding = "0";
    liveRegion.style.margin = "-1px";
    liveRegion.style.overflow = "hidden";
    liveRegion.style.clip = "rect(0, 0, 0, 0)";
    liveRegion.style.whiteSpace = "nowrap";
    liveRegion.style.border = "0";

    // Add it to the component but in a way that doesn't affect layout
    document.body.appendChild(liveRegion);

    // Method to announce messages
    const announce = (message: string) => {
      liveRegion.textContent = "";
      // Small delay to ensure screen readers catch the change
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 50);
    };

    // Add this method to the element
    (element as any).announce = announce;

    // Clean up
    return () => {
      document.body.removeChild(liveRegion);
      delete (element as any).announce;
    };
  };
}
