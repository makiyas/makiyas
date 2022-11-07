import express from "express";

// custom middleware

// product controllers
import { getCities } from "../controllers/citiesController.js";

// initialize router
const router = express.Router();

// api routes
router.route("/").get(getCities);

export default router;
