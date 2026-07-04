import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');

function assertFile(path) {
  assert.ok(existsSync(join(root, path)), `${path} should exist`);
}

describe('SimploSite website source', () => {
  it('has required Astro project files and pages', () => {
    for (const path of [
      'astro.config.mjs',
      'netlify.toml',
      'src/data/site.json',
      'src/layouts/BaseLayout.astro',
      'src/pages/index.astro',
      'src/pages/politique-confidentialite.astro',
      'public/robots.txt',
      'README.md'
    ]) assertFile(path);
  });

  it('defines the SimploSite legal/company identity and canonical domain', () => {
    const data = JSON.parse(read('src/data/site.json'));
    assert.equal(data.companyName, 'SimploSite');
    assert.equal(data.neq, '2282327651');
    assert.equal(data.domain, 'simplosite.ca');
    assert.equal(data.canonicalUrl, 'https://simplosite.ca/');
    assert.equal(data.language, 'fr-CA');
  });

  it('home page source contains core offer, trust details, and CTAs without forms', () => {
    const html = read('src/pages/index.astro');
    for (const expected of [
      'Sites web simples',
      'entrepreneurs locaux',
      'Québec',
      'SimploSite',
      '2282327651',
      'Planifier un appel',
      'Demander une estimation'
    ]) assert.match(html, new RegExp(expected, 'i'));
    assert.doesNotMatch(html, /<form|data-netlify|<input|<textarea/i);
  });

  it('privacy page source includes Quebec Law 25 compliant basics and contact email', () => {
    const privacy = read('src/pages/politique-confidentialite.astro');
    for (const expected of ['Loi 25', 'renseignements personnels', 'confidentialité', 'info@simplosite.ca', 'NEQ 2282327651']) {
      assert.match(privacy, new RegExp(expected, 'i'));
    }
  });
});
