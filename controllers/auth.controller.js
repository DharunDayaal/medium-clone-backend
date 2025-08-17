import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"
import Session from "../models/session.model.js"
import User from "../models/user.model.js"
import parseJwtExpiry from "../utils/parseJwtExpiry.js"

export const signUp = async (req, res, next) => {

    const session = await mongoose.startSession()

    session.startTransaction()
    try {
        const { email, name, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409
            throw error
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUsers = await User.create([
            {
                name,
                email,
                password: hashedPassword
            }
        ], { session })

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: "1d" })

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({
            success: true,
            message: "success",
            data: {
                token: token,
                user: newUsers[0]
            }
        })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
};

export const signIn = async (req, res, next) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User does not exists");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" })

        const expiresAt = new Date(Date.now() + parseJwtExpiry(JWT_EXPIRES_IN))

        await Session.create({ user: user._id, token, expiresAt })

        res.status(200).json({
            success: true,
            message: "success",
            data: {
                user,
                token
            }
        });
    } catch (error) {
        next(error)
    }
};

export const signOut = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            const error = new Error("No token provided");
            error.statusCode = 401
            throw error
        }

        const token = authHeader.split(" ")[1];

        const result = await Session.deleteOne({ token })

        if (result.deletedCount === 0) {
            const error = new Error("Session not found or already logged out");
            error.statusCode = 400
            throw error
        }

        res.status(200).json({
            success: true,
            message: "User signed out successfully"
        })

    } catch (error) {
        next(error)
    }
};