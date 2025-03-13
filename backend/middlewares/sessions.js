import { decrypt, encrypt } from '../functions/security.js';

export const sessionViews = (req, res, next) => {
    if (req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1;
    }
    next();
};

export const validateSession = (req, res, next) => {
    if (req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1;
    }
    next();
};

/**
 * Active l'envoi de cookie HTTP via le Headers
 */
export function allowCookies(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.SERVER_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
}

/**
 * Signe un cookie et l'insère dans la sessions
 * @param {Request} req
 * @param {string} cookieName
 * @param {any} newData
 */
export function signCookie(req, cookieName, newData) {
    let datas;
    // if (req.session[cookieName]) {
    //     datas = decrypt(req.session[cookieName]);
    // console.log('decrypt =>  ', decrypt(req.session[cookieName]))
    // }
    // } else {
    datas = newData;
    // }

    // datas = [...datas, newData]

    const encryptedData = encrypt(datas.toString());
    req.session[cookieName] = encryptedData;
}

/**
 * Récupère un cookie signé
 * @param {Request} req
 * @param {string} cookieName
 * @returns
 */
export function decryptCookie(req, cookieName) {
    if (req.session[cookieName]) {
        return decrypt(req.session[cookieName]);
    } else {
        throw new Error('unothaurized request', { cause: { status: 401 } });
    }
}
