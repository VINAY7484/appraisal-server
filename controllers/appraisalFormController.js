import AppraisalForm from "../models/appraisalFormModel.js";
import User from "../models/UsersModel.js";
export const create = async (req, res) => {

    const userId = req.params.id;
    const filledBy = req.user.id // Assuming you have userId in req.user from auth middleware
    try {
        // Check if form already exists
        const existingForm = await AppraisalForm.findOne({ userId, filledBy });
        if (existingForm) {

            return res.status(400).json({ message: "You  already filled the  form" });
        }
        const newForm = await AppraisalForm.create({
            form: req.body,
            userId,
            filledBy
        });
        if (!newForm) {
            return res.status(400).json({ message: "Error creating form" });
        }
        // Save the form to the database

        // const updatedStatus = await User.findByIdAndUpdate(req.params.id, {
        //     $set: { isAppraisalForm: true, },
        // }, { new: true });

        return res.status(201).json({
            success: true,
            message: "Appraisal form created successfully",
            data: newForm,
        });
    } catch (err) {
        return res.status(500).json({ message: "Error creating form", err });
    }
}


export const getForms = async (req, res) => {
    try {

        let query = {};
        const { userType } = req.user;

        if (userType === "Employee") { query = { filledBy: req.user.id } }
        if (userType === "Manager") {
            const user = await AppraisalForm.find({ filledBy: req.user.id }).select("userId");
            query = { $or: [{ filledBy: req.user.id }, { userId: user.map((u) => u.userId) }] }
        }
        if (userType === "Admin") { query = {} }

        const forms = await AppraisalForm.find(query).populate("userId", "fullname email").populate("filledBy", "fullname email");
        return res.status(200).json({
            success: true,
            message: "Appraisal forms fetched successfully",
            data: forms,
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching forms", err });
    }
}

export const getForm = async (req, res) => {
    try {
        const form = await AppraisalForm.findById(req.params.id).populate("userId", "fullname email").populate("filledBy", "fullname email");
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Appraisal form fetched successfully",
            data: form,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching form", err });
    }
}