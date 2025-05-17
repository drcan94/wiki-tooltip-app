<script lang="ts">
  let validStatus: 'neutral' | 'valid' | 'invalid' = 'neutral';
  let emailValue = '';
  let isFocused = false;
</script>

<div class="form-container">
  <h3 class="form-title">Form Validasyonu</h3>
  <p class="form-desc">Attachment'ları kullanarak input validasyonu ekleyin.</p>
  
  <div class="form-group">
    <label for="email-input" class="form-label {isFocused ? 'active' : ''}">
      Email Adresiniz
    </label>
    
    <div class="input-wrapper {validStatus} {isFocused ? 'focused' : ''}">
      <input 
        id="email-input"
        type="email" 
        class="form-input"
        placeholder="örnek@domain.com"
        bind:value={emailValue}
        {@attach (input) => {
          const validateEmail = () => {
            const value = input.value;
            if (!value) {
              validStatus = 'neutral';
              return;
            }
            
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            validStatus = isValid ? 'valid' : 'invalid';
          };
          
          const handleFocus = () => {
            isFocused = true;
          };
          
          const handleBlur = () => {
            isFocused = false;
          };
          
          input.addEventListener('input', validateEmail);
          input.addEventListener('focus', handleFocus);
          input.addEventListener('blur', handleBlur);
          
          return () => {
            input.removeEventListener('input', validateEmail);
            input.removeEventListener('focus', handleFocus);
            input.removeEventListener('blur', handleBlur);
          };
        }}
      />
      
      <div class="input-icon">
        {#if validStatus === 'valid'}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-valid"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        {:else if validStatus === 'invalid'}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-invalid"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        {/if}
      </div>
    </div>
    
    <div class="form-feedback">
      {#if validStatus === 'invalid'}
        <p class="feedback-text error">Lütfen geçerli bir email adresi girin</p>
      {:else if validStatus === 'valid'}
        <p class="feedback-text success">Email formatı geçerli</p>
      {:else}
        <p class="feedback-text">Geçerli bir email adresi girin (örn: ad@domain.com)</p>
      {/if}
    </div>
    
    <button class="form-button {validStatus === 'valid' ? 'active' : ''}" disabled={validStatus !== 'valid'}>
      Gönder
    </button>
  </div>
  
  <div class="form-info">
    <h4>Nasıl Çalışır?</h4>
    <ul class="info-list">
      <li>
        <div class="info-icon">📋</div>
        <div class="info-text">
          <strong>Attachment Direktifi:</strong> <code>&#123;@attach (element) => &#123;...&#125;&#125;</code> DOM elemanına bağlanır
        </div>
      </li>
      <li>
        <div class="info-icon">📢</div>
        <div class="info-text">
          <strong>Olay Dinleyicileri:</strong> Giriş, odaklanma ve odak kaybı olaylarını takip eder
        </div>
      </li>
      <li>
        <div class="info-icon">🧹</div>
        <div class="info-text">
          <strong>Temizlik:</strong> Eleman kaldırıldığında olay dinleyicilerini temizler
        </div>
      </li>
    </ul>
  </div>
</div>

<style>
  @import './FormDemo.css';
</style> 