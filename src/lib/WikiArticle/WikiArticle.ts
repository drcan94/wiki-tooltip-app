import { createTooltip, createHighlight } from "../attachment-utils";

// Terim işleme fonksiyonu
export function processTerms(
  content: string,
  terms: Array<{ word: string; description: string }>
) {
  if (terms.length === 0) return content;

  let processedContent = content;

  // Her term için ayrı bir eleman oluştur
  terms.forEach((term) => {
    // Term'i regex ile bul (tam kelime eşleşmesi)
    const regex = new RegExp(`\\b${term.word}\\b`, "g");

    // Term'i wrapped span ile değiştir
    processedContent = processedContent.replace(
      regex,
      `<span class="term-highlight" data-term="${term.word}" data-description="${term.description}">${term.word}</span>`
    );
  });

  return processedContent;
}

// Term spanlarına attachment uygulamak için fonksiyon
export function setupTermAttachments(node: HTMLElement): () => void {
  // Term elementlerini bul
  const termElements = node.querySelectorAll(".term-highlight");
  const cleanupFunctions: (() => void)[] = [];

  // Her term için attachment oluştur ve uygula
  termElements.forEach((el) => {
    try {
      const termEl = el as HTMLElement;
      const description = termEl.dataset.description || "";

      // Tooltip ve highlight attachmentlarını oluştur
      const tooltipAttachment = createTooltip(description);
      const highlightAttachment = createHighlight("#fff9c4");

      // Attachmentları uygula ve temizleme fonksiyonlarını al
      const tooltipCleanup = tooltipAttachment(termEl);
      const highlightCleanup = highlightAttachment(termEl);

      // Temizleme fonksiyonlarını kaydet (null kontrolü ile)
      if (tooltipCleanup) cleanupFunctions.push(tooltipCleanup);
      if (highlightCleanup) cleanupFunctions.push(highlightCleanup);
    } catch (error) {
      console.error("Attachment uygulanırken hata:", error);
    }
  });

  // Attachment'ları temizlemek için fonksiyon
  return () => {
    cleanupFunctions.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error("Temizleme fonksiyonu çalıştırılırken hata:", error);
      }
    });
  };
}
