// main.js

function extractAlignments(editor) {
  const alignedElements = editor.root.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
  const alignments = [];

  for (const element of alignedElements) {
    const style = element.getAttribute('style');
    if (style && style.includes('text-align')) {
      const textAlign = style.split(';').find(s => s.includes('text-align')).split(':')[1].trim();
      alignments.push(textAlign);
    } else {
      alignments.push('default');
    }
  }

  return alignments.join(',');
}

function handleGenerateUrlButtonClick(editor, themeSelector, urlElement) {
  const delta = editor.getContents();
  const alignments = extractAlignments(editor);
  document.getElementById('alignments').value = alignments;

  const html = editor.root.innerHTML;
  const markdown = toMarkdown(html);
  const encodedMarkdownText = encodeURIComponent(markdown);
  const selectedTheme = themeSelector.value;
  const generatedUrl = `https://yourwebsite.com?text=${encodedMarkdownText}&theme=${selectedTheme}&alignments=${alignments}`;
  urlElement.textContent = generatedUrl;
}

function handleUrlParams(contentElement, md) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has("text")) {
    const markdownText = urlParams.get("text");
    contentElement.innerHTML = md.render(markdownText);
  }

  if (urlParams.has("theme")) {
    const theme = urlParams.get("theme");
    document.body.classList.add(`theme-${theme}`);
  }

  if (urlParams.has("alignments")) {
    const alignments = urlParams.get("alignments").split(',');
    const alignedElements = contentElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
    for (let i = 0; i < alignedElements.length && i < alignments.length; i++) {
      alignedElements[i].style.textAlign = alignments[i];
    }
  }
}
