<script lang="ts">
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/light.css';
	import tippy from 'tippy.js';
	import type { Attachment } from 'svelte/attachments';
	import WikiItem from '$lib/WikiItem';
	import WikiArticle from '$lib/WikiArticle';
	import IntersectionDemo from '$lib/IntersectionDemo';
	import EventDemo from '$lib/EventDemo';
	import FormDemo from '$lib/FormDemo';
	import AccessibilityDemo from '$lib/AccessibilityDemo';
	import TooltipExamples from '$lib/TooltipExamples';
	import '../routes/styles.css';
	
	// Tooltip oluşturmak için attachment factory
	function tooltip(content: string): Attachment {
		return (element) => {
			let tip: any = null;

			try {
				// Fallback for older browsers
				if (typeof tippy !== 'function') {
					if (element instanceof HTMLElement) {
						element.title = content;
						return () => {
							if (element instanceof HTMLElement) {
								element.title = '';
							}
						};
					}
					return () => {};
				}

				tip = tippy(element, {
					content,
					theme: 'light',
					arrow: true,
					animation: 'fade'
				});
				
				// Temizleme fonksiyonu (eleman DOM'dan kaldırıldığında çağrılır)
				return () => {
					try {
						if (tip && typeof tip.destroy === 'function') {
							tip.destroy();
						}
					} catch (error) {
						console.error('Tippy temizlenirken hata:', error);
						if (element instanceof HTMLElement) {
							element.title = '';
						}
					}
				};
			} catch (error) {
				console.error('Tooltip oluşturulurken hata:', error);
				// Fallback to title
				if (element instanceof HTMLElement) {
					element.title = content;
					return () => {
						if (element instanceof HTMLElement) {
							element.title = '';
						}
					};
				}
				return () => {};
			}
		};
	}
	
	// Wiki içeriği
	const wikiItems = [
		{
			title: 'Svelte',
			content: 'Svelte, web uygulamaları oluşturmak için kullanılan modern bir JavaScript framework\'üdür. Compile-time yaklaşımıyla diğer framework\'lerden ayrılır.',
			description: 'Modern bir JavaScript framework\'ü'
		},
		{
			title: 'Attachment',
			content: 'Svelte 5\'te tanıtılan attachment\'lar, bir eleman DOM\'a eklendiğinde çalıştırılan ve eleman DOM\'dan kaldırıldığında temizleme işlevi döndüren fonksiyonlardır.',
			description: 'Svelte 5\'te DOM elemanları için lifecycle fonksiyonları'
		},
		{
			title: 'Tippy.js',
			content: 'Tippy.js, web sayfalarında tooltip ve popup\'lar oluşturmak için kullanılan hafif bir JavaScript kütüphanesidir.',
			description: 'Popüler bir tooltip kütüphanesi'
		}
	];
	
	// Wiki makaleleri
	const articles = [
		{
			title: 'Svelte 5 Attachment Özelliği',
			content: `Svelte 5 ile gelen attachment özelliği, DOM elementlerine doğrudan bağlanma ve element DOM'a eklendiğinde veya çıkarıldığında kod çalıştırma yeteneği sağlar. 
			Bu özellik Svelte'in reaktivite sistemini DOM yaşam döngüsüyle birleştirir ve üçüncü parti kütüphaneleri entegre etmeyi kolaylaştırır.
			Attachment API'yi kullanarak tooltip veya popover gibi UI özellikleri kolayca eklenebilir.`,
			terms: [
				{ word: 'attachment', description: 'DOM elementleri için lifecycle fonksiyonları' },
				{ word: 'reaktivite', description: 'Verilerin değiştiğinde UI\'nin otomatik güncellenmesi' },
				{ word: 'DOM', description: 'Document Object Model - HTML belgelerinin yapısı' }
			]
		},
		{
			title: 'Attachment Kullanım Senaryoları',
			content: `Attachmentlar birçok senaryoda kullanılabilir. Örneğin, canvas manipülasyonu, ThreeJS entegrasyonu veya D3.js grafikleri gibi DOM manipülasyonu gerektiren işlemlerde. 
			Ayrıca form validasyonu, tooltip ve popover gibi UI bileşenlerinde de attachment kullanılabilir. Temizleme fonksiyonu döndürerek bellek sızıntılarını önler.`,
			terms: [
				{ word: 'canvas', description: '2D grafik çizimi için HTML elementi' },
				{ word: 'bellek sızıntıları', description: 'Uygulamanın kullanılmayan kaynakları serbest bırakmaması' },
				{ word: 'ThreeJS', description: '3D grafik kütüphanesi' },
				{ word: 'D3.js', description: 'Veri görselleştirme kütüphanesi' }
			]
		}
	];
	
	// Kod örnekleri
	const codeExamples = [
		{
			title: 'Temel Attachment Kullanımı',
			code: `<script lang="ts">
  import type { Attachment } from 'svelte/attachments';

  const myAttachment: Attachment = (element) => {
    console.log(element.nodeName); // Örn: 'DIV'
    
    // İsteğe bağlı temizleme fonksiyonu döndürür
    return () => {
      console.log('Element DOM\\'dan kaldırıldı');
    };
  };
<\/script>

<div {@attach myAttachment}>İçerik</div>`,
			explanation: 'En temel attachment kullanımı. DOM elemanına bir attachment fonksiyonu bağlar ve eleman DOM\'dan kaldırıldığında temizleme fonksiyonu çalışır.'
		},
		{
			title: 'Attachment Factory ile Parametreli Kullanım',
			code: `<script lang="ts">
  import tippy from 'tippy.js';
  import type { Attachment } from 'svelte/attachments';

  function tooltip(content: string): Attachment {
    return (element) => {
      const tip = tippy(element, { content });
      return () => tip.destroy();
    };
  }
<\/script>

<button {@attach tooltip(content)}>Üzerime gel</button>`,
			explanation: 'Attachment oluşturan bir factory fonksiyonu. Her içerik için yeni bir attachment oluşturur ve içeriğe göre dinamik davranır.'
		},
		{
			title: 'Inline Attachment Kullanımı',
			code: `<canvas
  width={300}
  height={150}
  {@attach (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'crimson';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Bu efekt, renk değiştiğinde çalışır
    /* $effect olarak kullanılır */
    /* Burada gerçek kodda $effect kullanılacaktır */
    /* Örnek: $effect(() => { ... }) */
    // Örnek kodu:
    const currentColor = 'blue'; 
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }}
><\/canvas>`,
			explanation: 'Doğrudan element üzerinde tanımlanan inline attachment. Karmaşık setup gerektiren durumlarda veya tek seferlik kullanımlarda tercih edilir.'
		},
		{
			title: 'Attachment\'ları Bileşenlere Aktarma',
			code: `<script>
  import Button from './Button.svelte';
  import type { Attachment } from 'svelte/attachments';
  
  function tooltip(content: string): Attachment {
    return (element) => {
      // tooltip kodları...
    };
  }
<\/script>

<Button {@attach tooltip("Bilgi")}>Buton</Button>

<!-- Button.svelte -->
<script>
  let props = $props();
<\/script>

<button {...props}>
  <slot />
</button>`,
			explanation: 'Attachment\'lar bileşenlere aktarılabilir. Bileşen içinde props nesnesi DOM elemanına yayılarak, attachment\'ın o elemana uygulanması sağlanır.'
		},
		{
			title: 'Programatik Attachment Kullanımı',
			code: `<script>
  import { createAttachmentKey } from 'svelte/attachments';
  
  const tooltipKey = createAttachmentKey();
  
  function setupAttachment() {
    const element = document.querySelector('.target');
    
    const tooltipAttachment = (element) => {
      // tooltip kodları...
    };
    
    tooltipAttachment(element);
  }
<\/script>`,
			explanation: 'JavaScript kodu içinde programatik olarak attachment uygulamak için kullanılır. Dinamik element oluşturma durumlarında veya React gibi diğer kütüphanelerle çalışırken faydalıdır.'
		}
	];
