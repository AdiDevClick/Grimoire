import toobusy from 'toobusy-js';
import { debounce } from '../functions/promises.js';

// Set maximum lag to an aggressive value.
toobusy.maxLag(50);

// Set check interval to a faster value. This will catch more latency spikes
// but may cause the check to be too sensitive.
toobusy.interval(250);

let onCheckLags = [];
let lags = false;

const onCheck = (cb) => {
    onCheckLags.push(cb);
};

toobusy.onLag(function (currentLag) {
    console.log('Event loop lag detected! Latency: ' + currentLag + 'ms');
    lags = toobusy();
    onCheckLags.forEach((cb) => cb(lags));
});

/**
 * Vérifie que le serveur n'est pas saturé par
 * un DDOS ou une utilisation trop intensive.
 * Si tooBusy => Une Erreur 503 sera retournée
 */
export const tooBusyHandler = (req, res, next) => {
    let sentResponse = false;

    onCheck((lags) => {
        if (lags && !sentResponse) {
            // Set the Origin to match the server
            res.setHeader(
                'Access-Control-Allow-Origin',
                process.env.SERVER_URL
            );
            // Allow GET only
            res.setHeader('Access-Control-Allow-Methods', 'GET');
            sentResponse = true;
            return res.status(503).json({
                message: "I'm busy right now, sorry.",
            });
        } else if (!lags && !sentResponse) {
            sentResponse = true;
            return next();
        }
    });

    const noLag = debounce(() => {
        if (!lags) {
            return next();
        }
    }, 1);

    noLag();
};

// Middleware to simulate heavy processing (optional)
export const simulateHeavyProcessing = (req, res, next) => {
    var i = 0;
    while (i < 1e5 * 100000) {
        i++;
    }
    console.log('I counted to ' + i);
    next();
};
