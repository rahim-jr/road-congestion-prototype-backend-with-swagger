import "dotenv/config";
import db from "../config/db.js";

const seedRoads = [
  { name: "Mirpur Road", area: "Mirpur", lat: 23.8069, lng: 90.3687, freeFlowSpeed: 30 },
  { name: "Farmgate Intersection", area: "Farmgate", lat: 23.7566, lng: 90.3896, freeFlowSpeed: 25 },
  { name: "Motijheel Commercial Area", area: "Motijheel", lat: 23.733, lng: 90.4172, freeFlowSpeed: 28 },
  { name: "Gulshan Avenue", area: "Gulshan", lat: 23.7925, lng: 90.4078, freeFlowSpeed: 35 },
  { name: "Banani Road", area: "Banani", lat: 23.7937, lng: 90.4043, freeFlowSpeed: 32 },
  { name: "Dhanmondi Road 27", area: "Dhanmondi", lat: 23.7461, lng: 90.3742, freeFlowSpeed: 30 },
  { name: "Uttara Sector 7 Road", area: "Uttara", lat: 23.8759, lng: 90.3795, freeFlowSpeed: 40 },
  { name: "Mohakhali Flyover", area: "Mohakhali", lat: 23.778, lng: 90.404, freeFlowSpeed: 45 },
  { name: "Shahbagh Intersection", area: "Shahbagh", lat: 23.7389, lng: 90.3944, freeFlowSpeed: 25 },
  { name: "Paltan Road", area: "Paltan", lat: 23.737, lng: 90.413, freeFlowSpeed: 28 },
  { name: "Tejgaon Industrial Road", area: "Tejgaon", lat: 23.763, lng: 90.4, freeFlowSpeed: 30 },
  { name: "Airport Road", area: "Airport", lat: 23.843, lng: 90.403, freeFlowSpeed: 50 },
];

const run = () => {
  const count = db.query("SELECT COUNT(*) as c FROM roads").get().c;
  if (count > 0) {
    console.log(`Roads already seeded (${count}). Skipping.`);
    process.exit(0);
  }

  const stmt = db.prepare(
    `INSERT INTO roads (name, area, lat, lng, freeFlowSpeed) VALUES (?, ?, ?, ?, ?)`
  );
  const insertMany = db.transaction((rows) => {
    for (const r of rows) {
      stmt.run(r.name, r.area, r.lat, r.lng, r.freeFlowSpeed);
    }
  });
  insertMany(seedRoads);
  console.log(`Seeded ${seedRoads.length} roads.`);
  process.exit(0);
};

run();
