const HttpError = require('../errors/http-error')
const {validationResult} = require('express-validator')
const uuid = require('uuid/v4');
const Job = require('../models/job');
const User = require('../models/user');
const mongoose = require('mongoose');

const getJobById = async (req, res, next) => {
  const jobId = req.params.jobid;
  console.log(jobId);

  let job;
  try {
    job = await Job.findById(jobId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a job.', 500);
    return next(error);
  }

  if (!job) {
    const error = new HttpError('Could not find a job for the provided id.', 404);
    return next(error);
  }

  res.json({ job: job.toObject({ getters: true }) });
};


const getJobsByUserId = async (req, res, next) => {
   const userid = req.params.userid;
   let jobs;
    try{
        jobs = await Job.find({creatorId: userid}).exec();
    }catch (err){
        const error = new HttpError(
            'Fetching jobs failed, please try again later', 500
        );
        return next(error);
    }
      if (!jobs || jobs.length === 0) {
          return next(new HttpError("Could not find job for the provided id.", 404));
      }
  
 
    res.json({ jobs: jobs.map(job => job.toObject({ getters: true }))   });
  }

const createJob = async (req, res, next) => {
    //const errors = validationResult(req);
    //if(!errors.isEmpty()){
    //    throw new HttpError('Invalid inputs passed, please check your data.', 422);
    //} 
    const { status, title, type, company, description, dateadded, deadline, location, creatorId } = req.body;
  
    const createdJob = new Job({
        title,
        company,
        //status,
        //type,
        //description,
        //dateadded,
        //deadline,
        location,
        creatorId
    });

    let user;

    try {
        user = await User.findById(creatorId);
    } catch (err) {
        const error = new HttpError(
          '2Creating job failed, please try again.',
          500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    try {
      await createdJob.save({ session: sess });
      user.jobs.push(createdJob);
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      await sess.abortTransaction();
      sess.endSession();
      const error = new HttpError('Creating job failed, please try again', 500);
      return next(error);
    }
    
   
    res.status(201).json({ job: createdJob });
}

const updateJob = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { status, title, type, company, description, deadline, location } = req.body;
  const jobId = req.params.jobid;

  let job;
  try {
    job = await Job.findById(jobId).exec();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a job.', 500);
    return next(error);
  }

  if (!job) {
    const error = new HttpError('Could not find a job with the provided ID.', 404);
    return next(error);
  }

  if (job.creatorId.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this job.', 401);
    return next(error);
  }

  //job.status = status;
  job.title = title;
 // job.type = type;
  job.company = company;
  //job.description = description;
  //job.deadline = deadline;
  job.location = location;

  try {
    await job.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update job.', 500);
    return next(error);
  }

  res.status(200).json({ job: job.toObject({ getters: true }) });
};

const deleteJob = async (req, res, next) => {
    const jobId = req.params.jobid; // { pid: 'p1' }
  
    let job;

    try{
        job = await Job.findById(jobId).populate('creatorId');
    }
    catch (err){
        const error = new HttpError(
            'Something went wrong, could not delete job.', 500
        );
        return next(error);
    }

    if (!job) {
        const error = new HttpError('Could not find job for this id.', 404);
        return next(error);
    }

    if(job.creatorId.id !== req.userData.userId){
        const error = new HttpError('You are not allowed to delete this job.', 401);
        return next(error);
    }


   
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await job.deleteOne({ session: sess });
        job.creatorId.jobs.pull(job._id);
        await job.creatorId.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a job.',
        500
      );
      return next(error);
    }

    
    res.status(200).json({ message: 'Deleted place.' });
    };


exports.getJobById = getJobById;
exports.getJobsByUserId = getJobsByUserId;
exports.createJob = createJob;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;