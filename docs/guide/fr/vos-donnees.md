# Vos données — les garder, les déplacer, les effacer

> Fait partie du [guide d'utilisation](./README.md).

## Où vivent vos mots

**Sur votre appareil, et nulle part ailleurs.** Q‑Art v1 n'a ni compte, ni serveur, ni pistage ; une fois chargée, l'application fonctionne hors ligne. Ce que vous écrivez est stocké dans la base locale de votre navigateur, **chiffré au repos** — les octets stockés sont scellés (AES‑GCM) sous une clé qui ne peut jamais être exportée du magasin de clés du navigateur.

Périmètre honnête : le chiffrement au repos protège les données *telles que stockées*. Il ne défend pas un appareil que quelqu'un d'autre contrôle, ni un navigateur compromis. Les protections de votre appareil (verrouillage, chiffrement du disque) restent votre première ligne.

## Enregistrement automatique et reprise

Tout s'enregistre au fil de l'eau (le discret indicateur *Enregistré* dans l'en-tête). Fermez l'onglet quand vous voulez :

- **l'accueil** propose *Reprendre votre dernière session* ;
- ouvrir directement une interface (favori, actualisation) reprend d'elle-même votre dernière session enregistrée.

## Sauvegarder : le dossier

Depuis toute synthèse, **Vos données → Exporter le dossier** télécharge un fichier JSON portable — vos dossiers, cycles, cartes, synthèses et plans d'action, en clair, à vous. Servez-vous-en pour :

- **sauvegarder** (un navigateur peut purger les données d'un site sous pression de stockage — exportez ce que vous ne voulez pas perdre) ;
- **changer d'appareil** — sur l'autre appareil, *Importer un dossier* et votre session se charge ;
- **relire votre propre histoire** — c'est du JSON lisible, sans verrou.

Le dossier est versionné (`schemaVersion`) : les futures versions de Q‑Art importeront vos anciens fichiers.

> Le fichier exporté n'est **pas chiffré** — c'est votre copie lisible. Rangez-le comme n'importe quel document privé.

## Tout effacer

**Vos données → Supprimer toutes mes données** efface tous les dossiers et cycles stockés sur l'appareil, après confirmation. C'est irréversible (les dossiers exportés, eux, restent où vous les avez rangés). Une session neuve démarre aussitôt.

## Les petites lignes, honnêtement

- Pas d'analytics, pas de télémétrie, pas de cookies. Rien n'est envoyé nulle part — il n'y a pas de serveur pour recevoir.
- Le téléchargement optionnel de **diagnostics** (page À propos) est sans contenu par construction : codes, comptes et durées — jamais vos mots. Il ne quitte votre appareil que si *vous* envoyez le fichier.
- Les préférences (langue, interface choisie, invites masquées) vivent en localStorage — aucun contenu de décision.
- La politique d'ingénierie derrière tout cela : [`docs/data-policy.md`](../../data-policy.md).
