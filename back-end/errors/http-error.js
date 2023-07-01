class HttpError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = HttpError;