</script>

<svelte:head>
	<title>Svelte 5 Attachment Belgelendirmesi</title>
	<meta name="description" content="Svelte 5 attachment özelliğinin kullanımı ve örnekleri" />
</svelte:head>

<main>
	<header>
		<h1>Svelte 5 Attachment Belgelendirmesi</h1>
		<p class="subtitle">DOM elemanlarını güçlendirmek için kullanılan yeni APIler</p>
	</header>
	
	<nav class="toc">
		<h2>İçindekiler</h2>
		<ul>
			<li><a href="#intro">Giriş</a></li>
			<li><a href="#basic">Temel Kullanım</a></li>
			<li><a href="#factory">Factory Pattern</a></li>
			<li><a href="#inline">Inline Attachments</a></li>
			<li><a href="#component">Bileşenlere Aktarma</a></li>
			<li><a href="#programmatic">Programatik Kullanım</a></li>
			<li><a href="#examples">Canlı Örnekler</a></li>
			<li><a href="#tooltip-examples">Tooltip Kullanım Örnekleri (@attach vs use:)</a></li>
		</ul>
	</nav>
	
	<section id="intro" class="section">
		<h2>Giriş</h2>
		<div class="content">
			<p>
				<span class="term" {@attach tooltip('Svelte 5\'te yeni eklenen fonksiyonel bir özellik')}>Attachment</span> 
				özelliği, DOM elemanlarına doğrudan bağlanma ve eleman DOM'a eklendiğinde veya kaldırıldığında
				kod çalıştırma yeteneği sağlar.
			</p>
			
			<div class="info-box">
				<h3>Attachment Nedir?</h3>
				<p>Attachmentlar, bir DOM elemanı sayfaya eklendiğinde (mount) çalıştırılan fonksiyonlardır. Bu fonksiyonlar isteğe bağlı olarak, eleman DOM'dan kaldırıldığında (unmount) çalışacak bir temizleme fonksiyonu döndürebilir.</p>
				<p>Temel amacı, DOM elemanlarına davranış eklemek ve temiz bir şekilde kaynakları serbest bırakmaktır.</p>
			</div>
			
			<div class="grid-items">
				{#each wikiItems as item}
					<WikiItem title={item.title} content={item.content} {@attach tooltip(item.description)} />
				{/each}
			</div>
		</div>
	</section>
	
	<section id="basic" class="section">
		<h2>Temel Kullanım</h2>
		<div class="content">
			<p>Basit bir attachment oluşturmak için <code>{@attach ...}</code> direktifini kullanırız:</p>
			
			<div class="code-block">
				<pre><code>{codeExamples[0].code}</code></pre>
				<p class="code-explanation">{codeExamples[0].explanation}</p>
			</div>
			
			<div class="example-box">
				<h3>Canlı Örnek</h3>
				<div class="demo-box" {@attach tooltip('Bu element bir attachment kullanıyor!')}>
					Üzerime gel (Tooltip görmek için)
				</div>
			</div>
		</div>
	</section>
	
	<section id="factory" class="section">
		<h2>Factory Pattern</h2>
		<div class="content">
			<p>Parametreli attachmentlar oluşturmak için factory fonksiyonu kullanabilirsiniz:</p>
			
			<div class="code-block">
				<pre><code>{codeExamples[1].code}</code></pre>
				<p class="code-explanation">{codeExamples[1].explanation}</p>
			</div>
			
			<div class="example-box">
				<h3>Canlı Örnek</h3>
				<button class="demo-button" {@attach tooltip('Bu düğmeye tıklayarak bir işlem başlatabilirsiniz')}>
					Bilgi için üzerime gel
				</button>
			</div>
		</div>
	</section>
	
	<section id="inline" class="section">
		<h2>Inline Attachments</h2>
		<div class="content">
			<p>Doğrudan element üzerinde attachment tanımlayabilirsiniz:</p>
			
			<div class="code-block">
				<pre><code>{codeExamples[2].code}</code></pre>
				<p class="code-explanation">{codeExamples[2].explanation}</p>
			</div>
			
			<div class="example-box">
				<h3>Canlı Örnek</h3>
				<p>Aşağıdaki canvas elementine tıklayın:</p>
				<canvas
					width={300}
					height={150}
					{@attach (canvas) => {
						const ctx = canvas.getContext('2d');
						if (ctx) {
							// İlk çizim
							ctx.fillStyle = '#ff3e00';
							ctx.fillRect(0, 0, canvas.width, canvas.height);
							
							// Metin ekleme
							ctx.fillStyle = 'white';
							ctx.font = '20px Arial';
							ctx.textAlign = 'center';
							ctx.fillText('Canvas Örneği (Tıkla)', canvas.width / 2, canvas.height / 2);
							
							// Click sayacı
							let clickCount = 0;
							const handleClick = () => {
								clickCount++;
								
								// Canvas temizle ve yeniden çiz
								ctx.fillStyle = '#ff3e00';
								ctx.fillRect(0, 0, canvas.width, canvas.height);
								
								ctx.fillStyle = 'white';
								ctx.font = '20px Arial';
								ctx.textAlign = 'center';
								ctx.fillText(`Tıklama sayısı: ${clickCount}`, canvas.width / 2, canvas.height / 2);
								
								// Tooltip ekle
								tippy(canvas, {
									content: `${clickCount} kez tıkladınız!`,
									trigger: 'manual',
									theme: 'light'
								}).show();
							};
							
							canvas.addEventListener('click', handleClick);
							
							// Temizleme fonksiyonu
							return () => {
								canvas.removeEventListener('click', handleClick);
							};
						}
					}}
				></canvas>
			</div>
		</div>
	</section>
	
	<section id="component" class="section">
		<h2>Bileşenlere Aktarma</h2>
		<div class="content">
			<p>Attachmentlar bileşenlere aktarılabilir ve props aracılığıyla DOM elemanlarına uygulanabilir:</p>
			
			<div class="code-block">
				<pre><code>{codeExamples[3].code}</code></pre>
				<p class="code-explanation">{codeExamples[3].explanation}</p>
			</div>
			
			<div class="example-box">
				<h3>Canlı Örnek</h3>
				<WikiItem 
					title="Bileşene Aktarılan Attachment" 
					content="Bu bileşen, kendisine aktarılan tooltip attachment'ını içeriyor."
					{@attach tooltip("WikiItem bileşenine geçirilen tooltip")} 
				/>
			</div>
		</div>
	</section>
	
	<section id="programmatic" class="section">
		<h2>Programatik Kullanım</h2>
		<div class="content">
			<p>JavaScript kodu içinde attachment'ları programatik olarak oluşturabilir ve uygulayabilirsiniz:</p>
			
			<div class="code-block">
				<pre><code>{codeExamples[4].code}</code></pre>
				<p class="code-explanation">{codeExamples[4].explanation}</p>
			</div>
			
			<div class="example-box">
				<h3>Canlı Örnek</h3>
				<p>Programatik attachment örnekleri için aşağıdaki makalelere bakınız:</p>
				<div class="wiki-articles">
					{#each articles as article}
						<WikiArticle 
							title={article.title} 
							content={article.content} 
							terms={article.terms} 
						/>
					{/each}
				</div>
			</div>
		</div>
	</section>
	
	<section id="examples" class="section">
		<h2>Kullanım Senaryoları</h2>
		<div class="content">
			<div class="scenario-grid">
				<FormDemo />
				<IntersectionDemo />
				<EventDemo />
				<AccessibilityDemo />
			</div>
		</div>
	</section>
	
	<section id="tooltip-examples" class="section">
		<h2>Tooltip Kullanım Örnekleri</h2>
		<TooltipExamples />
	</section>
	
	<footer>
		<p>Svelte 5 Attachment Belgelendirmesi - 2024</p>
		<p>Bu belgelendirme sayfası, Svelte 5'in attachment özelliğini anlatmak için oluşturulmuştur.</p>
	</footer>
</main>
