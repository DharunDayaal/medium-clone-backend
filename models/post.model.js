import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    aurthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Aurthor name is required']
    },
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
        minLength: 5,
        maxLength: 60
    },
    slug: {
        type: String,
        required: [true, 'Post slug is required'],
        unique: true
    },
    oldSlugs: [{ type: String }],
    content: {
        type: String,
        default: "",
        required: [true, 'Post content is required'],
        trim: true
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    likesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: String,
        default: 0
    },
    readTime: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    publishedAt: {
        type: Date
    }
}, { timestamps: true });

// Create the slug in the backend when the client passes the title and add it to the db
const createSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters
        .replace(/\s+/g, "-")         // replace spaces with hypens
        .replace(/-+/g, "-");         // remove multiple hypens
}

const wordCount = (s) => (s.match(/\b\w+\b/g) || []).length;

// Auto-generate the slug/update + calculate read time
postSchema.pre("save", async function (next) {

    if (!this.content) {
        return next()
    }

    if (!this.readTime) {
        const totalWords = wordCount(this.content)
        const wordsPerMinute = 250
        const readingTime = Math.max(1, Math.ceil(totalWords / wordsPerMinute)) // Calculate the readTime

        this.readTime = readingTime;
    }

    if (!this.title) {
        return next()
    }

    let baseSlug = createSlug(this.title)
    let uniqueSlug = baseSlug
    let counter = 1;

    // Ensure slug is unique
    while (await mongoose.models.Post.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
    }

    if (this.slug && this.slug !== uniqueSlug) {
        this.oldSlugs.push(this.slug)
    }

    this.slug = uniqueSlug;
    next();
})




const Post = mongoose.model('Post', postSchema)

export default Post