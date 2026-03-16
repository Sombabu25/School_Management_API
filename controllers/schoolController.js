const db = require("../db");
const { haversineDistance } = require("../utils/distance");

// POST /addSchool
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    const errors = [];

    if (!name || typeof name !== "string" || name.trim() === "") {
      errors.push("name is required and must be a non-empty string.");
    }

    if (!address || typeof address !== "string" || address.trim() === "") {
      errors.push("address is required and must be a non-empty string.");
    }

    if (latitude === undefined || latitude === null || latitude === "") {
      errors.push("latitude is required.");
    } else if (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90) {
      errors.push("latitude must be a valid number between -90 and 90.");
    }

    if (longitude === undefined || longitude === null || longitude === "") {
      errors.push("longitude is required.");
    } else if (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180) {
      errors.push("longitude must be a valid number between -180 and 180.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const cleanName = name.trim();
    const cleanAddress = address.trim();

    // Insert school
    const [result] = await db.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [cleanName, cleanAddress, lat, lon]
    );

    return res.status(201).json({
      success: true,
      message: "School added successfully.",
      data: {
        id: result.insertId,
        name: cleanName,
        address: cleanAddress,
        latitude: lat,
        longitude: lon,
      },
    });

  } catch (err) {
    console.error("addSchool error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}


// GET /listSchools?latitude=XX&longitude=YY
async function listSchools(req, res) {
  try {
    const { latitude, longitude } = req.query;

    const errors = [];

    if (latitude === undefined || latitude === "") {
      errors.push("latitude query parameter is required.");
    } else if (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90) {
      errors.push("latitude must be a valid number between -90 and 90.");
    }

    if (longitude === undefined || longitude === "") {
      errors.push("longitude query parameter is required.");
    } else if (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180) {
      errors.push("longitude must be a valid number between -180 and 180.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // Fetch schools
    const [schools] = await db.query(
      "SELECT id, name, address, latitude, longitude FROM schools"
    );

    // Calculate distance
    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance_km: haversineDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      count: sortedSchools.length,
      user_location: {
        latitude: userLat,
        longitude: userLon,
      },
      data: sortedSchools,
    });

  } catch (err) {
    console.error("listSchools error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

module.exports = {
  addSchool,
  listSchools,
};