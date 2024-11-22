const { Schema, model } = require("mongoose")

const User = new Schema({
    tgID: {type: Number, required: true, unique: true},
    referrerID:  {type: Number},
    userName: {type: String, default: "guest"},
    lastTimeClaim: {type: Number, default: 0},
    lastTimeTap: {type: Number, default: 0},
    points:  {type: Number, default: 0},
    coeff:  {type: Number, default: 1},
    coeffTime:  {type: Number, default: 0},
    coeffMatrix: {type: Number, default: 1},
    friends: {type: Array({})},
    wallet: {type: String},
    chit: {type: Boolean, default: false}
})

module.exports = model("User", User)