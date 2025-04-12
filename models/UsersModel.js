import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    fullname: { type: String, required: true, },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userType: {
        type: String,
        enum: ['Admin', 'Manager', 'Employee'], // Specify the enum options
        required: true,
        default: 'Employee' // Default value if not provided
    },
    isAppraisalQuestion: { type: Boolean, default: false },
    isAppraisal: { type: Boolean, default: false },
},
    {
        timestamps: true,  // This will automatically add createdAt and updatedAt fields
    }
);

const User = model('User', UserSchema);

export default User;
