const Router = require("express");
const StatsApp = require('../models/StatsApp');
const router = new Router()
const config = require('config');
const POINTS_FRIEND = config.get("POINTS_FRIEND")

router.get('/', async(req, res) => {

    try{
        const stats = await StatsApp.findOne({STATS_APP_INDEX: 1})
        if(!stats){
            const first = new StatsApp({
                STATS_APP_INDEX: 1,
                TOTAL_USERS_APP: 0,
                TOTAL_POINTS_FARMED: 0
            })
            await first.save({})
            console.log("BD created")
        }
        return res.status(200).json({stats, "message": "OK"})

    } catch( e ){
        console.log('Error', e)
        return res.status(500).json({ "message": "Server error, not stats" })
    }

})

module.exports = router

