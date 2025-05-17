<script lang="ts">
  import { tooltip, highlight, setupManualTooltip } from './TooltipExamples';
  import { createTooltip, createAttachmentProps } from '../attachment-utils';
  import type { Action } from 'svelte/action';
  import tippy from "tippy.js";
  
  // Initialize manual tooltip setup
  setupManualTooltip();
  
  // Svelte 5.29+ $effect ile action örneği (doğrudan .svelte dosyasında tanımlanarak kullanılabilir)
  const effectTooltip: Action<HTMLElement, string> = (node, content) => {
    let tip: any = null;
    
    $effect(() => {
      // Tooltip oluşturma
      try {
        if (typeof tippy !== "function") {
          node.title = content || "";
        } else {
          tip = tippy(node, {
            content: content || "Svelte 5 $effect ile tooltip",
            theme: "light",
            arrow: true,
            delay: [100, 0],
            placement: "top",
          });
        }
      } catch (error) {
        console.error("Tooltip oluşturulurken hata:", error);
        node.title = content || "";
      }
      
      // Temizleme fonksiyonu
      return () => {
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
      };
    });
  };
</script>

<div class="examples-container">
  <h2>Tooltip Kullanım Örnekleri</h2>
  
  <div class="tabs">
    <button class="tab-btn" {@attach createTooltip('Svelte 5+ için önerilen yöntem')}>@attach</button>
    <button class="tab-btn" {@attach createTooltip('Svelte 4 ve öncesi için kullanılan yöntem')}>use:</button>
  </div>
  
  <div class="examples-grid">
    <div class="example-column">
      <h3>@attach Direktifi</h3>
      
      <section>
        <h4>Örnek 1: @attach ile kullanım</h4>
        <div class="example-item">
          <button {@attach createTooltip('Bu bir tooltip örneğidir!')}>
            Butonun üzerine gel
          </button>
        </div>
      </section>
      
      <section>
        <h4>Örnek 2: Manuel uygulama</h4>
        <div class="example-item">
          <div id="tooltip-target" class="tooltip-example">
            Elle uygulanan tooltip
          </div>
        </div>
      </section>
      
      <section>
        <h4>Örnek 3: Attachment Props</h4>
        <div class="example-item">
          <p {...createAttachmentProps('Tooltip ve highlight birlikte!', '#ffe0b2')}>
            Tooltip ve highlight birlikte
          </p>
        </div>
      </section>
    </div>
    
    <div class="example-column">
      <h3>use: Direktifi</h3>
      
      <section>
        <h4>Örnek 1: use:tooltip kullanımı</h4>
        <div class="example-item">
          <button use:tooltip={'use: direktifi ile tooltip örneği'}>
            Butonun üzerine gel
          </button>
        </div>
      </section>
      
      <section>
        <h4>Örnek 2: Çoklu davranış</h4>
        <div class="example-item">
          <div class="action-example" use:tooltip={'Hem tooltip hem highlight'} use:highlight={'#e6f7ff'}>
            Tooltip ve highlight birlikte
          </div>
        </div>
      </section>
      
      <section>
        <h4>Örnek 3: Tiplemeli kullanım</h4>
        <div class="example-item">
          <p class="code-hint" use:tooltip={'Action fonksiyonları tiplenebilir'}>
            Action tiplemesi
          </p>
        </div>
      </section>
      
      <section>
        <h4>Örnek 4: $effect kullanımı</h4>
        <div class="example-item">
          <button use:effectTooltip={'$effect ile tanımlanmış örnek'}>
            $effect ile tooltip
          </button>
          <p class="code-note">
            Not: Sadece .svelte dosyalarında kullanılabilir
          </p>
        </div>
      </section>
    </div>
  </div>
  
  <div class="info-box">
    <h3>use: ve @attach Karşılaştırması</h3>
    <ul>
      <li><strong>use:</strong> Action tabanlı yaklaşım (<code>Action</code> türü ile)</li>
      <li><strong>@attach:</strong> Svelte 5 ile gelen attachment yaklaşımı</li>
      <li>Her iki yöntem de DOM davranışlarını yönetir</li>
    </ul>
    
    <h3>Svelte 5.29+ Actions</h3>
    <ul>
      <li>Actions update/destroy API'si kullanabilir</li>
      <li>Veya $effect ile tanımlanabilir (.svelte dosyalarında)</li>
      <li>$effect daha net ve reaktif bir syntax sunar</li>
    </ul>
  </div>
</div>

<style>
  @import './TooltipExamples.css';
  
  .code-note {
    font-size: 0.85rem;
    color: #666;
    font-style: italic;
    margin-top: 8px;
  }
</style> 