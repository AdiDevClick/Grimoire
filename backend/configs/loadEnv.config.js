import { configDotenv } from 'dotenv';

/**
 * Charger les variables d'environnement en fonction de la valeur d'ENV_CONFIG
 * "dev" comme valeur par défaut
 */
const loadEnv = () => {
    const ENV_CONFIG = process.env.NODE_ENV || 'dev';

    if (ENV_CONFIG === 'dev') {
        console.log('DEV MODE');
        configDotenv({ path: '.env.dev' });
    } else {
        configDotenv({ path: '.env' });
    }
};

export default loadEnv;
