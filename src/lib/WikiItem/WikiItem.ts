import tippy from "tippy.js";
import type { Attachment } from "svelte/attachments";

// Tooltip oluşturmak için attachment factory
export function createTooltip(content: string): Attachment {
  return (element) => {
    try {
      // Fallback for older browsers
      if (typeof tippy !== "function") {
        if (element instanceof HTMLElement) {
          element.title = content;
          return () => {
            if (element instanceof HTMLElement) {
              element.title = "";
            }
          };
        }
        return () => {};
      }

      const tip = tippy(element, {
        content,
        theme: "light",
        arrow: true,
        delay: [100, 0],
        animation: "scale",
      });

      return () => {
        try {
          if (tip && typeof tip.destroy === "function") {
            tip.destroy();
          }
        } catch (error) {
          console.error("Tippy temizlenirken hata:", error);
          if (element instanceof HTMLElement) {
            element.title = "";
          }
        }
      };
    } catch (error) {
      console.error("Tooltip oluşturulurken hata:", error);
      // Fallback to title
      if (element instanceof HTMLElement) {
        element.title = content;
        return () => {
          if (element instanceof HTMLElement) {
            element.title = "";
          }
        };
      }
      return () => {};
    }
  };
}
