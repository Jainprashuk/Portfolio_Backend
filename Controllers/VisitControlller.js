const fetch = require('node-fetch'); // If you're using fetch to get the location based on IP
const Visit = require('../Model/visits.js');

// Helper function to get the client's IP address
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

// Function to get geolocation based on IP
async function getLocationByIP(ip) {
  const url = `http://api.ipstack.com/${ip}?access_key=c0280e2e43cd50e6c2acaffb422c78b2`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      country: data.country_name,
      region: data.region_name,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

exports.Visitcontroller = async (req, res) => {
  if (req.method === "POST") {
    const { userId, timestamp } = req.body;

    if (!userId || !timestamp) {
      return res.status(400).json({ message: "User ID and Timestamp are required." });
    }

    try {
      // Get the client's IP address
      const ip = getClientIP(req);
      console.log('Client IP:', ip); // Log the IP to check

      // Get location based on IP
      const location = await getLocationByIP(ip);

      // Check if the user has already visited (based on userId)
      const existingVisit = await Visit.findOne({ userId });

      if (existingVisit) {
        // If the user exists, increment the count by 1
        existingVisit.count += 1;
        existingVisit.timestamp = timestamp;  // Optional: Update timestamp if necessary
        existingVisit.ip = ip;  // Store the IP address
        existingVisit.location = location || existingVisit.location; // Store location if new
        await existingVisit.save();  // Save the updated visit record

        return res.status(200).json({ message: "Visit count incremented successfully." });
      } else {
        // If the user doesn't exist, create a new visit record
        const newVisit = new Visit({ userId, timestamp, ip, location });
        await newVisit.save();

        return res.status(200).json({ message: "Visit tracked successfully." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error tracking visit." });
    }
  } else if (req.method === "GET") {
    try {
      const visits = await Visit.find();
      return res.status(200).json(visits);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error retrieving visits." });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};
