import mongoose from 'mongoose';

/**
 * Book Model w/ methods
 * @typedef {typeof mongoose.Model & bookSchema} Book
 */

/**
 * @typedef {Object} bookSchema
 * @property {string} _id - Index de l'objet créé automatiquement par MongoDB
 * @property {string} userId
 * @property {string} title
 * @property {string} author
 * @property {string} imageUrl - Path de l'image sur le server
 * @property {Number} year
 * @property {string} genre
 * @property {[object]} ratings - Un array contenant les différentes
 * notes des utilisateurs sous forme d'objet
 * @property {Number} averageRating
 */
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String },
            grade: {
                type: Number,
                min: [1, 'La notation ne peux pas être inférieure à 1'],
                max: [5, 'La notation ne peux pas être supérieure à 5'],
            },
        },
    ],
    averageRating: { type: Number },
});

/**
 * Vérifie que l'utilisateur n'ait pas déjà
 * noté un livre -
 */
bookSchema.pre('save', function (next) {
    const ratingUserId = [];
    try {
        for (const rating of this.ratings) {
            if (ratingUserId.includes(rating.userId)) {
                throw new Error(
                    'Vous ne pouvez pas noter un livre plusieures fois',
                    { cause: { status: 403 } }
                );
            } else {
                ratingUserId.push(rating.userId);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('Book', bookSchema);
