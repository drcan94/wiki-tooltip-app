import type { Attachment } from "svelte/attachments";

// Görünürlük izleme fonksiyonu - Factory pattern
export function createVisibilityObserver(options = {}): Attachment {
  return (element) => {
    // Get viewport size to adjust settings for mobile
    const isMobile = window.innerWidth < 768;

    // Default options with adjustments for mobile
    const observerOptions = {
      root: null,
      // Use a smaller rootMargin on mobile devices
      rootMargin: isMobile ? "0px" : "-50px",
      // Add more threshold steps for better precision
      threshold: [
        0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6,
        0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0,
      ],
      ...options,
    };

    let isVisible = false;
    let visibilityRatio = 0;

    // DOM elemanları oluştur
    const titleEl = document.createElement("h4");
    titleEl.textContent = "Görünürlük İzleme";
    titleEl.className = "visibility-title";

    const statusEl = document.createElement("div");
    statusEl.className = "status-indicator";

    const iconEl = document.createElement("div");
    iconEl.className = "status-icon";
    iconEl.innerHTML = "👁️‍🗨️";

    const stateEl = document.createElement("div");
    stateEl.className = "state-text";
    stateEl.textContent = "Görünmüyor";

    // Görünürlük yüzdesi için SVG çember göstergesi için kontrol
    const progressWrapperEl = element.querySelector(".progress-wrapper");
    const ringProgressEl = element.querySelector(".ring-progress");
    const ringTextEl = element.querySelector(".ring-text");

    // Progress wrapper yoksa oluştur
    if (!progressWrapperEl) {
      // Ratio elementi oluştur
      const ratioEl = document.createElement("div");
      ratioEl.className = "ratio-meter";

      const ratioBarEl = document.createElement("div");
      ratioBarEl.className = "ratio-bar";

      const ratioTextEl = document.createElement("div");
      ratioTextEl.className = "ratio-text";
      ratioTextEl.textContent = "0%";

      ratioEl.appendChild(ratioBarEl);
      ratioEl.appendChild(ratioTextEl);

      statusEl.appendChild(iconEl);
      statusEl.appendChild(stateEl);

      const descEl = document.createElement("p");
      descEl.className = "card-desc";
      descEl.innerHTML = `
        Bu kart <code>IntersectionObserver API</code> ile izleniyor.<br>
        Görünürlük yüzdesi anlık olarak güncelleniyor.
      `;

      const badgeEl = document.createElement("div");
      badgeEl.className = "card-badge";
      badgeEl.innerHTML = "<span>0%</span>";

      // Animasyonlu parçacıklar için element
      const particlesEl = document.createElement("div");
      particlesEl.className = "card-particles";

      const contentEl = document.createElement("div");
      contentEl.className = "card-content";
      contentEl.appendChild(titleEl);
      contentEl.appendChild(statusEl);
      contentEl.appendChild(ratioEl);
      contentEl.appendChild(descEl);
      contentEl.appendChild(badgeEl);
      contentEl.appendChild(particlesEl);

      // İçeriği elemana ekle
      element.appendChild(contentEl);
    }

    // IntersectionObserver callback - anlık güncelleme için
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // Görünürlük oranını her zaman güncelle
        visibilityRatio = entry.intersectionRatio;

        // Round to 2 decimal places, then to integer for display
        // This helps with small differences in visibility ratio
        const roundedRatio = Math.round(visibilityRatio * 100) / 100;

        // If almost visible (> 0.95), round up to 100% for better UX
        const percent =
          roundedRatio > 0.95 ? 100 : Math.round(roundedRatio * 100);

        // SVG çember progresini güncelle (eğer varsa)
        const ringProgress = element.querySelector(".ring-progress");
        const ringText = element.querySelector(".ring-text");
        if (ringProgress instanceof SVGElement && ringText) {
          const radius = 54;
          const circumference = 2 * Math.PI * radius;
          // Use 100% for the ring when almost visible
          const offset = circumference - (percent / 100) * circumference;
          ringProgress.style.strokeDashoffset = String(offset);
          ringText.textContent = `${percent}%`;
        } else {
          // Ratio çubuğunu ve metni güncelle (geleneksel)
          const ratioBar = element.querySelector(".ratio-bar");
          const ratioText = element.querySelector(".ratio-text");

          if (ratioBar instanceof HTMLElement) {
            ratioBar.style.width = `${percent}%`;
          }

          if (ratioText) {
            ratioText.textContent = `${percent}%`;
          }
        }

        // Badge metnini güncelle
        const badge = element.querySelector(".card-badge");
        const span = badge?.querySelector("span");
        if (span) {
          span.textContent = `${percent}%`;
        }

        // Görünürlük durumu değişirse
        if (entry.isIntersecting !== isVisible) {
          isVisible = entry.isIntersecting;

          if (isVisible) {
            element.classList.add("is-visible");

            const badge = element.querySelector(".card-badge");
            const icon = element.querySelector(".status-icon");
            const stateText = element.querySelector(".state-text");

            if (badge) badge.classList.add("visible");
            if (stateText) stateText.textContent = "Görünüyor";
            if (icon) icon.innerHTML = "👁️";

            // Ripple efekti animasyonu
            triggerRippleAnimation(element);
          } else {
            element.classList.remove("is-visible");

            const badge = element.querySelector(".card-badge");
            const icon = element.querySelector(".status-icon");
            const stateText = element.querySelector(".state-text");

            if (badge) badge.classList.remove("visible");
            if (stateText) stateText.textContent = "Görünmüyor";
            if (icon) icon.innerHTML = "👁️‍🗨️";
          }
        }
      });
    };

    // Animasyonlu parçacık efekti
    function triggerRippleAnimation(element: Element) {
      // Özel ripple efekti oluştur
      const ripple = document.createElement("div");
      ripple.className = "visibility-ripple";
      element.appendChild(ripple);

      // Animasyonun tamamlanmasını bekle ve temizle
      setTimeout(() => {
        ripple.remove();
      }, 1000);
    }

    // Observer'ı oluştur
    const observer = new IntersectionObserver(callback, observerOptions);
    observer.observe(element);

    // Başlangıç durumu
    element.classList.remove("is-visible");
    const badge = element.querySelector(".card-badge");
    if (badge) badge.classList.remove("visible");

    // Temizleme fonksiyonu döndür
    return () => {
      observer.disconnect();
    };
  };
}
