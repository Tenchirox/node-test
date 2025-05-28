// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'Accès non autorisé: Token manquant' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Accès interdit: Token expiré' });
            }
            return res.status(403).json({ message: 'Accès interdit: Token invalide' });
        }
        req.user = user;
        next();
    });
}

export default verifyToken;