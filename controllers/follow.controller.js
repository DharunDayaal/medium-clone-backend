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

        await User.findByIdAndUpdate(req.params.id, { $inc: { followersCount: -1 } })
        await User.findByIdAndUpdate(req.user.id, { $inc: { followingCount: -1 } })

        res.status(200).json({
            success: true,
            message: "Unfollowed successfully",
        })
    } catch (error) {
        next(error)
    }
}

export const checkFollowing = async (req, res) => {
  try {
    const followerId = req.user.id;   // from authorize middleware
    const followingId = req.params.id; // from route param

    if (!followerId || !followingId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user IDs",
      });
    }

    const isFollowing = await Follow.exists({
      follower: followerId,
      following: followingId,
    });

    return res.status(200).json({
      success: true,
      isFollowing: !!isFollowing,
    });
  } catch (error) {
    console.error("Error in checkFollowing:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
