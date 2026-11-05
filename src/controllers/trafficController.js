import db from "../config/db.js";

/**
 * POST /api/traffic/report
 * User reports congestion/accident/roadblock.
 */
export const reportTraffic = (req, res, next) => {
  try {
    const { roadId, congestionLevel, type, note } = req.body;

    const road = db.query("SELECT id FROM roads WHERE id = ?").get(roadId);
    if (!road) {
      return res.status(404).json({ success: false, message: "Road not found" });
    }

    const reportedAt = new Date().toISOString();
    const stmt = db.prepare(
      `INSERT INTO traffic_data (roadId, congestionLevel, type, source, note, reportedAt)
       VALUES (?, ?, ?, 'user', ?, ?)`
    );
    const info = stmt.run(roadId, congestionLevel, type || "normal", note || "", reportedAt);
    const record = db.query("SELECT * FROM traffic_data WHERE id = ?").get(info.lastInsertRowid);

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/traffic/data
 * Add congestion data from admin/system/sensors.
 */
export const addTrafficData = (req, res, next) => {
  try {
    const { roadId, congestionLevel, source } = req.body;

    const road = db.query("SELECT id FROM roads WHERE id = ?").get(roadId);
    if (!road) {
      return res.status(404).json({ success: false, message: "Road not found" });
    }

    const reportedAt = new Date().toISOString();
    const stmt = db.prepare(
      `INSERT INTO traffic_data (roadId, congestionLevel, type, source, note, reportedAt)
       VALUES (?, ?, 'normal', ?, '', ?)`
    );
    const info = stmt.run(roadId, congestionLevel, source || "system", reportedAt);
    const record = db.query("SELECT * FROM traffic_data WHERE id = ?").get(info.lastInsertRowid);

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/traffic/data/:id
 * Get a specific traffic data record by ID.
 */
export const getTrafficDataById = (req, res, next) => {
  try {
    const record = db
      .query(
        `SELECT t.*, r.name, r.area
         FROM traffic_data t JOIN roads r ON r.id = t.roadId
         WHERE t.id = ?`
      )
      .get(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/traffic/data/:id
 * Update a congestion record.
 */
export const updateTrafficData = (req, res, next) => {
  try {
    const { congestionLevel, note } = req.body;
    const existing = db.query("SELECT * FROM traffic_data WHERE id = ?").get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const newLevel = congestionLevel !== undefined ? congestionLevel : existing.congestionLevel;
    const newNote = note !== undefined ? note : existing.note;
    const updatedAt = new Date().toISOString();

    db.prepare(
      `UPDATE traffic_data SET congestionLevel = ?, note = ?, updatedAt = ? WHERE id = ?`
    ).run(newLevel, newNote, updatedAt, req.params.id);

    const record = db.query("SELECT * FROM traffic_data WHERE id = ?").get(req.params.id);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/traffic/current
 * Get current congestion. If roadId provided, latest for that road.
 * Otherwise latest reading per road.
 */
export const getCurrentTraffic = (req, res, next) => {
  try {
    const { roadId } = req.query;

    if (roadId) {
      const latest = db
        .query(
          `SELECT t.*, r.name, r.area
           FROM traffic_data t JOIN roads r ON r.id = t.roadId
           WHERE t.roadId = ?
           ORDER BY t.reportedAt DESC, t.id DESC
           LIMIT 1`
        )
        .get(roadId);
      if (!latest) {
        return res.status(404).json({ success: false, message: "No data for this road" });
      }
      return res.status(200).json({ success: true, data: latest });
    }

    const roads = db.query("SELECT id FROM roads").all();
    const results = roads
      .map((r) => {
        return db
          .query(
            `SELECT t.*, r.name, r.area
             FROM traffic_data t JOIN roads r ON r.id = t.roadId
             WHERE t.roadId = ?
             ORDER BY t.reportedAt DESC, t.id DESC
             LIMIT 1`
          )
          .get(r.id);
      })
      .filter(Boolean);

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/traffic/history
 * Query: roadId (optional), hours (default 24).
 */
export const getTrafficHistory = (req, res, next) => {
  try {
    const { roadId, hours = 24 } = req.query;
    const since = new Date(Date.now() - Number(hours) * 60 * 60 * 1000).toISOString();

    let sql = `SELECT t.*, r.name, r.area
               FROM traffic_data t JOIN roads r ON r.id = t.roadId
               WHERE t.reportedAt >= ?`;
    const params = [since];
    if (roadId) {
      sql += " AND t.roadId = ?";
      params.push(roadId);
    }
    sql += " ORDER BY t.reportedAt DESC";

    const records = db.query(sql).all(...params);
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    next(error);
  }
};
