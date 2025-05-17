<script lang="ts">
  import { createEventTracker } from './EventDemo';
</script>

<div class="event-container">
  <h3 class="event-title">Olay Dinleyicileri</h3>
  <p class="event-desc">Birden fazla olay yönetimi yapabilirsiniz.</p>
  
  <div 
    class="event-demo"
    {@attach createEventTracker()}
  >
    <div class="event-message">Üzerime gel ve tıkla</div>
    <div class="event-counter"><span>0</span><small>tıklama</small></div>
    <div class="event-stats">
      <div class="stat">
        <span class="stat-value hover-time">0s</span>
        <small>Hover Süresi</small>
      </div>
      <div class="stat">
        <span class="stat-value last-click">-</span>
        <small>Son Tıklama</small>
      </div>
    </div>
  </div>
</div>

<style>
  @import './EventDemo.css';
</style> 