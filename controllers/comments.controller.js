import Comment from "../models/comments.model.js";
import Like from "../models/like.model.js";
import Post from "../models/post.model.js";

export const createComment = async (req, res, next) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            const error = new Error("Post ID is required");
            error.statusCode = 400;
            throw error;
        }

        await Comment.create({
            ...req.body,
            post: postId,
            aurthor: req.user.id
        });
        
        // Update the post comments count
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } })

        res.status(201).json({
            success: true,
            message: "success"
        });
    } catch (error) {
        next(error);
    }
};

export const createReplyComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            const error = new Error("Reply content is required");
            error.statusCode = 400;
            throw error;
        }

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            const error = new Error("Parent comment not found");
            error.statusCode = 404;
            throw error;
        }

        const reply = await Comment.create({
            post: parentComment.post,
            aurthor: req.user.id,
            content,
            parentCommentId: commentId
        });

        // Update the post comments count
        await Post.findByIdAndUpdate(reply.post, { $inc: { commentsCount: 1 } })

        res.status(201).json({
            success: true,
            message: "success"
        });
    } catch (error) {
        next(error);
    }
};

export const getAllComments = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate("aurthor", "name profileImage").lean();

        // Map comments by their ID
        const commentMap = {};
        comments.forEach(c => {
            commentMap[c._id.toString()] = { ...c, replies: [] };
        });

        const topLevel = [];
        comments.forEach(c => {
            if (c.parentCommentId) {
                const parentId = c.parentCommentId.toString();
                if (commentMap[parentId]) {
                    commentMap[parentId].replies.push(commentMap[c._id.toString()]);
                }
            } else {
                topLevel.push(commentMap[c._id.toString()]);
            }
        });

        res.status(200).json({
            success: true,
            message: "success",
            data: topLevel
        });
    } catch (error) {
        next(error);
    }
};

export const updateCommentAndReplyComment = async (req, res, next) => {
    try {
        const { commentId } = req.params

        if (!commentId) {
            const error = new Error("Comment ID is required");
            error.statusCode = 400
            throw error;
        }

        const updatedComment = await Comment.findByIdAndUpdate({ _id: commentId }, { content: req.body.content })

        if (!updatedComment) {
            const error = new Error("Comment not found");
            error.statusCode = 404
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "success",
            data: updatedComment
        })
    } catch (error) {
        next(error)
    }
}

export const likeAndUnlike = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        if (!commentId) {
            const error = new Error("Comment ID is required");
            error.statusCode = 400
            throw error;
        }

        const comment = await Comment.findById(commentId)

        if (!comment) {
            const error = new Error("Comment not found");
            error.statusCode = 404
            throw error;
        }

        const existingLike = await Like.findOne({ user: req.user.id, comment: commentId })
        if (existingLike) {
            await Like.deleteOne({ user: req.user.id, comment: commentId })
            comment.likesCount = Math.max(0, comment.likesCount - 1)
            await comment.save()

            return res.status(200).json({
                success: true,
                message: "Comment successfully unliked"
            })
        }

        await Like.create({ user: req.user.id, comment: commentId })

        comment.likesCount += 1
        await comment.save()

        res.status(200).json({
            success: true,
            message: "Comment successfully liked"
        })

    } catch (error) {
        next(error)
    }
}

async function deleteCommentWithReplies(commentId) {
    const replies = await Comment.find({ parentCommentId: commentId });

    for (const reply of replies) {
        await deleteCommentWithReplies(reply._id); // recursive deletion for nested replies
    }

    await Comment.deleteOne({ _id: commentId });
}

export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        if (!commentId) {
            const error = new Error("Comment ID is required");
            error.statusCode = 400;
            throw error;
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            const error = new Error("Comment not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if user is authorized to delete the comment
        if (comment.author !== req.user.id) {
            const error = new Error("You are not allowed to delete this comment");
            error.statusCode = 403;
            throw error;
        }

        // Count total comments before deletion (parent + all replies)
        const countBeforeDelete = await countCommentAndReplies(commentId);

        // Cascade delete parent + replies
        await deleteCommentWithReplies(commentId);

        // Decrease commentsCount in Post
        await Post.findByIdAndUpdate(comment.post, {
            $inc: { commentsCount: -countBeforeDelete }
        });

        res.status(200).json({
            success: true,
            message: "Comment and its replies deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

// Helper function to count parent + all nested replies
async function countCommentAndReplies(commentId) {
    let count = 1; // current comment
    const replies = await Comment.find({ parentCommentId: commentId });
    for (const reply of replies) {
        count += await countCommentAndReplies(reply._id);
    }
    return count;
}