const { Schema, model } = require("mongoose")

const StatsApp = new Schema({
    STATS_APP_INDEX: {type: Number, default: 1},
    TOTAL_USERS_APP: {type: Number, default: 0},
    TOTAL_POINTS_FARMED: {type: Number, default: 0},
})

module.exports = model("StatsApp", StatsApp)