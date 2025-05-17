import { createTooltip } from "../attachment-utils";
import type { Action } from "svelte/action";
import tippy from "tippy.js";

// Action kullanım örneği - use: direktifi için
export const tooltip: Action<HTMLElement, string> = (node, content) => {
  // Tippy instance
  let tip: any = null;

  // Tooltip oluşturma
  try {
    if (typeof tippy !== "function") {
      node.title = content || "";
    } else {
      tip = tippy(node, {
        content: content || "Tooltip içeriği",
        theme: "light",
        arrow: true,
        delay: [100, 0],
        placement: "bottom",
      });
    }
  } catch (error) {
    console.error("Tooltip oluşturulurken hata:", error);
    node.title = content || "";
  }

  // Svelte action API
  return {
    // Parametrenin değiştiğinde
    update(newContent: string) {
      content = newContent;
      if (tip && typeof tip.setContent === "function") {
        tip.setContent(content);
      } else {
        node.title = content || "";
      }
    },
    // Component yok edildiğinde
    destroy() {
      try {
        if (tip && typeof tip.destroy === "function") {
          tip.destroy();
        } else if (node.title) {
          node.title = "";
        }
      } catch (error) {
        console.error("Tooltip temizlenirken hata:", error);
        node.title = "";
      }
    },
  };
};

// Highlight action örneği - use: direktifi için
export const highlight: Action<HTMLElement, string> = (
  node,
  color = "#fff9c4"
) => {
  // Element state
  const originalBg = node.style.backgroundColor;
  const originalTransition = node.style.transition;

  // Highlight stilini uygula
  node.style.transition = "background-color 0.3s ease";
  node.style.backgroundColor = color;

  // Hover efekti
  const mouseEnter = () => {
    node.style.backgroundColor = "#ffeb3b";
  };

  const mouseLeave = () => {
    node.style.backgroundColor = color;
  };

  node.addEventListener("mouseenter", mouseEnter);
  node.addEventListener("mouseleave", mouseLeave);

  // Svelte action API
  return {
    // Parametrenin değiştiğinde
    update(newColor: string) {
      color = newColor;
      node.style.backgroundColor = color;
    },
    // Component yok edildiğinde
    destroy() {
      node.style.backgroundColor = originalBg;
      node.style.transition = originalTransition;
      node.removeEventListener("mouseenter", mouseEnter);
      node.removeEventListener("mouseleave", mouseLeave);
    },
  };
};

// Manuel tooltip uygulama mantığı
export function setupManualTooltip() {
  let isMounted = false;

  function onMount() {
    if (isMounted) return;

    const tooltipTarget = document.getElementById("tooltip-target");
    if (tooltipTarget) {
      // Tooltip oluştur ve uygula
      const tooltipAttachment = createTooltip("Manuel olarak eklenen tooltip");
      tooltipAttachment(tooltipTarget);
    }

    isMounted = true;
  }

  // Component DOM'a eklendiğinde
  if (typeof window !== "undefined") {
    setTimeout(onMount, 100);
  }
}
