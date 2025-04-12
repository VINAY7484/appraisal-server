import express from "express";
import usersRouter from "./usersRoute.js";
import appraisalQuestionRouter from "./appraisalQuestionRoute.js";
import appraisalFormRouter from "./appraisalFormRoute.js";

const allRoutes = express.Router()

allRoutes.use("/users", usersRouter);
allRoutes.use("/appraisal-question", appraisalQuestionRouter);
allRoutes.use("/appraisal-form", appraisalFormRouter);

export default allRoutes;   
