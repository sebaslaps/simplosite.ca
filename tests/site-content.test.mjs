import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');
const exists = (path) => existsSync(join(root, path));

const forbiddenPublicTerms = [
  /NEQ/i,
  /2282327651/i,
  /politique-confidentialite/i,
  /confidentialité/i,
  /Netlify/i,
  /statique/i,
  /build/i,
  /déploiement/i,
  /SEO/i,
  /technique/i,
  /robots\.txt/i,
  /sitemap/i
];

describe('SimploSite simplified public website', () => {
  it('has only the required simple Astro project files and homepage', () => {
    for (const path of [
      'astro.config.mjs',
      'netlify.toml',
      'src/data/site.json',
      'src/layouts/BaseLayout.astro',
      'src/pages/index.astro',
      'public/robots.txt',
      'README.md'
    ]) assert.ok(exists(path), `${path} should exist`);

    assert.equal(exists('src/pages/politique-confidentialite.astro'), false, 'privacy page should be removed');
  });

  it('defines the SimploSite brand and canonical domain without exposing NEQ', () => {
    const data = JSON.parse(read('src/data/site.json'));
    assert.equal(data.companyName, 'SimploSite');
    assert.equal(data.domain, 'simplosite.ca');
    assert.equal(data.canonicalUrl, 'https://simplosite.ca/');
    assert.equal(data.language, 'fr-CA');
    assert.equal(Object.hasOwn(data, 'neq'), false);
  });

  it('homepage speaks to non-technical service providers in plain language', () => {
    const home = read('src/pages/index.astro');
    for (const expected of [
      'Sites web simples',
      'gens de métier',
      'entreprises de services',
      'clients vous trouvent',
      'Demandez une soumission',
      'clair',
      'simple'
    ]) assert.match(home, new RegExp(expected, 'i'));

    assert.doesNotMatch(home, /Parler de mon site/i);
    assert.doesNotMatch(home, /Appel découverte/i);
    assert.doesNotMatch(home, /Téléphone/i);
    assert.doesNotMatch(home, /À confirmer/i);
    assert.match(home, /contact-card centered/i);
    for (const forbidden of forbiddenPublicTerms) assert.doesNotMatch(home, forbidden);
    assert.doesNotMatch(home, /<form|data-netlify|<input|<textarea/i);
  });

  it('layout has no privacy link, legal identifier, or technical marketing language', () => {
    const layout = read('src/layouts/BaseLayout.astro');
    for (const forbidden of forbiddenPublicTerms) assert.doesNotMatch(layout, forbidden);
    assert.match(layout, /site-footer centered/i);
  });
});
