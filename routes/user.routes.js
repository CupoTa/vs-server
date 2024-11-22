const Router = require("express");
const User = require("../models/User");
const StatsApp = require('../models/StatsApp');
const authMiddleware = require("../middleware/auth.middleware");
const config = require('config');
const router = new Router()

const BASE_REWARD_TAP = config.get("BASE_REWARD_TAP")
const BASE_REWARD_FARM = config.get("BASE_REWARD_FARM")
const HELLO_BONUS = config.get("HELLO_BONUS")
const PERIOD_COOLING = config.get("PERIOD_COOLING")
const TIME_TAP_GAME = config.get("TIME_TAP_GAME")
const POINTS_FRIEND = config.get("POINTS_FRIEND")

let clients = [];

router.post('/auth', authMiddleware, async (req, res) => {
    try {

        const { tgID, userName, referrerID } = req.body?.user

        const newUser = new User({ tgID, userName, referrerID })
        await newUser.save()

        let stats_points = 0

        if (referrerID != 0) {
            const referrer = await User.findOne({ tgID: referrerID })
            if (referrer) {
                let { friends, points } = referrer
                const candidateFriend = friends.find(friend => friend.tgID === tgID)
                if (!candidateFriend) {
                    friends.push({
                        tgID,
                        userName
                    })
                    points = points + POINTS_FRIEND
                    stats_points = POINTS_FRIEND
                }
                await User.updateOne({ tgID: referrerID }, { $set: { friends, points } }, { upsert: true })
            }
        }
        const stats = await StatsApp.findOne({STATS_APP_INDEX: 1})
        await StatsApp.findByIdAndUpdate(stats?._id, {TOTAL_USERS_APP: stats?.TOTAL_USERS_APP + 1, TOTAL_POINTS_FARMED: stats?.TOTAL_POINTS_FARMED + stats_points}, {new: false})
        return res.status(200).json({ user: newUser, "message": "OK" })
    } catch (e) {
        return res.status(500).json({ "message": "Server error, user alredy register" })
    }
})

router.post('/update', authMiddleware, async (req, res) => {

    try {
        const { user } = req.body
        const { type, tgID } = req.body?.user
        if (!type) {
            return res.status(505).json({ "message": "Error. Not Type" })
        }
        const currentUser = await User.findOne({ tgID })
        const stats = await StatsApp.findOne({STATS_APP_INDEX: 1})
        let stats_points = 0
        let updatePoints = 0
        let updateUser = {}
        if (type === "AUTOFARM") {
            // check points count farm
            let chitUser = false
            updatePoints = currentUser.points + user?.points

            let time = user?.lastTimeClaim - currentUser.lastTimeClaim
            time = Math.floor(time / 1000 / 60)

            let checkPoints = time * currentUser.coeff * BASE_REWARD_FARM

            if (checkPoints != user?.points) {
                updatePoints = currentUser.points + checkPoints
                chitUser = true
                stats_points = checkPoints
            }
            if (currentUser.lastTimeClaim == 0 && user?.points == HELLO_BONUS) {
                updatePoints = currentUser.points + user?.points
                stats_points = user?.points
            }
            await StatsApp.findByIdAndUpdate(stats?._id, {TOTAL_POINTS_FARMED: stats?.TOTAL_POINTS_FARMED + stats_points}, {new: false})
            updateUser = await User.findByIdAndUpdate(currentUser?._id, { points: updatePoints, lastTimeClaim: user?.lastTimeClaim, chit: chitUser }, { new: true })
        } else if (type === "TAPFARM") {
            // check points count tap
            // максимальное кол-во поинтов берем из расчета 1 тап / 5 мс 
            let chitUser = false
            updatePoints = currentUser.points + user?.points

            let time = user?.lastTimeTap - currentUser.lastTimeTap

            const maxTapCount = TIME_TAP_GAME / 5 // 1 tap in 5 ms
            let checkPoints = maxTapCount * currentUser.coeff * BASE_REWARD_TAP
            if (checkPoints < user?.points) {
                updatePoints = currentUser.points + checkPoints
                stats_points = checkPoints
            }
            if (time < PERIOD_COOLING) {
                updatePoints = currentUser.points
                chitUser = true
            }
            await StatsApp.findByIdAndUpdate(stats?._id, {TOTAL_POINTS_FARMED: stats?.TOTAL_POINTS_FARMED + stats_points}, {new: false})
            updateUser = await User.findByIdAndUpdate(currentUser?._id, { points: updatePoints, lastTimeTap: user?.lastTimeTap, chit: chitUser }, { new: true })
        } else if (type === "BOOSTER") {
            // check transaction hash, amount
            updateUser = await User.findByIdAndUpdate(currentUser?._id, { coeff: user?.coeff, coeffTime: user?.coeffTime }, { new: true })
        } else {
            return res.status(400).json({ "message": "Error. Type not exists" })
        }
        sendToTgClients(tgID, updateUser)

        return res.status(200).json({ user: updateUser, "message": "OK" })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ "message": "Server error" })
    }
})

router.get('/', async (req, res) => {
    let { tgID } = req.query

    try {

        const candidate = await User.findOne({ tgID })
        if (!candidate) {
            return res.status(404).json({ message: "User not found" })
        }
        let friends = []
        candidate?.friends?.map((friend, i) => {
            friends.push({
                name: friend.userName,
                tgId: friend.tgID
            })
        })
        return res.status(200).json({ user: candidate, "message": "VSE OK" })
    } catch (e) {
        return res.status(500).json({ "message": "Server error" })
    }
})

router.get('/events', (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    res.write('event: connect\n')
    const sendData = `data: ${JSON.stringify({ message: "Connect" })} \n\n`;
    res.write(sendData);

    const clientId = generateUniqueId()

    const newClient = {
        id: clientId,
        tgID: req.query?.tgID,
        res,
    };

    clients.push(newClient);

    console.log(`${clientId} - Connection opened`);

    req.on('close', () => {
        console.log(`${clientId} - Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

function generateUniqueId() {
    return Date.now() + '-' + Math.floor(Math.random() * 1000000000);
}

router.get('/clients', (req, res) => {
    return res.status(200).json(clients.map((client) => client.id))
})

function sendToTgClients(tgID, user) {
    const filteredClients = clients.filter(client => client.tgID == tgID)
    filteredClients.map((client, i) => {
        console.log(client.id + " - " + client.tgID)
        client.res.write(`event: Update\n`)
        client.res.write(`data: ${JSON.stringify(user)}\n\n`);
    })
}



module.exports = router