import express from "express";
import { adminAuth, protect } from './../../middlewares/authMiddleware.js';
import {

    create,
    getForms,
    getForm,
} from "../../controllers/appraisalFormController.js";

const router = express.Router();
router.use(protect);
router.post("/:id", create);
router.get("/", getForms);
router.get("/:id", getForm);


export default router;
