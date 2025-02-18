import JsonWebToken from 'jsonwebtoken';
import UsersModel from '../models/Users.model.js';
import bcrypt from 'bcrypt';

/**
 * Crer un utilisateur unique dans la DB
 * Son password sera hash 10
 * @returns {{message: string}}
 * @returns {Error}
 */
export async function signup(req, res) {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new UsersModel({
            email: req.body.email,
            password: hash,
        });
        const createdUser = await user.save();
        if (createdUser) {
            return res
                .status(201)
                .json({ message: 'Utilisateur enregistré !' });
        }
        throw new Error('error', {
            cause: {
                status: 400,
                message: "Création de l'utilisateur impossible",
            },
        });
    } catch (error) {
        if (error.cause?.status === 400)
            return res.status(400).json({ message: error.cause.message });
        res.status(500).json({ error });
    }
}

/**
 * Vérifie que l'utilisateur existe dans la DB
 * puis compare le hash des mots de passes avec bcrypt.
 * @returns {{userId: string, token: string}}
 * @returns {Error}
 */
export async function login(req, res) {
    const errorMessage = 'Utilisateur ou Mot de passe incorrecte';
    try {
        const user = await UsersModel.findOne({ email: req.body.email });
        if (user === null) {
            return res.status(401).json({
                message: errorMessage,
            });
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(401).json({ message: errorMessage });
        return res.status(200).json({
            userId: user._id,
            token: JsonWebToken.sign(
                { userId: user._id },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: process.env.TOKEN_EXPIRES,
                }
            ),
        });
    } catch (error) {
        res.status(401).json({ error });
    }
}
