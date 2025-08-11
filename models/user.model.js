import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        trim: true,
        unique: true,
        minLength: 6,
        maxLength: 60,
        match: [/\S+\@\S+\.\S+/, 'Please fill a valid email address'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        trim: true,
        minLength: 8
    },

    bio: {
        type: String,
        default: ""
    },
    profileImage: {
        type: String,
        default: "",
        socialLinks: {
            website: String,
            twitter: String,
            github: String,
            linkedin: String,
        }
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;