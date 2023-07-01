const express = require("express");

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({ message: 'It works!' });
});

module.exports = router;