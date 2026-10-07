// Syncs the shared header/footer into every page and creates any missing placeholder pages.
//   npm run build
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const partial = (name) => readFileSync(join(root, 'tools', 'partials', `${name}.html`), 'utf8').trim();
const header = partial('header');
const footer = partial('footer');

const STUBS = [
  { file: 'about-us.html', title: 'About Us' },
  { file: 'services.html', title: 'Services' },
  { file: 'free-quote.html', title: 'Free Quote' },
  { file: 'contact-us.html', title: 'Contact Us' },
];

const stubTemplate = ({ title }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Micah Leigh Painting</title>
  <meta name="robots" content="noindex, follow">
  <link rel="icon" href="assets/img/icon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/img/icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <meta name="theme-color" content="#1170D6">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Instrument+Sans:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="assets/css/style.css">
  <script>document.documentElement.classList.add('js')</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<!--@header--><!--@/header-->
<main id="main" class="stub">
  <div class="wrap">
    <h1>${title}</h1>
  </div>
</main>
<!--@footer--><!--@/footer-->
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;

for (const s of STUBS) {
  const p = join(root, s.file);
  if (!existsSync(p)) {
    writeFileSync(p, stubTemplate(s));
    console.log('created', s.file);
  }
}

const region = (tag, html) => new RegExp(`<!--@${tag}-->[\\s\\S]*?<!--@/${tag}-->`);
const pages = readdirSync(root).filter((f) => f.endsWith('.html') && f !== '404.html');

for (const file of pages) {
  const p = join(root, file);
  let html = readFileSync(p, 'utf8');
  const h = header.replace(
    new RegExp(`<a class="nl" href="${file}"`),
    `<a class="nl" href="${file}" aria-current="page"`,
  );
  const out = html
    .replace(region('header'), () => `<!--@header-->\n${h}\n<!--@/header-->`)
    .replace(region('footer'), () => `<!--@footer-->\n${footer}\n<!--@/footer-->`);
  if (out !== html) writeFileSync(p, out);
  console.log('synced ', file);
}
