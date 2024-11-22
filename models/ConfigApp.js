const { Schema, model } = require("mongoose")

const ConfigApp = new Schema({
    BASE_REWARD_FARM: {type: Number, default: 5},
    BASE_REWARD_TAP: {type: Number, default: 1},
    PERIOD_COOLING: {type: Number, default: 8*60*60},
    PERIOD_BOOSTER: {type: Number, default: 24*60*60},
    HELLO_BONUS: {type: Number, default: 5*8},
    BASE_DONATE: {type: BigInt, default: 2*10**8}
})

module.exports = model("ConfigApp", ConfigApp)