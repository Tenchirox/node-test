// main.js
import 'dotenv/config'; // Pour charger les variables d'environnement au début
console.log('MONGO_URI chargé:', process.env.MONGO_URI);
console.log('PORT chargé:', process.env.PORT);
console.log('SECRET_KEY chargée:', process.env.SECRET_KEY ? 'Oui' : 'Non');

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Pour la gestion des chemins en ESM
import path from 'path';
import { fileURLToPath } from 'url';

// Routes (avec extension .js)
import usersRoutes from './routes/users.route.js';
import formateursRoutes from './routes/formateurs.route.js';

// __dirname n'est pas disponible en ESM, voici l'alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/users', usersRoutes);
app.use('/api/formateurs', formateursRoutes);

// Routes pour servir les pages HTML principales
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connecté à MongoDB');
        app.listen(port, () => {
            console.log(`Serveur démarré sur http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Erreur de connexion à MongoDB', err);
    });