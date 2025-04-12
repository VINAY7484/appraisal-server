import mongoose from "mongoose";

const { Schema, model } = mongoose;
const questionSchema = new Schema({
    question: { type: String, required: true }
});
const appraisalQuestionSchema = new Schema({
    questions: [questionSchema],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,  // This will automatically add createdAt and updatedAt fields
});
const AppraisalQuestion = model('appraisalQuestion', appraisalQuestionSchema);
export default AppraisalQuestion;
