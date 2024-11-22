require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const { connectBot } = require("./bot/connect");
const corsMiddleware = require('./middleware/cors.middleware')
const userRouter = require('./routes/user.routes')
const statsRouter = require('./routes/stats.routes')
const mockRouter = require('./routes/mock.routes')


const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

app.use(corsMiddleware)
app.use(bodyParser.json());
app.use(express.json());
app.use('/v1/api', userRouter)
app.use('/v1/api/stats', statsRouter)
app.use('/v1/api/mock', mockRouter)

async function bootstrap() {

    await connectBot();
    try {

        mongoose.connect(mongoURI)

        app.listen(port, () => {
            console.log(`Сервер запущен на порту ${port}`);

        });
    } catch (e) {
        console.log("ERROR START EXPRESS", e);
    }

}

bootstrap();