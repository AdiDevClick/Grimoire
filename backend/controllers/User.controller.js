import JsonWebToken from 'jsonwebtoken';
import UsersModel from '../models/Users.model.js';
import bcrypt from 'bcrypt';

/**
 * Crer un utilisateur unique dans la DB
 * @returns {{message: string}}
 * @returns {Error}
 */
export async function signup(req, res) {
    try {
        const user = new UsersModel({
            email: req.body.email.toString().trim(),
            password: req.body.password.toString(),
        });
        const createdUser = await user.save();

        if (createdUser) {
            return res
                .status(201)
                .json({ message: 'Utilisateur enregistré !' });
        } else {
            throw new Error("Création de l'utilisateur impossible", {
                cause: { status: 400 },
            });
        }
    } catch (error) {
        res.status(error.cause ? error.cause.status : 500).json({
            message: error.message,
        });
    }
}

/**
 * Vérifie que l'utilisateur existe dans la DB
 * puis compare le hash des mots de passes avec bcrypt.
 * @param {Request} req
 * @returns {{userId: string, token: string}}
 * @returns {Error}
 */
export async function login(req, res) {
    const errorMessage = 'Utilisateur ou Mot de passe incorrecte';
    try {
        /** @type {import('../models/Users.model.js').User} */
        const user = await UsersModel.findOne({ email: req.body.email });

        if (user === null) {
            throw new Error(errorMessage, { cause: { status: 401 } });
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) throw new Error(errorMessage, { cause: { status: 401 } });

        res.status(200).json({
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
        res.status(error.cause ? error.cause.status : 401).json({
            message: error.message,
        });
    }
}
