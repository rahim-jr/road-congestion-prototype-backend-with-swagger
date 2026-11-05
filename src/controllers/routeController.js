import db from "../config/db.js";

/**
 * Helper: find roads whose name or area contains the keyword (case-insensitive).
 */
const findRoadsByKeyword = (keyword) => {
  if (!keyword) return [];
  const like = `%${keyword}%`;
  return db
    .query("SELECT * FROM roads WHERE name LIKE ? OR area LIKE ?")
    .all(like, like);
};

/**
 * GET /api/route/suggest
 * Query: from, to
 */
export const suggestRoute = (req, res, next) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both 'from' and 'to' query params are required",
      });
    }

    const fromRoads = findRoadsByKeyword(from);
    const toRoads = findRoadsByKeyword(to);

    let candidateRoads = [...fromRoads, ...toRoads];
    const seen = new Set();
    candidateRoads = candidateRoads.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    if (candidateRoads.length === 0) {
      candidateRoads = db.query("SELECT * FROM roads").all();
    }

    // Hourly average congestion over last 7 days for candidate roads
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const placeholders = candidateRoads.map(() => "?").join(",");
    const rows = db
      .query(
        `SELECT congestionLevel, reportedAt FROM traffic_data
         WHERE roadId IN (${placeholders}) AND reportedAt >= ?`
      )
      .all(...candidateRoads.map((r) => r.id), since);

    const sums = Array(24).fill(0);
    const counts = Array(24).fill(0);
    rows.forEach((row) => {
      const hour = new Date(row.reportedAt).getHours();
      sums[hour] += row.congestionLevel;
      counts[hour] += 1;
    });
    const hours = sums.map((s, i) => (counts[i] ? Math.round(s / counts[i]) : null));

    // Best departure hour between 6 and 22
    let bestHour = 9;
    let bestVal = Infinity;
    for (let h = 6; h <= 22; h++) {
      const v = hours[h] !== null ? hours[h] : 50;
      if (v < bestVal) {
        bestVal = v;
        bestHour = h;
      }
    }

    const departureTime = `${String(bestHour).padStart(2, "0")}:00`;
    const congestionAtDeparture = hours[bestHour] !== null ? hours[bestHour] : 40;
    const estimatedMinutes = Math.round(30 + congestionAtDeparture * 0.6);

    const forecast = hours.map((v, h) => ({
      hour: `${String(h).padStart(2, "0")}:00`,
      avgCongestion: v,
    }));

    res.status(200).json({
      success: true,
      data: {
        from,
        to,
        suggestedDepartureTime: departureTime,
        estimatedTravelMinutes: estimatedMinutes,
        expectedCongestion: congestionAtDeparture,
        recommendedRoads: candidateRoads.map((r) => ({
          id: r.id,
          name: r.name,
          area: r.area,
        })),
        hourlyForecast: forecast,
      },
    });
  } catch (error) {
    next(error);
  }
};
