import type { Attachment } from "svelte/attachments";

interface EventState {
  isHovering: boolean;
  clickCount: number;
  lastClickTime: number;
  totalHoverTime: number;
  hoverStartTime: number;
}

export function createEventTracker(): Attachment {
  return (element) => {
    const htmlElement = element as HTMLElement;

    let state: EventState = {
      isHovering: false,
      clickCount: 0,
      lastClickTime: 0,
      totalHoverTime: 0,
      hoverStartTime: 0,
    };

    // Olay durum metriklerini görüntülemek için elementler oluştur
    const createElements = () => {
      const counterEl = document.createElement("div");
      counterEl.className = "event-counter";
      counterEl.innerHTML = "<span>0</span><small>tıklama</small>";

      const messageEl = document.createElement("div");
      messageEl.className = "event-message";
      messageEl.textContent = "Üzerime gel ve tıkla";

      const statsEl = document.createElement("div");
      statsEl.className = "event-stats";
      statsEl.innerHTML = `
        <div class="stat">
          <span class="stat-value hover-time">0s</span>
          <small>Hover Süresi</small>
        </div>
        <div class="stat">
          <span class="stat-value last-click">-</span>
          <small>Son Tıklama</small>
        </div>
      `;

      htmlElement.innerHTML = "";
      htmlElement.appendChild(messageEl);
      htmlElement.appendChild(counterEl);
      htmlElement.appendChild(statsEl);
    };

    createElements();

    // Referans elementleri
    const messageEl = htmlElement.querySelector(
      ".event-message"
    ) as HTMLElement;
    const counterEl = htmlElement.querySelector(
      ".event-counter span"
    ) as HTMLElement;
    const hoverTimeEl = htmlElement.querySelector(".hover-time") as HTMLElement;
    const lastClickEl = htmlElement.querySelector(".last-click") as HTMLElement;

    // Hover süresini hesaplamak için interval
    let hoverInterval: number | null = null;

    const updateHoverTime = () => {
      if (state.isHovering) {
        const now = Date.now();
        state.totalHoverTime += (now - state.hoverStartTime) / 1000;
        state.hoverStartTime = now;
        hoverTimeEl.textContent = state.totalHoverTime.toFixed(1) + "s";
      }
    };

    const updateDisplay = () => {
      counterEl.textContent = state.clickCount.toString();

      if (state.isHovering) {
        messageEl.textContent = `Üstümdesin!`;
        htmlElement.classList.add("is-hovered");
      } else {
        messageEl.textContent = `Üzerime gel ve tıkla`;
        htmlElement.classList.remove("is-hovered");
      }
    };

    const handleMouseEnter = () => {
      state.isHovering = true;
      state.hoverStartTime = Date.now();
      htmlElement.classList.add("is-hovered");
      updateDisplay();

      // Hover süresini takip et
      hoverInterval = window.setInterval(updateHoverTime, 100);
    };

    const handleMouseLeave = () => {
      state.isHovering = false;
      htmlElement.classList.remove("is-hovered");
      updateDisplay();

      // Hover süresi hesaplamayı durdur
      if (hoverInterval) {
        clearInterval(hoverInterval);
        hoverInterval = null;
      }

      // Son hover süresini ekle
      if (state.hoverStartTime > 0) {
        state.totalHoverTime += (Date.now() - state.hoverStartTime) / 1000;
        state.hoverStartTime = 0;
        hoverTimeEl.textContent = state.totalHoverTime.toFixed(1) + "s";
      }
    };

    const handleClick = () => {
      state.clickCount++;
      state.lastClickTime = Date.now();

      // Tıklama efekti
      htmlElement.classList.add("is-clicked");
      setTimeout(() => {
        htmlElement.classList.remove("is-clicked");
      }, 300);

      // Tıklama zamanı göster
      const now = new Date();
      const timeString =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0") +
        ":" +
        now.getSeconds().toString().padStart(2, "0");
      lastClickEl.textContent = timeString;

      updateDisplay();
    };

    htmlElement.addEventListener("mouseenter", handleMouseEnter);
    htmlElement.addEventListener("mouseleave", handleMouseLeave);
    htmlElement.addEventListener("click", handleClick);

    updateDisplay();

    return () => {
      if (hoverInterval) clearInterval(hoverInterval);
      htmlElement.removeEventListener("mouseenter", handleMouseEnter);
      htmlElement.removeEventListener("mouseleave", handleMouseLeave);
      htmlElement.removeEventListener("click", handleClick);
    };
  };
}
