import mongoose from "mongoose";
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