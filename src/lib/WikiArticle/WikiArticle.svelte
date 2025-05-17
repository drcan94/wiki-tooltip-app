<script lang="ts">
	import { processTerms, setupTermAttachments } from './WikiArticle';
	import type { HTMLAttributes } from 'svelte/elements';
	
	// Props tanımlamaları
	let { title, content, terms = [], ...props }: {
		title: string;
		content: string;
		terms?: Array<{
			word: string;
			description: string;
		}>;
	} & HTMLAttributes<HTMLElement> = $props();
	
	// İşlenmiş içerik
	const processedContent = $derived(processTerms(content, terms));
</script>

<article class="wiki-article" {...props}>
	<h2>{title}</h2>
	<div class="content">
		{#key processedContent}
			<div 
				{@attach (node) => {
					// İçeriğin yeniden render edildiğinde yeniden çalışır
					try {
						return setupTermAttachments(node);
					} catch (error) {
						console.error('Attachment setup hatası:', error);
						return () => {};
					}
				}}
			>
				{@html processedContent}
			</div>
		{/key}
	</div>
</article>

<style>
	@import './WikiArticle.css';
</style> 