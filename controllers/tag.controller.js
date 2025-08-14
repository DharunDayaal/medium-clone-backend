import Tag from "../models/tag.model.js";

export const createTag = async (req, res, next) => {
    try {
        const tags = await Tag.create({
            ...req.body
        })

        res.status(201).json({
            success: true,
            message: "Tag created successfully",
        })
    } catch (error) {
        next(error)
    }
}

export const getAllTags = async (req, res, next) => {
    try {
        const tags = await Tag.find({})

        res.status(200).json({
            success: true,
            message: "Tags retrived successfully",
            data: tags
        })
    } catch (error) {
        next(error)
    }
}