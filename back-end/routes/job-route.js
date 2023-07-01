const express = require("express");
const {check} = require('express-validator')

const router = express.Router();

const JobController = require("../controllers/job-controller");
const checkAuth = require("../middleware/check-auth");

router.get("/user/:userid", JobController.getJobsByUserId); 

router.get("/:jobid", JobController.getJobById);

router.use(checkAuth);

router.post("/",
    check('title')
        .not()
        .isEmpty(),
    check('company').isLength({min: 1}),
    check('status')
    .not()
    .isEmpty(), 
    JobController.createJob);

router.patch("/:jobid",[
    check('title')
        .not()
        .isEmpty(),
    check('company').isLength({min: 1})
], JobController.updateJob);

router.delete("/:jobid", JobController.deleteJob);


module.exports = router;
