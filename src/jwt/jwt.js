const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: "no token" })
    }
    const tokenSplit = token.split(" ");
    if (tokenSplit[0] !== 'nuol_research') {
        return res.status(403).json({ message: 'invalid token' });
    }
    jwt.verify(tokenSplit[1], process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.name == 'TokenExpireError') {
                return res.status(500).json({ message: err.message });
            }
        }
        req.payload = payload;
        next();
    })
}

module.exports = verifyToken;
