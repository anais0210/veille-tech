#!/usr/bin/env node
/**
 * Génère les pages Markdown du repo à partir de `data/sources.json`.
 *
 *   node scripts/build.mjs           # (ré)écrit les fichiers générés
 *   node scripts/build.mjs --check   # échoue si un fichier généré n'est pas à jour
 *
 * Aucune dépendance : Node 18+ suffit.
 */

import { readFileSync, writeFileSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const { sources } = JSON.parse(readFileSync(join(ROOT, 'data/sources.json'), 'utf8'));
const { types, themes } = JSON.parse(readFileSync(join(ROOT, 'data/taxonomy.json'), 'utf8'));

const typeById = new Map(types.map((t) => [t.id, t]));
const themeById = new Map(themes.map((t) => [t.id, t]));

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const errors = [];
const seenUrls = new Map();
const seenNames = new Map();

for (const s of sources) {
  const where = `« ${s.name ?? '(sans nom)'} »`;
  for (const field of ['name', 'url', 'type', 'lang']) {
    if (!s[field]) errors.push(`${where} : champ obligatoire manquant → ${field}`);
  }
  if (!Array.isArray(s.themes) || s.themes.length === 0) {
    errors.push(`${where} : au moins un thème est requis`);
  }
  if (s.type && !typeById.has(s.type)) {
    errors.push(`${where} : type inconnu « ${s.type} » (voir data/taxonomy.json)`);
  }
  for (const t of s.themes ?? []) {
    if (!themeById.has(t)) errors.push(`${where} : thème inconnu « ${t} » (voir data/taxonomy.json)`);
  }
  if (s.url && !/^https?:\/\//.test(s.url)) {
    errors.push(`${where} : l'URL doit commencer par http:// ou https://`);
  }
  if (s.url) {
    if (seenUrls.has(s.url)) errors.push(`URL en double : ${s.url} (${seenUrls.get(s.url)} / ${s.name})`);
    else seenUrls.set(s.url, s.name);
  }
  if (s.name) {
    const key = s.name.toLowerCase();
    if (seenNames.has(key)) errors.push(`Nom en double : ${s.name}`);
    else seenNames.set(key, s.name);
  }
}

if (errors.length) {
  console.error('❌ data/sources.json invalide :\n' + errors.map((e) => `  • ${e}`).join('\n'));
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const collator = new Intl.Collator('fr', { sensitivity: 'base' });
const byName = (a, b) => collator.compare(a.name, b.name);
const esc = (s = '') => s.replace(/\|/g, '\\|');

/**
 * Tableau Markdown des sources.
 *
 * `column` vaut 'themes' (pages par type) ou 'type' (pages par thème).
 * `prefix` est le chemin relatif vers le dossier de destination des liens,
 * depuis la page en cours de génération — d'où les `../`.
 */
function table(list, { column, prefix }) {
  const head =
    column === 'themes'
      ? '| Source | Thèmes | Langue | En un mot |\n| --- | --- | --- | --- |'
      : '| Source | Type | Langue | En un mot |\n| --- | --- | --- | --- |';

  const rows = list.sort(byName).map((s) => {
    const cell =
      column === 'themes'
        ? s.themes.map((id) => `[${themeById.get(id).label}](${prefix}${id}.md)`).join(', ')
        : `[${typeById.get(s.type).emoji} ${typeById.get(s.type).label}](${prefix}${s.type}.md)`;
    return `| **[${esc(s.name)}](${s.url})** | ${cell} | ${s.lang} | ${esc(s.note || '—')} |`;
  });

  return [head, ...rows].join('\n');
}

const BANNER = '<!-- Fichier généré par `npm run build` — ne pas éditer à la main. -->\n<!-- Pour ajouter ou modifier une source : data/sources.json -->\n';

const written = [];
function emit(relPath, content) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  const next = content.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  const current = (() => {
    try {
      return readFileSync(full, 'utf8');
    } catch {
      return null;
    }
  })();
  if (current !== next) {
    if (CHECK) {
      console.error(`❌ Pas à jour : ${relPath} — lance \`npm run build\` puis committe.`);
      process.exitCode = 1;
    } else {
      writeFileSync(full, next);
    }
  }
  written.push(relPath);
}

/* ------------------------------------------------------------------ */
/* Pages par type — sources/<type>.md                                  */
/* ------------------------------------------------------------------ */

const usedTypes = types.filter((t) => sources.some((s) => s.type === t.id));
const usedThemes = themes.filter((t) => sources.some((s) => s.themes.includes(t.id)));

for (const t of usedTypes) {
  const list = sources.filter((s) => s.type === t.id);
  emit(
    `sources/${t.id}.md`,
    `${BANNER}
# ${t.emoji} ${t.plural}

${list.length} source${list.length > 1 ? 's' : ''}. [↩ Retour à l'index](../README.md) · [Parcourir par thème](../themes/)

${table(list, { column: 'themes', prefix: '../themes/' })}
`,
  );
}

emit(
  'sources/README.md',
  `${BANNER}
# Sources par type

[↩ Retour à l'index](../README.md)

${usedTypes
  .map((t) => {
    const n = sources.filter((s) => s.type === t.id).length;
    return `- ${t.emoji} **[${t.plural}](${t.id}.md)** — ${n} source${n > 1 ? 's' : ''}`;
  })
  .join('\n')}
`,
);

/* ------------------------------------------------------------------ */
/* Pages par thème — themes/<theme>.md                                 */
/* ------------------------------------------------------------------ */

for (const t of usedThemes) {
  const list = sources.filter((s) => s.themes.includes(t.id));
  emit(
    `themes/${t.id}.md`,
    `${BANNER}
# ${t.emoji} ${t.label}

${t.description}

${list.length} source${list.length > 1 ? 's' : ''}. [↩ Retour à l'index](../README.md) · [Parcourir par type](../sources/)

${table(list, { column: 'type', prefix: '../sources/' })}
`,
  );
}

emit(
  'themes/README.md',
  `${BANNER}
# Sources par thème

[↩ Retour à l'index](../README.md)

${usedThemes
  .map((t) => {
    const n = sources.filter((s) => s.themes.includes(t.id)).length;
    return `- ${t.emoji} **[${t.label}](${t.id}.md)** — ${n} source${n > 1 ? 's' : ''} · ${t.description}`;
  })
  .join('\n')}
`,
);

/* ------------------------------------------------------------------ */
/* Bloc généré du README                                               */
/* ------------------------------------------------------------------ */

const readmePath = join(ROOT, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
const START = '<!-- AUTOGEN:START -->';
const END = '<!-- AUTOGEN:END -->';

const block = `${START}
<!-- Bloc généré par \`npm run build\` — ne pas éditer à la main. -->

**${sources.length} sources** réparties en **${usedTypes.length} types** et **${usedThemes.length} thèmes**.

### Par thème

| Thème | Sources | De quoi ça parle |
| --- | --- | --- |
${usedThemes
  .map(
    (t) =>
      `| ${t.emoji} **[${t.label}](themes/${t.id}.md)** | ${sources.filter((s) => s.themes.includes(t.id)).length} | ${esc(t.description)} |`,
  )
  .join('\n')}

### Par type

| Type | Sources |
| --- | --- |
${usedTypes
  .map((t) => `| ${t.emoji} **[${t.plural}](sources/${t.id}.md)** | ${sources.filter((s) => s.type === t.id).length} |`)
  .join('\n')}

${END}`;

if (!readme.includes(START) || !readme.includes(END)) {
  console.error(`❌ README.md : marqueurs ${START} / ${END} introuvables.`);
  process.exit(1);
}

const nextReadme = readme.replace(new RegExp(`${START}[\\s\\S]*${END}`), block);
if (nextReadme !== readme) {
  if (CHECK) {
    console.error('❌ Pas à jour : README.md — lance `npm run build` puis committe.');
    process.exitCode = 1;
  } else {
    writeFileSync(readmePath, nextReadme);
  }
}

/* ------------------------------------------------------------------ */
/* Nettoyage des pages orphelines                                      */
/* ------------------------------------------------------------------ */

for (const dir of ['sources', 'themes']) {
  for (const file of readdirSync(join(ROOT, dir))) {
    if (!file.endsWith('.md')) continue;
    const rel = `${dir}/${file}`;
    if (written.includes(rel)) continue;
    if (CHECK) {
      console.error(`❌ Fichier orphelin : ${rel} — lance \`npm run build\`.`);
      process.exitCode = 1;
    } else {
      unlinkSync(join(ROOT, rel));
      console.log(`🗑  supprimé ${rel}`);
    }
  }
}

if (!process.exitCode) {
  console.log(
    CHECK
      ? `✅ Tout est à jour (${sources.length} sources).`
      : `✅ ${sources.length} sources → ${written.length + 1} fichiers générés.`,
  );
}
