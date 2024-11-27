import express from "express"
import {createPrivKey} from "../controllers/fluxController.js";

const router = express.Router()

router.post("/priv", createPrivKey);

export default router;