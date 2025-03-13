import JsonWebToken from 'jsonwebtoken';

/**
 * Vérifie que l'utilisateur est bien connecté
 * et que le Token n'a pas été altéré.
 */
export const auth = (req, res, next) => {
    try {
        // No Authorization Headers ?
        if (!req.headers.authorization) {
            throw new Error('unauthorized request', { cause: { status: 401 } });
        }

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
        res.status(error.cause ? error.cause.status : 401).json({
            message: error.message,
            error: error,
        });
    }
};
