# Contribuer

Merci d'avoir envie d'enrichir cette liste 🙌

Il y a **deux façons** de proposer une source. Choisissez celle qui vous met le plus à l'aise : les deux mènent au même résultat.

---

## Option 1 : ouvrir une issue (aucun Git requis)

[**Ouvrir le formulaire « Ajouter une source »**](../../issues/new?template=ajout-source.yml)

Vous remplissez le nom, le lien, le type, le ou les thèmes et une phrase de description. Quelqu'un se charge de l'intégrer. C'est la voie recommandée si vous ne connaissez pas Git.

Pour signaler une source morte ou une erreur : [formulaire « Corriger une source »](../../issues/new?template=correction-source.yml).

---

## Option 2 : ouvrir une pull request

### 1. Vérifiez le périmètre

La source doit relever de la tech : développement, PHP, Java, qualité & architecture, cybersécurité, accessibilité, éco-conception, Git, open source, IA, actu tech, tech & société.

Elle doit aussi cocher les trois critères d'inclusion du [README](README.md#-périmètre) : **vivante**, **accessible gratuitement**, **utile** (elle apporte quelque chose que la liste n'a pas déjà).

Cherchez d'abord dans `data/sources.json` que la source n'y est pas déjà : la CI refuse les doublons d'URL et de nom.

### 2. Ajoutez votre entrée dans `data/sources.json`

**C'est le seul fichier à éditer.** Les pages de `sources/` et `themes/` sont générées.

```jsonc
{
  "name": "Blog JoliCode",                    // le nom tel qu'il s'affiche
  "url": "https://jolicode.com/blog",         // lien direct vers le flux, pas vers la home
  "type": "blog",                             // un seul type, voir data/taxonomy.json
  "themes": ["php", "git"],                   // un à quatre thèmes, voir data/taxonomy.json
  "lang": "FR",                               // FR, EN ou Autre
  "note": "Articles de fond Symfony, profiling, CI. Très actif."
}
```

Quelques règles pour la note :

- **Une à deux phrases**, pas plus. C'est ce qui rend la liste lisible.
- Dites ce qu'on y **trouve concrètement**, pas ce que le site prétend être.
- Mentionnez le **rythme** quand c'est utile (« très actif », « sporadique », « evergreen »).
- Pas de superlatif creux. « Le meilleur blog du monde » n'aide personne ; « DDD/CQRS appliqué à Symfony » si.

Types et thèmes disponibles : voir [`data/taxonomy.json`](data/taxonomy.json). Besoin d'un thème qui n'existe pas ? Ouvrez une issue pour en discuter avant : ajouter un thème pour une seule source dilue le classement.

Les compteurs de sources (par thème, par type, au total) sont calculés automatiquement. Vous n'avez aucun chiffre à mettre à jour nulle part.

### 3. Régénérez et vérifiez

Le plus simple, à faire une seule fois après avoir cloné :

```bash
npm run setup-hooks
```

Un hook Git régénère alors les pages et les ajoute à votre commit dès que vous touchez `data/`. Vous n'avez plus rien à lancer.

Sinon, manuellement :

```bash
npm run build   # régénère les pages Markdown
npm run check   # ce que la CI va vérifier
```

Dans les deux cas, **les fichiers générés doivent être committés** en même temps que votre modification de `data/sources.json`. La CI échoue sinon, en rappelant la commande à lancer.

### 4. Ouvrez la PR

- Une PR = une intention (ajouter une source, en corriger une, retirer les mortes…).
- Décrivez en une ligne pourquoi cette source mérite sa place.
- `main` est protégée : la PR doit passer la CI et être approuvée avant fusion.

---

## Retirer une source

Retirer est aussi utile qu'ajouter. Si un blog n'a rien publié depuis deux ans ou qu'un podcast s'est arrêté, ouvrez une issue ou une PR qui supprime l'entrée. Aucune susceptibilité ici : le but est que la liste reste fiable.

---

## Ajouter un type ou un thème

Ces deux taxonomies vivent dans [`data/taxonomy.json`](data/taxonomy.json). Le générateur ne crée une page que pour les types et thèmes réellement utilisés, vous pouvez donc en déclarer un à l'avance sans polluer le dépôt.

Passez par une issue avant : une taxonomie qui grossit trop vite rend la navigation moins bonne, pas meilleure.

---

## Prérequis technique

Node 18 ou plus. Aucune dépendance à installer : `npm run build` n'utilise que la bibliothèque standard.
