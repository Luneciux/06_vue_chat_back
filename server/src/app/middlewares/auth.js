const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
  const authHeaeder = req.headers.authorization;

  if(!authHeaeder)
    return res.status(401).send({ error: 'No token provided' });

  const parts = authHeaeder.split(' ');

  if(!parts.length === 2)
    return res.status(401).send({ error: 'Unexpected token format' });

  const [ scheme, token ] = parts;

  if(!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Bad token format' })

  
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Invalid token' });

    req.userId = decoded.id;
    return next();
  });
  
}