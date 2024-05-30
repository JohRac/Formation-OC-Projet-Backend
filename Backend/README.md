# Mon vieux Grimoire

## Comment lancer le projet ? 

### Avec npm

Faites la commande `npm install` pour installer les dépendances puis `nodemon server` pour lancer le projet.

### Fichier .env

Créer une fichier .env y ajouter l'url "mongooseConnect" et la "Secret Key" sous se format

{
MONGO_URI=*********

SECRET_KEY=********
}

### Pour importer le fichier data.Json

Allumer le serveur et entrer la commande `curl -X POST http://localhost:4000/api/data/database` dans le terminal