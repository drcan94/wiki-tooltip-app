import { createAttachmentKey } from "svelte/attachments";
import type { Attachment } from "svelte/attachments";
import tippy from "tippy.js";

// Create attachment keys
export const tooltipKey = createAttachmentKey();
export const highlightKey = createAttachmentKey();

// Browser compatibility check
const isBrowserCompatible =
  typeof window !== "undefined" &&
  typeof Element !== "undefined" &&
  typeof Element.prototype.append === "function";

// Tooltip oluşturmak için attachment
export function createTooltip(content: string): Attachment {
  return (element) => {
    // Element kontrolleri
    if (!element || !(element instanceof HTMLElement)) {
      console.error("Geçersiz element:", element);
      return () => {}; // Boş temizleme fonksiyonu
    }

    if (!isBrowserCompatible) {
      console.warn("Browser might not be fully compatible with tooltips");
      return () => {};
    }

    let tip: any = null;

    try {
      // Simple fallback for old browsers
      if (typeof tippy !== "function") {
        element.title = content;
        return () => {
          element.title = "";
        };
      }

      tip = tippy(element, {
        content,
        theme: "light",
        arrow: true,
        delay: [100, 0],
        placement: "bottom",
        animation: "scale",
        appendTo: document.body,
        inertia: true,
        interactive: true,
        trigger: "mouseenter",
        maxWidth: 300,
        duration: [200, 0],
        hideOnClick: false,
      });
    } catch (error) {
      console.error("Tippy oluşturulurken hata:", error);
      // Fallback to title attribute if tippy fails
      element.title = content;
      return () => {
        element.title = "";
      };
    }

    return () => {
      try {
        if (tip && typeof tip.destroy === "function") {
          tip.destroy();
        }
      } catch (error) {
        console.error("Tippy.js temizlenirken hata:", error);
        element.title = "";
      }
    };
  };
}

// Highlight efekti için attachment
export function createHighlight(color: string = "#fff9c4"): Attachment {
  return (element) => {
    // Element kontrolü
    if (!element || !(element instanceof HTMLElement)) {
      console.error("Geçersiz element:", element);
      return () => {}; // Boş temizleme fonksiyonu
    }

    if (!isBrowserCompatible) {
      console.warn("Browser might not be fully compatible with highlights");
      return () => {};
    }

    try {
      // HTMLElement'e cast et
      const htmlElement = element as HTMLElement;

      // Orijinal rengi kaydet
      const originalBg = htmlElement.style.backgroundColor;
      const originalTransition = htmlElement.style.transition;

      // Highlight stilini uygula
      htmlElement.style.transition = "background-color 0.3s ease";
      htmlElement.style.backgroundColor = color;

      // Hover efekti
      const mouseEnter = () => {
        htmlElement.style.backgroundColor = "#ffeb3b";
      };

      const mouseLeave = () => {
        htmlElement.style.backgroundColor = color;
      };

      htmlElement.addEventListener("mouseenter", mouseEnter);
      htmlElement.addEventListener("mouseleave", mouseLeave);

      // Temizleme fonksiyonu
      return () => {
        try {
          htmlElement.style.backgroundColor = originalBg;
          htmlElement.style.transition = originalTransition;
          htmlElement.removeEventListener("mouseenter", mouseEnter);
          htmlElement.removeEventListener("mouseleave", mouseLeave);
        } catch (error) {
          console.error("Highlight temizlenirken hata:", error);
        }
      };
    } catch (error) {
      console.error("Highlight uygulanırken hata:", error);
      return () => {};
    }
  };
}

// Props içinde attachment oluşturmak için yardımcı fonksiyon
export function createAttachmentProps(
  content: string,
  highlightColor: string = "#fff9c4"
) {
  return {
    [tooltipKey]: createTooltip(content),
    [highlightKey]: createHighlight(highlightColor),
  };
}
