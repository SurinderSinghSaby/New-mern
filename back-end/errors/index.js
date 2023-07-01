const BadRequestError = require('./bad-request');
const NotFoundError = require('./not-found');
const UnAuthenticatedError = require('./unauthenticated');

module.exports = {
    BadRequestError,
    NotFoundError,
    UnAuthenticatedError
}