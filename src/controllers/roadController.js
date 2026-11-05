import db from "../config/db.js";

/**
 * GET /api/roads
 * Returns all roads.
 */
export const getAllRoads = (req, res, next) => {
  try {
    const roads = db.query("SELECT * FROM roads ORDER BY area, name").all();
    res.status(200).json({
      success: true,
      count: roads.length,
      data: roads,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/roads/:id
 * Returns a single road by ID.
 */
export const getRoadById = (req, res, next) => {
  try {
    const road = db.query("SELECT * FROM roads WHERE id = ?").get(req.params.id);
    if (!road) {
      return res.status(404).json({ success: false, message: "Road not found" });
    }
    res.status(200).json({ success: true, data: road });
  } catch (error) {
    next(error);
  }
};
