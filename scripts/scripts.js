import {
  buildBlock, decorateBlock,
  decorateBlocks,
  decorateSections,
  decorateTemplateAndTheme, loadBlock,
  loadBlocks,
  loadCSS,
  sampleRUM,
  waitForLCP,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

function loadHeader(doc) {
  const headerBlock = buildBlock('header', '');
  const header = doc.querySelector('header');
  header.append(headerBlock);

  decorateBlock(headerBlock);
  loadBlock(headerBlock);
}

function loadProfile(doc) {
  const profileBlock = buildBlock('profile', '');
  const profileWrapper = doc.querySelector('.default-content-wrapper');
  profileWrapper.append(profileBlock);

  decorateBlock(profileBlock);
  loadBlock(profileBlock);
}

function loadLinks() {
  const profileBlock = buildBlock('links', '');
  loadBlock(profileBlock);
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  main.classList.add('wrapper');

  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc);
  loadProfile(doc);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadCSS('https://fonts.googleapis.com/css?family=Sofia');
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);

  sampleRUM('lazy');
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
