import mongoose from "mongoose";

const { Schema, model } = mongoose;

const formSchema = new Schema({
    question: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false },
}, {
    timestamps: true,  // This will automatically add createdAt and updatedAt fields
});

const appraisalFormSchema = new Schema({
    form: [formSchema],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filledBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,  // This will automatically add createdAt and updatedAt fields
});
const AppraisalForm = model('appraisalForm', appraisalFormSchema);
export default AppraisalForm;