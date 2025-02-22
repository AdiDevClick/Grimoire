import JsonWebToken from 'jsonwebtoken';

/**
 * Vérifie que l'utilisateur est bien connecté
 * et que le Token n'a pas été altéré.
 */
export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = JsonWebToken.verify(
            token,
            process.env.TOKEN_SECRET
        );
        const userId = decodedToken.userId;

        req.auth = {
            userId: userId,
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'unauthorized request' });
    }
};
