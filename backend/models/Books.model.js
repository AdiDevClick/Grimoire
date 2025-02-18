import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true, allowNull: false },
    title: { type: String, required: true, allowNull: false },
    author: { type: String, required: true, allowNull: false },
    imageUrl: { type: String, required: true, allowNull: false },
    year: { type: String, required: true, allowNull: false },
    genre: { type: String, required: false, allowNull: true },
    ratings: [
        {
            userId: { type: String },
            grade: { type: Number },
        },
    ],
    averageRating: { type: Number },
});

export default mongoose.model('Book', bookSchema);
