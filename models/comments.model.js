import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post is required"]
    },
    aurthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User is required"]
    },
    content: {
        type: String,
        required: [true, "Comment content is required"],
        trim: true
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema)

export default Comment