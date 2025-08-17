import cors from "cors"

const allowedOrigins = '*';

const corsOptions = {
    origin: function (origin, callback) {
        if(!origin) {
            return callback(null, true)
        }
        if(allowedOrigins.includes(origin)) {
            callback(null, true)
        }
        else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ["Content-Type", "Authorization"]
}

export default cors(corsOptions)