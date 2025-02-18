import 'dotenv/config.js';
import mongoose from 'mongoose';

/**
 * Permet de se connecter à la MongoDB Atlas
 */
export async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await mongoose.connect(process.env.URI, {
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
