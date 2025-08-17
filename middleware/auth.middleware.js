import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import Session from '../models/session.model.js'
import User from '../models/user.model.js'

const authorize = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized'
            })
        }

        const session = await Session.findOne({ token })
        if (!session) {
            return res.status(401).json({ 
                success: false,
                message: "Session expired or invalid"
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await User.findById(decoded.userId)

        if (!user) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })

        req.user = user
        req.token = token

        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: error.message
        })
    }
}

export default authorize