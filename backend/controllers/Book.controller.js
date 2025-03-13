import { calculatedAVG, getABook } from '../functions/api.js';

import Books from '../models/Books.model.js';
import fs from 'node:fs';

/**
 * Récupère tous les Books depuis la DB
 */
export async function getAllBooks(req, res) {
    try {
        res.status(200).json(await Books.find());
    } catch (error) {
        res.status(404).json({ error });
    }
}

/**
 * Récupère un seul Book depuis la DB
 */
export async function getOneBook(req, res) {
    try {
        res.status(200).json(await getABook(req));
    } catch (error) {
        res.status(404).json({ error });
    }
}

/**
 * Récupère les 3 meilleurs Books de la DB
 */
export async function getBestRatedBooks(req, res) {
    try {
        res.status(200).json(
            await Books.find().sort({ averageRating: 'desc' }).limit(3)
        );
    } catch (error) {
        res.status(404).json({ error });
    }
}

/**
 * Récupère le formData, assigne l'image au nouvel objet
 * ainsi que l'ID de l'utilisateur depuis son token
 */
export async function createBook(req, res) {
    try {
        if (!req.body.book)
            throw new Error('Veillez à renseigner tous les champs', {
                cause: { status: 403 },
            });
        const parsedObject = JSON.parse(req.body.book);
        delete parsedObject._id;
        delete parsedObject.userId;
        parsedObject.ratings = [];
        parsedObject.averageRating = 0;

        /** @type {import('../models/Books.model.js').Book} */
        const book = new Books({
            ...parsedObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
            }`,
        });
        await book.save();

        res.status(201).json({
            message: 'Objet enregistré',
            ok: true,
            status: res.statusCode,
        });
    } catch (error) {
        res.status(error.cause ? error.cause.status : 404).json({
            message: error.message,
        });
    }
}

/**
 * Modifie un Book de la DB existant et remplace l'ancienne image
 * par la nouvelle si nécessaire
 * @param {Request} req
 */
export async function modifyBook(req, res) {
    const id = req.params.id;
    try {
        if (!req.body.userId && !req.body.book)
            throw new Error('unauthorized request', {
                cause: { status: 403 },
            });

        const modifiedObject = req.file
            ? {
                  ...JSON.parse(req.body.book),
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${
                      req.file.filename
                  }`,
              }
            : { ...req.body };

        delete modifiedObject.userId;

        const oldBook = await getABook(req);

        if (oldBook.userId !== req.auth.userId) {
            throw new Error('unauthorized request', {
                cause: { status: 403 },
            });
        }

        const filename = oldBook.imageUrl.split('/images')[1];
        if (req.file) {
            // New file => Delete previews file
            // => Update the document
            fs.unlink(`images/${filename}`, async () => {
                res.status(200).json(
                    await Books.updateOne(
                        { _id: id },
                        { ...modifiedObject, _id: id }
                    )
                );
            });
        } else {
            // File already exists / Did not change
            // => Update the document
            res.status(200).json(
                await Books.updateOne(
                    { _id: id },
                    { ...modifiedObject, _id: id }
                )
            );
        }
    } catch (error) {
        res.status(error.cause ? error.cause.status : 401).json({
            error: error.message,
        });
    }
}

/**
 * Supprime un Book de la DB ainsi
 * que le fichier image relatif
 */
export async function deleteBook(req, res) {
    try {
        const book = await getABook(req);
        if (book.userId !== req.auth.userId)
            throw new Error('unauthorized request', {
                cause: { status: 403 },
            });

        const filename = book.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`, async () => {
            const id = req.params.id;
            await Books.deleteOne({ _id: id });
            res.status(200).json({ message: 'Objet supprimé avec succès' });
        });
    } catch (error) {
        res.status(error.cause ? error.cause.status : 401).json({
            error: error.message,
        });
    }
}

/**
 * Ajoute une note d'un utilisateur et recalcule
 * la note moyenne -
 * @param {Request} req
 * @returns {Object}
 * @returns {Error}
 */
export async function rateOneBook(req, res, next) {
    try {
        /** @type {import('../models/Books.model.js').Book} */
        const book = await getABook(req);
        if (req.body.userId !== req.auth.userId)
            throw new Error('unauthorized request', {
                cause: { status: 403 },
            });
        if (req.body.rating <= 0 || req.body.rating > 5)
            throw new Error('La note doit être comprise entre 0 et 5', {
                cause: { status: 403 },
            });

        // // Saves rating
        // const foundRating = book.ratings.some(
        //     (rating) => rating.userId === req.auth.userId
        // );
        // if (foundRating)
        //     throw new Error(
        //         'Vous ne pouvez pas noter un livre plusieurs fois',
        //         { cause: { status: 403 } }
        //     );

        book.ratings.push({
            userId: req.auth.userId,
            grade: req.body.rating,
        });

        await book.save();

        // Calculate AVG
        const avg = await calculatedAVG(book._id);
        if (avg.length > 0) {
            book.averageRating = Math.round(avg[0].averageRating);
            await book.save();
            res.status(200).json(book);
        } else {
            throw new Error('Impossible de calculer la note moyenne', {
                cause: { status: 500 },
            });
        }
    } catch (error) {
        res.status(error.cause ? error.cause.status : 500).json({
            message: error.message,
        });
    }
}
