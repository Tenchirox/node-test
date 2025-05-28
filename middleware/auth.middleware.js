import jwt from 'jsonwebtoken';

export function verifiyToken(req, res, next) {
   const awtHeader = req.headers['authorization'];
    const token = awtHeader.split(' ')[1];

   const decoded = jwt.verify(awtHeader, process.env.JWT_SECRET);

   if (!decoded) return res.status(403).send('Unauthorized!');
   req.user = decoded;
   next();
}