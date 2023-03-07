import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    const navWrapper = document.createElement('div');
    navWrapper.innerHTML = html;

    block.append(navWrapper);
  }
}
