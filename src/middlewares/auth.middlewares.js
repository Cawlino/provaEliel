const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token mal formatado' });
  }

  const token = parts[1];
  // console.log('DEBUG: auth.middlewares.js - Received token for verification:', token); // Can be re-enabled if needed
  // console.log('DEBUG: auth.middlewares.js - Verifying with JWT_SECRET:', process.env.JWT_SECRET); // Reverted, and logging secret is sensitive
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // Reverted to use process.env.JWT_SECRET
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = verifyToken;
module.exports = verifyToken;
