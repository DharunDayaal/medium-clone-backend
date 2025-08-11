import mongoose from "mongoose";

const tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tag name is required"],
        unique: true,
        trime: true,
        minLength: 4,
        maxLength: 10
    },
    description: {
        type: String,
        default: "",
    },
    postsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Tag = mongoose.model('Tag', tagSchema)

export default Tag