// blog.js
import { markdownToHtml, escapeHtml } from './utils.js';

let posts = [];
let index = 0;

export async function loadBlogPosts() {
  try {
    const r = await fetch('_posts/index.json');
    const files = await r.json();

    for (const f of files) {
      const md = await fetch(`_posts/${f}.md`).then(r => r.text());
      const p = parsePost(md);
      posts.push(p);
    }

    render();
  } catch (e) {
    console.error('Blog load failed', e);
  }
}

function parsePost(md) {
  const [, fm, body] = md.split('---');
  const meta = {};
  fm.split('\n').forEach(l => {
    const [k, v] = l.split(':');
    if (k) meta[k.trim()] = v?.trim();
  });
  return { ...meta, content: body };
}

function render() {
  const c = document.getElementById('blog-carousel');
  if (!c) return;

  c.innerHTML = `
    <h3>${escapeHtml(posts[index].title)}</h3>
    <div>${markdownToHtml(posts[index].content)}</div>
  `;
}
