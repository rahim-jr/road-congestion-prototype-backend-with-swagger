import { Router } from "express";
import {
  reportTraffic,
  addTrafficData,
  getTrafficDataById,
  updateTrafficData,
  getCurrentTraffic,
  getTrafficHistory,
} from "../controllers/trafficController.js";

const router = Router();

/**
 * @swagger
 * /api/traffic/report:
 *   post:
 *     summary: User reports congestion/accident/roadblock
 *     tags: [Traffic]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roadId, congestionLevel]
 *             properties:
 *               roadId:
 *                 type: string
 *               congestionLevel:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               type:
 *                 type: string
 *                 enum: [normal, jam, accident, roadblock]
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report created
 */
router.post("/report", reportTraffic);

/**
 * @swagger
 * /api/traffic/data:
 *   post:
 *     summary: Add congestion data (admin/system/sensors)
 *     tags: [Traffic]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roadId, congestionLevel]
 *             properties:
 *               roadId:
 *                 type: string
 *               congestionLevel:
 *                 type: number
 *               source:
 *                 type: string
 *                 enum: [user, sensor, admin, system]
 *     responses:
 *       201:
 *         description: Data added
 */
router.post("/data", addTrafficData);

/**
 * @swagger
 * /api/traffic/data/{id}:
 *   get:
 *     summary: Get a congestion record by ID
 *     tags: [Traffic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Congestion record details
 *       404:
 *         description: Record not found
 */
router.get("/data/:id", getTrafficDataById);

/**
 * @swagger
 * /api/traffic/data/{id}:
 *   put:
 *     summary: Update congestion record
 *     tags: [Traffic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               congestionLevel:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 */
router.put("/data/:id", updateTrafficData);

/**
 * @swagger
 * /api/traffic/current:
 *   get:
 *     summary: Get current congestion
 *     tags: [Traffic]
 *     parameters:
 *       - in: query
 *         name: roadId
 *         schema:
 *           type: string
 *         description: Optional road id
 *     responses:
 *       200:
 *         description: Current congestion data
 */
router.get("/current", getCurrentTraffic);

/**
 * @swagger
 * /api/traffic/history:
 *   get:
 *     summary: Get past congestion data
 *     tags: [Traffic]
 *     parameters:
 *       - in: query
 *         name: roadId
 *         schema:
 *           type: string
 *       - in: query
 *         name: hours
 *         schema:
 *           type: number
 *         description: Hours to look back (default 24)
 *     responses:
 *       200:
 *         description: Historical congestion data
 */
router.get("/history", getTrafficHistory);

export default router;
