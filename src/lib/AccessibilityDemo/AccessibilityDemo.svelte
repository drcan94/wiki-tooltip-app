<script lang="ts">
  import { createKeyboardNav, createAriaAttachment, createAnnouncer } from './AccessibilityDemo';
  import './AccessibilityDemo.css';
  
  // Track announcement messages for demo
  let announcements: string[] = [];
  
  // Demo functions
  function announceMessage() {
    const message = `Item ${announcements.length + 1} selected at ${new Date().toLocaleTimeString()}`;
    const container = document.querySelector('.a11y-container');
    if (container && (container as any).announce) {
      (container as any).announce(message);
      announcements = [...announcements, message];
    }
  }
</script>

<div 
  class="a11y-container"
  {@attach createKeyboardNav()}
  {@attach createAnnouncer()}
>
  <h3 class="a11y-title">Erişilebilirlik Özellikleri</h3>
  <p class="a11y-desc">Attachment'lar ile ekran okuyucu ve klavye desteği ekleyin.</p>
  
  <div class="a11y-demo-wrapper">
    <div class="a11y-section">
      <h4>Klavye Navigasyonu</h4>
      <p>Aşağıdaki butonlar arasında <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> tuşları ile gezinebilirsiniz.</p>
      
      <div class="button-grid">
        <button 
          class="a11y-button"
          {@attach createAriaAttachment('button', 'Birinci buton')}
        >
          Buton 1
        </button>
        
        <button 
          class="a11y-button"
          {@attach createAriaAttachment('button', 'İkinci buton')}
        >
          Buton 2
        </button>
        
        <button 
          class="a11y-button"
          {@attach createAriaAttachment('button', 'Üçüncü buton')}
        >
          Buton 3
        </button>
        
        <button 
          class="a11y-button"
          {@attach createAriaAttachment('button', 'Dördüncü buton')}
        >
          Buton 4
        </button>
      </div>
      
      <p class="a11y-tip">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <span>İpucu: <kbd>Home</kbd> ilk butona, <kbd>End</kbd> son butona odaklanır.</span>
      </p>
    </div>
    
    <div class="a11y-section">
      <h4>Ekran Okuyucu Bildirimleri</h4>
      <p>Ekran okuyucular için bildirimler oluşturun:</p>
      
      <div class="notification-interface">
        <div class="notification-card">
          <div class="notification-controls">
            <button 
              class="a11y-announce-button"
              on:click={announceMessage}
              {@attach createAriaAttachment('button', 'Bildirim oluştur')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span>Bildirim Oluştur</span>
            </button>
            
            {#if announcements.length > 0}
              <button 
                class="clear-button"
                on:click={() => announcements = []}
                aria-label="Tüm bildirimleri temizle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                <span>Temizle</span>
              </button>
            {/if}
          </div>
          
          <div class="notification-history">
            <div class="history-header">
              <h5>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h6"></path><path d="M22 12h-6"></path><path d="M12 2v6"></path><path d="M12 22v-6"></path><path d="M4.93 4.93l4.24 4.24"></path><path d="M14.83 14.83l4.24 4.24"></path><path d="M14.83 9.17l4.24-4.24"></path><path d="M4.93 19.07l4.24-4.24"></path></svg>
                Bildirim Geçmişi
                {#if announcements.length > 0}
                  <span class="counter">{announcements.length}</span>
                {/if}
              </h5>
            </div>
            
            <div class="history-content">
              {#if announcements.length === 0}
                <div class="empty-history">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <p>Henüz bildirim yok</p>
                  <small>Bildirim oluşturmak için butona tıklayın</small>
                </div>
              {:else}
                <ul class="notification-list">
                  {#each announcements as announcement, i}
                    <li class="notification-item">
                      <div class="notification-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                      <div class="notification-content">
                        <p>{announcement}</p>
                        <small>Bildirim #{i+1}</small>
                      </div>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="a11y-info">
    <h4>Attachment'lar ile Erişilebilirlik Nasıl Sağlanır?</h4>
    <ul class="info-list">
      <li>
        <div class="info-icon">⌨️</div>
        <div class="info-text">
          <strong>Klavye Navigasyonu:</strong> DOM elemanları arasında özel gezinti ve odaklanma davranışları eklenir
        </div>
      </li>
      <li>
        <div class="info-icon">🔊</div>
        <div class="info-text">
          <strong>Ekran Okuyucu Desteği:</strong> Dinamik içerik değişikliklerini bildirir ve ARIA özellikleri ekler
        </div>
      </li>
      <li>
        <div class="info-icon">🔍</div>
        <div class="info-text">
          <strong>Görsel Geri Bildirim:</strong> Klavye odağı için görsel ipuçları sağlar
        </div>
      </li>
    </ul>
  </div>
</div>

<style>
  /* Mobile-first design with base styles for small screens */
  .a11y-container {
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    padding: 20px;
    margin-bottom: 30px;
  }

  .a11y-title {
    color: #ff3e00;
    margin-top: 0;
    font-size: 1.6rem;
    font-weight: 700;
  }

  .a11y-desc {
    color: #444;
    margin-bottom: 20px;
    font-size: 1rem;
  }
  
  .a11y-demo-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .a11y-section {
    background-color: #f9f9f9;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    min-width: 0; /* Prevent flex items from growing beyond container */
  }
  
  .a11y-section h4 {
    color: #555;
    margin-top: 0;
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 15px 0;
  }
  
  .a11y-button {
    padding: 14px 20px;
    background-color: #f1f1f1;
    border: 2px solid transparent;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: #555;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
  }
  
  .a11y-button:hover {
    background-color: #e9e9e9;
  }
  
  .a11y-button:focus {
    outline: none;
    border-color: #ff3e00;
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.2);
  }
  
  .a11y-highlight {
    background-color: #fff3e6 !important;
    border-color: #ff3e00 !important;
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.2) !important;
  }
  
  .a11y-tip {
    display: flex;
    align-items: center;
    background-color: #e6f7ff;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #0066cc;
    margin-top: 15px;
  }
  
  .a11y-tip svg {
    margin-right: 10px;
    color: #0066cc;
    flex-shrink: 0;
  }
  
  kbd {
    background-color: #f2f2f2;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    display: inline-block;
    font-family: monospace;
    font-size: 0.9em;
    line-height: 1;
    padding: 2px 6px;
    margin: 0 2px;
    white-space: nowrap;
  }
  
  /* Notification design - mobile first */
  .notification-interface {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .notification-card {
    background-color: #f5f5f5;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }
  
  .notification-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
    width: 100%;
  }
  
  .a11y-announce-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #ff3e00, #e63600);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(255, 62, 0, 0.2);
    box-sizing: border-box;
  }
  
  .a11y-announce-button svg {
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }
  
  .a11y-announce-button:hover {
    background: linear-gradient(135deg, #ff5722, #ff3e00);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 62, 0, 0.3);
  }
  
  .a11y-announce-button:hover svg {
    transform: scale(1.1);
  }
  
  .a11y-announce-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 62, 0, 0.3);
  }
  
  .a11y-announce-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.3), 0 4px 10px rgba(255, 62, 0, 0.2);
  }
  
  .clear-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 12px;
    width: 100%;
    background-color: #f0f0f0;
    color: #555;
    border: none;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-sizing: border-box;
    margin-top: 10px;
  }
  
  .clear-button:hover {
    background-color: #e0e0e0;
    color: #333;
  }
  
  .notification-history {
    margin-top: 15px;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }
  
  .history-header {
    padding: 12px 15px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #eee;
    width: 100%;
    box-sizing: border-box;
  }
  
  .history-header h5 {
    margin: 0;
    color: #444;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .counter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #ff3e00;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 0.8rem;
    margin-left: auto;
  }
  
  .history-content {
    padding: 15px;
    min-height: 150px;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
  }
  
  .empty-history {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    color: #999;
    text-align: center;
    width: 100%;
    min-height: 120px;
  }
  
  .empty-history svg {
    margin-bottom: 10px;
    color: #ccc;
  }
  
  .empty-history p {
    margin: 0 0 5px;
    font-style: italic;
  }
  
  .empty-history small {
    font-size: 0.8rem;
    opacity: 0.8;
  }
  
  .notification-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  
  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    margin-bottom: 8px;
    background-color: white;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #444;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border-left: 3px solid #ff3e00;
    transition: transform 0.2s ease;
    width: 100%;
    box-sizing: border-box;
  }
  
  .notification-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  
  .notification-item:last-child {
    margin-bottom: 0;
  }
  
  .notification-icon {
    color: #ff3e00;
    margin-top: 3px;
    flex-shrink: 0;
  }
  
  .notification-content {
    flex: 1;
    word-break: break-word;
    min-width: 0; /* Prevent overflow */
  }
  
  .notification-content p {
    margin: 0 0 5px;
    font-weight: 500;
  }
  
  .notification-content small {
    color: #888;
    font-size: 0.8rem;
  }
  
  .a11y-info {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  
  .a11y-info h4 {
    margin-top: 0;
    color: #666;
    font-size: 1.1rem;
  }
  
  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .info-list li {
    display: flex;
    margin-bottom: 15px;
    align-items: flex-start;
  }
  
  .info-icon {
    margin-right: 10px;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .info-text {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #666;
  }
  
  .info-text strong {
    color: #444;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  /* Tablet styles */
  @media (min-width: 480px) {
    .notification-controls {
      flex-direction: row;
      align-items: stretch;
    }
    
    .clear-button {
      flex: 0 0 auto;
      width: auto;
      margin-top: 0;
      padding: 12px 16px;
      margin-left: 10px;
    }
    
    .a11y-announce-button {
      flex: 1;
    }
  }
  
  /* Desktop styles */
  @media (min-width: 768px) {
    .a11y-container {
      padding: 30px;
      margin-bottom: 40px;
    }
    
    .a11y-demo-wrapper {
      flex-direction: column;
      gap: 30px;
    }
    
    .a11y-section {
      width: 100%;
      padding: 24px;
    }
    
    .a11y-title {
      font-size: 1.8rem;
    }
    
    .a11y-desc {
      font-size: 1.1rem;
      margin-bottom: 24px;
    }
    
    .a11y-section h4 {
      font-size: 1.3rem;
      margin-bottom: 12px;
    }
    
    .history-content {
      max-height: 250px;
      min-height: 180px;
    }
    
    .notification-controls {
      margin-bottom: 20px;
    }
  }
</style> 