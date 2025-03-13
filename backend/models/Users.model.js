import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import argon2 from 'argon2';
import { emailRegex, passwordRegex } from '../configs/config.js';

/**
 * User Model w/ methods
 * @typedef {typeof mongoose.Model & userSchema} User
 */

/**
 * @typedef {Object} userSchema
 * @property {string} _id - Index de l'objet créé automatiquement par MongoDB
 * @property {string} email - Email de l'utilisateur.
 * @property {string} password - Mot de passe de l'utilisateur
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Un email est requis'],
        validate: {
            validator: (v) => {
                return emailRegex.test(v);
            },
            message: 'Un email est requis',
        },
    },
    password: {
        type: String,
        required: [true, 'Un mot de passe est requis'],
        validate: {
            validator: (v) => {
                return passwordRegex.test(v);
            },
            message:
                'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial',
        },
    },
});

/**
 * Hash le mot de passe avant de sauvegarder l'utilisateur
 * Utilisé sur la route users/signup
 */
userSchema.pre('save', async function (next) {
    if (!this.$isNew) {
        throw new Error('unauthorized request');
        next();
    }

    try {
        this.password = await argon2.hash(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.plugin(mongooseUniqueValidator);

export default mongoose.model('User', userSchema);
