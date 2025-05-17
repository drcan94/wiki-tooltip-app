<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { createTooltip } from './WikiItem';
	
	// Props tanımlamaları
	let { title, content, ...props }: {
		title: string;
		content: string;
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<article class="wiki-item" {...props}>
	<h3 class="title" {@attach createTooltip(`${title} hakkında bilgi içerir`)}>
		{title}
	</h3>
	<p class="content">{content}</p>
</article>

<style>
	@import './WikiItem.css';
</style> 