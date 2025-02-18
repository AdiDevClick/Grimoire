import Books from '../models/Books.model.js';
import fs from 'node:fs';

/**
 * Récupère tous les Books depuis la DB
 */
export async function getAllBooks(req, res, next) {
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
    const id = req.params.id;
    try {
        res.status(200).json(await Books.findOne({ _id: id }));
    } catch (error) {
        res.status(404).json({ error });
    }
}
export async function getBestRatedBooks(req, res) {}

/**
 * Récupère le formData, assigne l'image au nouvel objet
 * ainsi que l'ID de l'utilisateur depuis son token
 */
export async function createBook(req, res) {
    const parsedObject = JSON.parse(req.body.book);
    delete parsedObject._id;
    delete parsedObject.userId;

    const book = new Books({
        ...parsedObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    });

    try {
        await book.save();
        res.status(201).json({
            message: 'Objet enregistré',
            ok: true,
            status: res.statusCode,
        });
    } catch (error) {
        res.status(404).json({ error });
    }
}

/**
 * Modifie un Book de la DB existant et remplace l'ancienne image
 * par la nouvelle si nécessaire
 */
export async function modifyBook(req, res) {
    const id = req.params.id;
    const modifiedObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };
    delete modifiedObject.userId;
    try {
        const oldBook = await Books.findOne({ _id: id });
        if (oldBook.userId !== req.auth.userId)
            return res.status(401).json({ error: 'You are not authorized' });

        const filename = oldBook.imageUrl.split('/images')[1];
        req.file
            ? fs.unlink(`images/${filename}`, async () => {
                  res.status(200).json(
                      await Books.updateOne(
                          { _id: id },
                          { ...modifiedObject, _id: id }
                      )
                  );
              })
            : res
                  .status(200)
                  .json(
                      await Books.updateOne(
                          { _id: id },
                          { ...modifiedObject, _id: id }
                      )
                  );
    } catch (error) {
        res.status(401).json({ error });
    }
}

/**
 * Supprime un Book de la DB ainsi
 * que le fichier image relatif
 */
export async function deleteBook(req, res) {
    const id = req.params.id;
    try {
        const book = await Books.findOne({ _id: id });
        if (book.userId !== req.auth.userId)
            return res.status(401).json({ error: 'You are not authorized' });
        const filename = oldBook.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`, async () => {
            await Things.deleteOne({ _id: id });
            res.status(200).json({ message: 'Objet supprimé avec succès' });
        });
    } catch (error) {
        res.status(401).json({ error });
    }
}
export async function rateOneBook(req, res) {}
