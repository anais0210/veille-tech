# 📡 Veille tech francophone

Une liste curée de **sources de veille tech en français** : blogs, podcasts, newsletters, chaînes vidéo et médias qui parlent de développement, PHP, Java, qualité de code, cybersécurité, accessibilité et éco-conception numérique.

Chaque source est **lue ou écoutée avant d'être ajoutée**, avec une phrase honnête sur ce qu'on y trouve — et sur son rythme de publication. Pas de liste morte de 400 liens : ici, tout est vivant.

> 🇫🇷 Le francophone manque cruellement de listes de veille maintenues. C'est la raison d'être de ce dépôt.

---

## 🚀 Par où commencer

| Vous cherchez… | Allez ici |
| --- | --- |
| une source sur **un sujet précis** | 👉 [Parcourir par thème](themes/) |
| un **format** particulier (podcast, blog…) | 👉 [Parcourir par type](sources/) |
| à **ajouter une source** | 👉 [Guide de contribution](CONTRIBUTING.md) · [Ouvrir une issue](../../issues/new?template=ajout-source.yml) |
| les **règles d'inclusion** | 👉 [Ce qui entre, ce qui n'entre pas](#-p%C3%A9rim%C3%A8tre) |

---

## 📚 Le catalogue

<!-- AUTOGEN:START -->
<!-- Bloc généré par `npm run build` — ne pas éditer à la main. -->

**55 sources** réparties en **5 types** et **12 thèmes**.

### Par thème

| Thème | Sources | De quoi ça parle |
| --- | --- | --- |
| 💻 **[Développement](themes/developpement.md)** | 16 | Pratique du métier, langages, écosystème web, culture dev. |
| 🐘 **[PHP / Symfony / Laravel](themes/php.md)** | 17 | L'écosystème PHP : le langage, ses frameworks et ses communautés. |
| ☕ **[Java](themes/java.md)** | 9 | Java et la JVM : Spring, Quarkus, Kotlin, outillage. |
| 🏛️ **[Qualité & architecture](themes/qualite-architecture.md)** | 20 | Craft, tests, TDD, Clean Architecture, DDD, CQRS, refactoring, dette technique. |
| 🔐 **[Cybersécurité](themes/cybersecurite.md)** | 12 | Sécurité applicative, défensive et offensive, veille menaces. |
| ♿ **[Accessibilité](themes/accessibilite.md)** | 5 | RGAA, RAWeb, WCAG, European Accessibility Act, conception inclusive. |
| 🌱 **[Éco-conception numérique](themes/eco-conception.md)** | 7 | Sobriété numérique, RGESN, mesure d'impact, numérique responsable. |
| 🌿 **[Git](themes/git.md)** | 3 | Git, workflows de contribution, CI/CD, forges. |
| 🔓 **[Open source](themes/open-source.md)** | 7 | Logiciel libre, communs numériques, gouvernance de projets ouverts. |
| 🤖 **[IA](themes/ia.md)** | 4 | Intelligence artificielle appliquée au développement et ses usages. |
| 📡 **[Actu tech](themes/actu-tech.md)** | 4 | Veille généraliste, actualité hebdomadaire de l'écosystème. |
| 🧭 **[Tech & société](themes/tech-societe.md)** | 7 | Éthique, impacts sociaux et politiques de la technique. |

### Par type

| Type | Sources |
| --- | --- |
| 📝 **[Blogs](sources/blog.md)** | 23 |
| 🎧 **[Podcasts](sources/podcast.md)** | 16 |
| ✉️ **[Newsletters](sources/newsletter.md)** | 2 |
| 🎥 **[Vidéos & conférences](sources/video.md)** | 7 |
| 📰 **[Médias & agrégateurs](sources/media.md)** | 7 |

<!-- AUTOGEN:END -->

---

## 🎯 Périmètre

**Ce dépôt accepte** tout ce qui touche à la fabrication du logiciel et à ses conséquences directes :

développement · PHP / Symfony / Laravel · Java · qualité & architecture · cybersécurité · accessibilité · éco-conception numérique · Git · open source · IA · actu tech · tech & société.

**Ce dépôt n'accepte pas** les sources hors du champ technique, même excellentes — écologie généraliste, féminisme, géopolitique, permaculture, santé mentale… Ce n'est pas un jugement de valeur, c'est une question de lisibilité : une liste qui parle de tout ne sert à personne.

Trois critères, cumulatifs :

1. **Vivante** — publication dans les 18 derniers mois, ou contenu explicitement evergreen (référence, cours).
2. **Accessible** — consultable gratuitement, au moins en partie. Pas de paywall intégral.
3. **Utile** — apporte quelque chose que les autres sources de la liste n'apportent pas déjà.

---

## 🗂 Comment c'est rangé

La **source de vérité unique** est [`data/sources.json`](data/sources.json). Toutes les pages Markdown (`sources/`, `themes/`, et le catalogue ci-dessus) en sont **générées** — on ne les édite jamais à la main.

```
veille-tech/
├── data/
│   ├── sources.json     ← 🎯 la seule chose à éditer pour ajouter une source
│   └── taxonomy.json    ← la liste des types et des thèmes autorisés
├── sources/             ← généré : une page par type (blogs, podcasts…)
├── themes/              ← généré : une page par thème (accessibilité, java…)
└── scripts/build.mjs    ← le générateur (Node, zéro dépendance)
```

Ce choix évite le piège classique des listes curées : une même source recopiée dans trois fichiers, dont deux finissent périmés.

### Régénérer les pages

```bash
npm run build     # régénère sources/, themes/ et le bloc du README
npm run check     # vérifie que tout est à jour + valide les données (utilisé en CI)
```

---

## 🤝 Contribuer

Les propositions sont les bienvenues, y compris pour **retirer** une source devenue inactive.

- **La façon la plus simple** : [ouvrir une issue](../../issues/new?template=ajout-source.yml) — un formulaire guidé, aucune connaissance de Git requise.
- **En pull request** : ajoutez votre entrée dans `data/sources.json`, lancez `npm run build`, committez les fichiers générés.

Tout est détaillé dans [CONTRIBUTING.md](CONTRIBUTING.md). La branche `main` est protégée : chaque changement passe par une PR relue et par la CI.

Ce projet suit un [code de conduite](CODE_OF_CONDUCT.md). En participant, vous vous engagez à le respecter.

---

## 📄 Licence

[MIT](LICENSE) — réutilisez, forkez, adaptez librement.

Les liens pointent vers des contenus appartenant à leurs auteurs et autrices respectives ; seules les données de cette liste (classement, notes) sont couvertes par cette licence.
