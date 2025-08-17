import User from "../models/user.model.js";
import Follow from "../models/follow.models.js"

export const getUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId).select("-password");
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error
        }

        res.status(200).json({
            success: true,
            message: "User profile retrived successfully",
            data: user
        })

    } catch (error) {
        next(error)
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const allowedUpdates = ["name", "bio", "profileImage", "socialLinks", "phoneNumber"]
        const updates = {}

        allowedUpdates.forEach((item) => {
            if (req.body[item] !== undefined) {
                updates[item] = req.body[item]
            }
        })

        const user = await User.findByIdAndUpdate(userId,
            { $set: updates },
            { new: true, runValidators: true, select: "-password" },
        )

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        })

    } catch (error) {
        next(error)
    }
}

export const getFollowingUsers = async (req, res, next) => {
    try {
        const followers = await Follow.find({ following: req.params.userId }).populate("follower", "_id name profileImage")

        res.status(200).json({
            success: true,
            message: "Following users rectified successfully",
            data: followers
        })
    } catch (error) {
        next(error)
    }
}

export const getUserFollowers = async (req, res, next) => {
    try {
        const followers = await Follow.find({ follower: req.params.userId }).populate("following", "_id name  profileImage")

        res.status(200).json({
            success: true,
            message: "Followers rectified successfully",
            data: followers
        })
    } catch (error) {
        next(error)
    }
}
