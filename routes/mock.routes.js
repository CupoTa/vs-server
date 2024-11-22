const Router = require("express");
const router = new Router()
require('dotenv').config();

router.get('/quests', async(req, res) => {

    const { tgID } = req.query

    try{
        let quests = [
            {
                id: 0,
                type: 'SUBSCRIBE_TWITTER',
                complete: false,
                reward: 1000,
                link: 'https://x.com/home'
            },
            {
                id: 1,
                type: 'SUBSCRIBE_TG_CHANNEL',
                complete: false,
                reward: 1000,
                link: 'https://t.me/prikoplushki'
            },
            {
                id: 2,
                type: 'JOIN_TG_CHAT',
                complete: false,
                reward: 1000,
                link: 'https://t.me/notpixel_42'
            },
            {
                id: 3,
                type: 'SUBSCRIBE_YOUTUBE',
                complete: false,
                reward: 1000,
                link: 'https://www.youtube.com/'
            },
            {
                id: 4,
                type: 'FARM',
                complete: false,
                reward: 1000,
                link: ''
            },
            {
                id: 5,
                type: 'INVITE',
                complete: false,
                reward: 1000,
                link: ''
            },
        ]

        quests = [
            {
                "id": 0,
                "type": 0,
                "title": "Subscribe Youtube",
                "desc": "Description",
                "reward": 100,
                "complete": false,
                "progress": "",
                "link": "https://www.youtube.com/"
            },
            {
                "id": 1,
                "type": 4,
                "title": "Connect TON wallet",
                "desc": "Description",
                "reward": 500,
                "status": "",
                "progress": "",
                "complete": false,
                "link": `/profile`
            },
            {
                "id": 2,
                "type": 1,
                "title": "Subscribe Twitter",
                "desc": "Description",
                "reward": 100,
                "status": "",
                "progress": "",
                "complete": false,
                "link": "https://x.com/home"
            },
            {
                "id": 3,
                "type": 3,
                "title": "Subscribe Telegram Channel",
                "desc": "Join our Telegram channel for updates.",
                "reward": 100,
                "complete": false,
                "progress": "",
                "link": "https://t.me/your_channel"
            },
            {
                "id": 4,
                "type": 2,
                "title": "Join Telegram Chat",
                "desc": "Participate in our Telegram chat.",
                "reward": 100,
                "complete": false,
                "progress": "",
                "link": "https://t.me/your_chat"
            },
            {
                "id": 5,
                "type": 5,
                "title": "Invite 3 Friends",
                "desc": "Invite three friends to join.",
                "reward": 150,
                "complete": false,
                "progress": "2",
                "link": ""
            },
            {
                "id": 6,
                "type": 5,
                "title": "Invite 5 Friends",
                "desc": "Invite five friends to join.",
                "reward": 2000,
                "complete": false,
                "progress": "2",
                "link": ""
            }
        ]
        



        setTimeout(() => {
            return res.status(200).json({quests, "message": "OK"})
        }, 2000)
    } catch( e ){
        console.log('Error', e)
        return res.status(500).json({ "message": "Server error, not stats" })
    }

})

module.exports = router

