import Follow from "../models/follow.models.js";
import User from "../models/user.model.js";

export const createFollow = async (req, res, next) => {
    try {
        if (req.user.id === req.params.id) {
            const error = new Error("You cannot follow yourself");
            error.statusCode = 400;
            throw error
        }

        const existingFollow = await Follow.findOne({
            follower: req.user.id,
            following: req.params.id
        })

        if (existingFollow) {
            const error = new Error("Already following this user");
            error.statusCode = 400;
            throw error
        }

        await Follow.create({
            follower: req.user.id,
            following: req.params.id
        })

        await User.findByIdAndUpdate(req.params.id, { $inc: { followersCount: 1 } })
        await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: 1 } })

        res.status(200).json({
            success: true,
            message: "Followed successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const unfollowTheUser = async (req, res, next) => {
    try {
        const follow = await Follow.findOneAndDelete({
            follower: req.user.id,
            following: req.params.id
        })

        if (!follow) {
            const error = new Error("Relationship not found");
            error.statusCode = 404;
            throw error;
        }

        await User.findByIdAndUpdate(req.params.id, { $dec: { followersCount: -1 } })
        await User.findByIdAndUpdate(req.user.id, { $dec: { followingCount: -1 } })

        res.status(200).json({
            success: true,
            message: "You have unfollowed successfully",
        })
    } catch (error) {
        next(error)
    }
}

export const getFollowing = async (req, res, next) => {
    try {
        const followers = await Follow.find({ following: req.params.id }).populate("follower", "name email profileImage")

        res.status(200).json({
            success: true,
            message: "Following users rectified",
            data: followers
        })
    } catch (error) {
        next(error)
    }
}

export const getFollowers = async (req, res, next) => {
    try {
        const followers = await Follow.find({ follower: req.params.id }).populate("following", "name email profileImage")

        res.status(200).json({
            success: true,
            message: "Following users rectified",
            data: followers
        })
    } catch (error) {
        next(error)
    }
}

export const rgwr = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}