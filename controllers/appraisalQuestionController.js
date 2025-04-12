import AppraisalQuestion from "../models/AppraisalQuestion.js";
import User from "../models/UsersModel.js";


export const create = async (req, res) => {
    const { question, answer } = req.body;
    const userId = req.params.id; // Assuming you have userId in req.user from auth middleware
    try {
        // Check if question already exists
        const existingQuestion = await AppraisalQuestion.findOne({ userId });
        if (existingQuestion) {
            return res.status(400).json({ message: "Question already exists" });
        }
        const newQuestion = await AppraisalQuestion.create({
            questions: req.body,
            userId,
        });
        if (!newQuestion) {
            return res.status(400).json({ message: "Error creating question" });
        }
        // Save the question to the database

        const updatedStatus = await User.findByIdAndUpdate(req.params.id, {
            $set: { isAppraisalQuestion: true, },
        }, { new: true });

        return res.status(201).json({
            success: true,
            message: "Appraisal question created successfully",
            data: newQuestion,
        });
    } catch (err) {
        return res.status(500).json({ message: "Error creating question", err });
    }
}

export const getQuestions = async (req, res) => {
    try {
        const questions = await AppraisalQuestion.find();
        return res.status(200).json({
            success: true,
            message: "Appraisal questions fetched successfully",
            data: questions,
        });
    } catch (err) {
        return res.status(400).json({ message: "Error fetching questions", err });
    }
}

export const getQuestion = async (req, res) => {
    const userId = req.params.id;
    try {
        const question = await AppraisalQuestion.find({ userId });
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Appraisal question fetched successfully",
            data: question,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching question", err });
    }
}