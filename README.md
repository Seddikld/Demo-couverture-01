# Entreprise Familial de Couverture — Site vitrine (démo)

Landing page premium pour une entreprise de couverture, traitement de toiture et de façade, basée à Ambarès-et-Lagrave (Gironde).

Site 100 % statique (HTML / CSS / JavaScript), sans framework ni étape de build : simple à comprendre, à modifier et à déployer.

## 📁 Structure du projet

```
toiture-prestige-33/
├── index.html          → Page unique contenant toutes les sections
├── css/
│   └── style.css       → Tous les styles (couleurs, typographie, responsive, animations)
├── js/
│   └── script.js       → Menu mobile, animations au scroll, formulaire
├── images/              → (dossier prêt à recevoir vos futures photos)
├── netlify.toml         → Configuration de déploiement Netlify
├── robots.txt / sitemap.xml → SEO de base
└── README.md
```

## ▶️ Lancer le site en local

Aucune installation n'est nécessaire. Deux façons simples de prévisualiser le site :

**Option 1 — le plus simple**
Double-cliquez sur le fichier `index.html` : il s'ouvre directement dans votre navigateur.

**Option 2 — avec un serveur local (recommandé pour tester le formulaire)**
Si vous avez Python installé :
```bash
cd toiture-prestige-33
python3 -m http.server 8000
```
Puis ouvrez `http://localhost:8000` dans votre navigateur.

## 🚀 Déployer sur Netlify

**Méthode la plus simple (glisser-déposer) :**
1. Rendez-vous sur [app.netlify.com](https://app.netlify.com) et créez un compte gratuit.
2. Sur la page d'accueil, glissez-déposez le dossier `toiture-prestige-33` complet dans la zone « Deploy manually ».
3. Netlify publie le site en quelques secondes et vous fournit une adresse en `.netlify.app`.
4. Dans **Site settings → Domain management**, vous pouvez ensuite associer votre propre nom de domaine (ex. `entreprise-familiale-couverture33.fr`, une fois acheté).

**Méthode recommandée pour la mise à jour continue (via Git) :**
1. Créez un dépôt (GitHub, GitLab...) et poussez-y le contenu de ce dossier.
2. Sur Netlify, cliquez sur « Add new site → Import an existing project » et connectez votre dépôt.
3. Laissez le champ *build command* vide et indiquez `.` comme *publish directory* (déjà préconfiguré dans `netlify.toml`).
4. Chaque futur envoi (`git push`) republiera automatiquement le site.

Le formulaire de devis utilise **Netlify Forms** : aucune configuration serveur n'est nécessaire, les demandes reçues via le formulaire apparaîtront automatiquement dans l'onglet **Forms** de votre tableau de bord Netlify (avec option d'être notifié par e-mail).

## ✅ Informations vérifiées déjà intégrées

Ces données publiques de l'entreprise ont été intégrées partout où c'est pertinent (header, hero, formulaire, footer, boutons d'appel, données structurées JSON-LD) :

| Élément | Valeur |
|---|---|
| Nom | Entreprise Familial de Couverture - Traitement de toiture et façade |
| Adresse | 18 Rue de Ribeyrotte, 33440 Ambarès-et-Lagrave, France |
| Téléphone | +33 6 44 67 47 86 (affiché en 06 44 67 47 86, cliquable via `tel:+33644674786`) |
| Activité | Couvreur / traitement de toiture et façade |

⚠️ Le bouton WhatsApp réutilise ce même numéro de mobile par hypothèse (le plus courant chez les artisans) — confirmez que WhatsApp est bien actif sur cette ligne, sinon remplacez le lien `wa.me/33644674786` dans `index.html` (3 occurrences) par le bon numéro ou retirez le bouton.

## ✏️ Informations encore fictives à remplacer avant mise en ligne réelle

Le reste du contenu est une **démonstration commerciale** et doit être finalisé avant toute mise en ligne réelle. Chaque élément fictif est signalé sur le site lui-même (badge « exemple/démonstration », mentions « à compléter ») pour ne jamais être pris pour une donnée réelle :

| Élément | Valeur actuelle (fictive) | À faire |
|---|---|---|
| E-mail | contact@entreprise-familiale-couverture33.fr | E-mail réel |
| Nom de domaine | entreprise-familiale-couverture33.fr | Domaine réel une fois acheté |
| SIRET | « [donnée de démonstration — à compléter] » | Numéro SIRET réel |
| Assurance décennale / garantie | « [donnée de démonstration — à compléter] » | Assureur et références réels (obligatoire légalement en France pour ce type d'activité) |
| Avis clients | Noms et avis d'exemple, marqués « Avis de démonstration » (Sophie D., Marc L., Amandine B.) | Vrais avis de clients, avec leur accord |
| Chiffres clés (« 15 ans d'expérience », etc.) | Exemples, marqués d'un astérisque | Chiffres réels de l'entreprise |
| Photos de réalisations | Illustrations vectorielles marquées « Exemple » | Vraies photos de chantiers (dossier `images/`) |
| Horaires (footer) | Lun–Ven : 8h–18h (valeur par défaut illustrative) | Horaires réels |
| Réseaux sociaux (footer) | Liens `#` | Vrais liens Facebook / Instagram / LinkedIn |
| Mentions légales / confidentialité | Liens `#` (pages à créer) | Rédiger ces pages obligatoires |
| Carte (zone d'intervention) | Ambarès-et-Lagrave (OpenStreetMap) | Peut être conservée ou remplacée par Google Maps |

💡 **Astuce** : la plupart de ces éléments sont regroupés en haut du fichier `index.html` (balises `<meta>`, script JSON-LD) et se répètent ensuite dans le header, le hero, la section devis et le footer — un remplacement global (rechercher/remplacer) suffit pour la majorité.

## 🎨 Personnaliser le design

Les couleurs, polices et espacements sont centralisés en haut du fichier `css/style.css`, dans la section `:root` :
```css
--color-dark:   #1a2332;  /* couleur principale sombre */
--color-accent: #d97742;  /* couleur d'accent (orange terracotta) */
```
Modifier ces valeurs suffit à changer l'identité visuelle de tout le site.

## ✅ Fonctionnalités incluses

- Design premium, responsive (mobile / tablette / desktop)
- Menu mobile animé
- Boutons d'appel et bouton WhatsApp flottant
- Formulaire de demande de devis prêt pour Netlify Forms (avec anti-spam honeypot)
- Animations légères au défilement
- Métadonnées SEO de base + données structurées (schema.org) + `robots.txt` / `sitemap.xml`
- Favicon vectoriel intégré (aucun fichier image externe requis)
- Accessibilité de base (lien d'évitement, attributs ARIA, contrastes, focus visible)
- Aucune dépendance externe lourde : chargement rapide
