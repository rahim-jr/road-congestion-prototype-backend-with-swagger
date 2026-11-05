import { Router } from "express";
import { getAllRoads, getRoadById } from "../controllers/roadController.js";

const router = Router();

/**
 * @swagger
 * /api/roads:
 *   get:
 *     summary: Get all roads
 *     tags: [Roads]
 *     responses:
 *       200:
 *         description: List of all roads
 */
router.get("/", getAllRoads);

/**
 * @swagger
 * /api/roads/{id}:
 *   get:
 *     summary: Get road by ID
 *     tags: [Roads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Road details
 *       404:
 *         description: Road not found
 */
router.get("/:id", getRoadById);

export default router;
