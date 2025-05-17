<script lang="ts">
  import { createVisibilityObserver } from './IntersectionDemo';
</script>

<div class="intersection-container">
  <h3 class="intersection-title">Intersection Observer</h3>
  <p class="intersection-desc">Aşağıdaki elementlerin görünürlük değişimlerini izleyin. Sayfayı kaydırdıkça görünür olup olmadıklarını görsel olarak görebilirsiniz.</p>
  
  <div class="spacer"></div>

  <div 
    class="intersection-item"
    {@attach (element) => {
      // Check if on mobile
      const isMobile = window.innerWidth < 768;
      
      // Intersection Observer'ı oluştur with mobile adjustments
      const options = {
        root: null,
        rootMargin: isMobile ? "0px" : "-50px",
        // Use more thresholds for smoother detection on mobile
        threshold: isMobile ? [0, 0.25, 0.5, 0.75, 0.9, 0.95, 1.0] : 0.3
      };
      
      let isCurrentlyVisible = false;
      let visibilityRatio = 0;
      
      const callback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          // Record the visibility ratio for use below
          visibilityRatio = entry.intersectionRatio;
          
          // Check for visibility change
          const shouldBeVisible = isMobile 
            ? entry.isIntersecting && visibilityRatio > 0.9 // On mobile, show visible at 90%+
            : entry.isIntersecting;
            
          if (shouldBeVisible !== isCurrentlyVisible) {
            isCurrentlyVisible = shouldBeVisible;
            
            if (isCurrentlyVisible) {
              element.classList.add('is-visible');
              const icon = element.querySelector('.status-icon');
              const text = element.querySelector('.status-text');
              const particles = element.querySelector('.particles');
              
              if (icon) icon.textContent = '👁️';
              if (text) text.textContent = "Görünür durumdayım!";
              if (particles && particles instanceof HTMLElement) particles.style.display = 'block';
            } else {
              element.classList.remove('is-visible');
              const icon = element.querySelector('.status-icon');
              const text = element.querySelector('.status-text');
              const particles = element.querySelector('.particles');
              
              if (icon) icon.textContent = '👁️‍🗨️';
              if (text) text.textContent = "Görünmüyorum!";
              if (particles && particles instanceof HTMLElement) particles.style.display = 'none';
            }
          }
        });
      };
      
      const observer = new IntersectionObserver(callback, options);
      observer.observe(element);
      
      // Başlangıç durumu
      element.classList.remove('is-visible');
      
      // Handle resize events to adapt to orientation changes
      const handleResize = () => {
        const newIsMobile = window.innerWidth < 768;
        if (newIsMobile !== isMobile) {
          // Disconnect and recreate with new settings if viewport size category changes
          observer.disconnect();
          const newOptions = {
            root: null,
            rootMargin: newIsMobile ? "0px" : "-50px",
            threshold: newIsMobile ? [0, 0.25, 0.5, 0.75, 0.9, 0.95, 1.0] : 0.3
          };
          const newObserver = new IntersectionObserver(callback, newOptions);
          newObserver.observe(element);
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    }}
  >
    <div class="particles"></div>
    <div class="status-icon">👁️‍🗨️</div>
    <div class="status-text">Görünmüyorum!</div>
    <div class="visibility-indicator">
      <span class="circle"></span>
      <span class="circle"></span>
      <span class="circle"></span>
    </div>
  </div>
  
  <div class="scroll-area">
    <div class="scroll-guide">
      <p class="guide-text">👇 Aşağı kaydırmaya devam edin 👇</p>
      
      <div class="guide-spacer"></div>
      
      <!-- Geliştirilmiş ikinci örnek -->
      <div 
        class="intersection-item-secondary"
        {@attach createVisibilityObserver()}
      >
        <div class="progress-wrapper">
          <svg class="visibility-ring" width="120" height="120" viewBox="0 0 120 120">
            <circle class="ring-bg" cx="60" cy="60" r="54" stroke="#ffffff" stroke-opacity="0.2" stroke-width="6" fill="none" />
            <circle class="ring-progress" cx="60" cy="60" r="54" stroke="#ffffff" stroke-dasharray="339.292" stroke-dashoffset="339.292" stroke-width="6" fill="none" />
          </svg>
          <div class="ring-text">0%</div>
        </div>
      </div>
      
      <p class="guide-text">👆 Yukarı kaydırın ve elemanların durumunu izleyin 👆</p>
      
      <div class="guide-spacer-small"></div>
    </div>
  </div>
</div>

<style>
  @import './IntersectionDemo.css';
  
  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    display: none;
  }
  
  .visibility-indicator {
    display: flex;
    gap: 8px;
    margin-top: 15px;
  }
  
  .circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    transition: all 0.5s ease;
  }
  
  .is-visible .circle:nth-child(1) {
    background-color: rgba(255, 255, 255, 0.9);
    animation: pulseCircle 1.5s ease-in-out infinite;
    animation-delay: 0s;
  }
  
  .is-visible .circle:nth-child(2) {
    background-color: rgba(255, 255, 255, 0.9);
    animation: pulseCircle 1.5s ease-in-out infinite;
    animation-delay: 0.3s;
  }
  
  .is-visible .circle:nth-child(3) {
    background-color: rgba(255, 255, 255, 0.9);
    animation: pulseCircle 1.5s ease-in-out infinite;
    animation-delay: 0.6s;
  }
  
  @keyframes pulseCircle {
    0% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.5);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.9;
    }
  }
  
  .progress-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
  
  .visibility-ring {
    transform: rotate(-90deg);
    transition: all 0.3s ease;
  }
  
  .ring-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
  }
</style> 