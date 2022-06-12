const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    xid : String,
    queueId : String,
    description: String,
    sender: String,
    status: {
        type: String,
        default: "unanswered",
        required: true
    }
})

module.exports = mongoose.model('ticket', ticketSchema)