import express from "express";
import { adminAuth, protect } from './../../middlewares/authMiddleware.js';
import {

    create,
    getQuestions,
    getQuestion,
} from "../../controllers/appraisalQuestionController.js";

const router = express.Router();
router.use(protect);
// @desc    Create new appraisal question
// @route   POST /api/v1/appraisal-question
// @access  Private
router.post("/:id", adminAuth, create);
// @desc    Get all appraisal questions
// @route   GET /api/v1/appraisal-question
// @access  Private
router.get("/", getQuestions);
// @desc    Get single appraisal question
// @route   GET /api/v1/appraisal-question/:id
// @access  Private
router.get("/:id", getQuestion);


export default router;
