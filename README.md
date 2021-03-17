# users-api
API Node.js avec Express

Pour lancer le projet:
- npm run server => ensuite rendez-vous sur localhost:6929


Liste des routes:
- get('/') => point d'entrée pour le projet Vue.js en production intégré au projet
- get('/users') => récupération de la liste des utilisateurs
- get('/users/:id') => récupération d'un utilisateur en fonction de son id
- post('/users') => création d'un utilisateur
- put('/users/:id') => modification d'un utilisateur en fonction de son id
- delete('/users/:id') => suppression d'un utilisateur en fonction de son id


Liste des dépendances:
- cors
- express
- express-fileupload
- nodemon
