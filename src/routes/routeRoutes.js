import { Router } from "express";
import { suggestRoute } from "../controllers/routeController.js";

const router = Router();

/**
 * @swagger
 * /api/route/suggest:
 *   get:
 *     summary: Suggest best departure time & route
 *     tags: [Route]
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route suggestion
 */
router.get("/suggest", suggestRoute);

export default router;
