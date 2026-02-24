import express from "express";
import { predictDiabetes } from "../controllers/diabetesController.js";

const router = express.Router();

router.post("/predict/diabetes", predictDiabetes);

export default router;