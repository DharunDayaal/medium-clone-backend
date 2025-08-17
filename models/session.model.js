import mongoose from "mongoose"

const sessionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User is required"]
    },
    token: {
        type: String,
        required: [true, 'User token is required']
    },
    expiresAt: {
        type: Date,
        
    },
}, { timestamps: true })

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Session = mongoose.model('Session', sessionSchema)

export default Session