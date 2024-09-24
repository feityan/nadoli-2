require("dotenv").config();

const ghostContentAPI = require("@tryghost/content-api");

// Import stripDomain function
const { stripDomain } = require('../../.eleventy.js');

// Init Ghost API
const api = new ghostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: "v5"
});

// Get all site information
module.exports = async function() {
  const siteData = await api.settings
    .browse({
      include: "icon,url"
    })
    .catch(err => {
      console.error(err);
    });

  if (process.env.SITE_URL) siteData.url = process.env.SITE_URL;

  // Process navigation URLs if they exist
  if (siteData.navigation) {
    siteData.navigation = siteData.navigation.map(item => ({
      ...item,
      url: stripDomain(item.url)
    }));
  }

  return siteData;
};
