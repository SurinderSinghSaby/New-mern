const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: {type: String, required: true},
    company: {type: String, required: true},
    //status: {type: String, required: true},
    //type: {type: String, required: true},
    //description: {type: String, required: true},
    //dateadded: {type: Date, required: true},
    //deadline: {type: Date, required: true},
    location: {type: String, required: true},
    creatorId: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('Job', jobSchema);
