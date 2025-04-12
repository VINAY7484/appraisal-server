import User from "./../models/UsersModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

// Handle POST requests at "api/users/signup"
export const createUser = async (req, res) => {
    const { fullname, password, email, verifyPassword } = req.body;

    try {

        // Check if email is taken
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "This email is taken" });

        // Verify password match
        if (password !== verifyPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullname,
            password: hashedPassword,
            email,
            userType: "Employee",
        });

        const savedUser = await newUser.save();


        return res.json({
            // token,
            message: "Registered successfully",
            user: {
                id: savedUser.id,
                fullname: savedUser.fullname,
                email: savedUser.email,
                userType: savedUser.userType,
            },
        });
    } catch (err) {
        return res.status(400).json({ message: "Error registering", err });
    }
};

// Handle POST request at "api/users/login"
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(400).json({ message: "Invalid email" });

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        if (foundUser.userType === "Em" && foundUser.isUser === true) {
            if (foundUser.ipAddress && foundUser.deviceInfo) {
                if (foundUser.ipAddress !== ipAddress) {
                    return res.status(403).json({ message: 'IP address mismatch' });
                }
                if (foundUser.deviceInfo.browser !== deviceInfo.browser ||
                    foundUser.deviceInfo.platform !== deviceInfo.platform ||
                    foundUser.deviceInfo.os !== deviceInfo.os) {
                    return res.status(403).json({ message: 'Device mismatch' });
                }
            } else {
                foundUser.ipAddress = ipAddress;
                foundUser.deviceInfo = deviceInfo;
                await foundUser.save();
            }

        }


        const token = jwt.sign(
            {
                id: foundUser.id,
                userType: foundUser.userType,
            },
            jwtSecret,
            { expiresIn: 3600 * 24 }
        );

        return res.json({
            token,
            message: "Logged in successfully",
            user: {
                id: foundUser.id,
                fullname: foundUser.fullname,
                userType: foundUser.userType,
            },
        });
    } catch (err) {
        return res.status(400).json({ message: "Login failed", err });
    }
};

// Handle GET request at "/api/users/user"
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        return res.status(400).json({ message: "Error fetching user", err });
    }
};
export const getAllUser = async (req, res) => {
    const { userType } = req.user;
    try {
        // let query = {};
        // if (userType === "Admin") { query = { userType: { $in: ["Employee", "Manager", "Admin"] } } }
        // if (userType === "Manager") { query = { userType: { $in: ["Employee", "Manager"] } } }
        // if (userType === "Employee") { query = { userType: { $in: ["Employee"] } } }

        // if (userType !== "Admin") {
        //     return res.status(403).json({ message: "Access denied" });
        // }
        const user = await User.find().select("-password");
        return res.json({
            success: true,
            message: "All users fetched successfully",
            user,
        });
    } catch (err) {
        return res.status(400).json({ message: "Error fetching user", err });
    }
};

// Handle PUT request at "api/users/edit_account" to edit user data
export const editUser = async (req, res) => {
    const { fullname, email, password, verifyPassword, ...updatedFields } = req.body;

    try {
        const userToUpdate = await User.findById(req.user.id);

        if (userToUpdate.email !== email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) return res.status(400).json({ message: "Email is taken" });
        }

        // const existingfullname = await User.findOne({ fullname });
        // if (existingfullname) return res.status(400).json({ message: "fullname is taken" });

        if (password && password !== verifyPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedFields, {
            new: true,
            useFindAndModify: false,
        }).select("-password");

        const token = jwt.sign(
            {
                id: updatedUser.id,
                userType: updatedUser.userType,
            },
            jwtSecret,
            { expiresIn: 3600 }
        );

        return res.status(200).json({
            token,
            message: "Account settings updated",
            user: updatedUser,
        });
    } catch (err) {
        return res.status(400).json({ message: "Couldn't update account", err });
    }
};
