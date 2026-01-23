// utils.js
export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[m]
  );
}

export function markdownToHtml(markdown) {
  if (!markdown) return '';
  let html = String(markdown);

  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)+/gs, m => `<ul>${m}</ul>`);

  html = html.split(/\n\s*\n/).map(b =>
    b.startsWith('<') ? b : `<p>${b}</p>`
  ).join('');

  return html;
}
