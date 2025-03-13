import mongoose from 'mongoose';
import Books from '../models/Books.model.js';

/**
 * Permet de se connecter à la MongoDB Atlas
 */
export function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Send a ping to confirm a successful connection
        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        );
    } catch (error) {
        console.log('Connexion à MongoDB échouée !', error);
    }
}

/**
 * Retourne un book
 * @param {Request} req - La requête complète
 * @returns
 */
export async function getABook(req) {
    const id = req.params.id;
    try {
        return await Books.findOne({ _id: id });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/**
 * Fetch le Book et retourne l'average des différentes
 * notes que les utilisateurs ont postés -
 * @param {string} id - L'ID du book à rechercher
 * @returns {object}
 */
export async function calculatedAVG(id) {
    const calculatedAVG = await Books.aggregate([
        { $match: { _id: id } },
        {
            $project: {
                averageRating: { $avg: '$ratings.grade' },
            },
        },
    ]);
    return await calculatedAVG;
}
