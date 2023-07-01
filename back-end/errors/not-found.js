
const CustomAPIError = require('./custom-api');

class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}

module.exports = NotFoundError;