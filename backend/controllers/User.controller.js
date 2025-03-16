import JsonWebToken from 'jsonwebtoken';
import UsersModel from '../models/Users.model.js';
import argon2 from 'argon2';

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

        // Hash password using Argon using "pre" save
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
        // Duplicated key on signup ? (error 11000)
        if (error.code === 11000) {
            error = {
                message: 'Cet utilisateur existe déjà',
                cause: {
                    status: 403,
                },
            };
        }

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

        // Compare hash passwords
        const valid = await argon2.verify(user.password, req.body.password);
        if (!valid) throw new Error(errorMessage, { cause: { status: 401 } });

        const JWTToken = JsonWebToken.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES }
        );

        res.status(200).json({
            userId: user._id,
            token: JWTToken,
        });
    } catch (error) {
        res.status(error.cause ? error.cause.status : 401).json({
            message: error.message,
        });
    }
}
