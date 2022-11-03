const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    name: {type: String, required: true},
    activities: {type: Array, required: false},
    privacy: {type: Boolean, required: true},
    icon: {type: String, required: false},
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Board'
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Board'
    }],
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Board'
    }],
    invitees: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Board'
    }],

})

module.exports = mongoose.model('Group', groupSchema)