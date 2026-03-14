const https = require('https');

exports.handler = async function(event) {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  function fetchURL(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
        res.on('error', reject);
      });
    });
  }

  try {
    // Search by name instead of handle
    const channelRes = await fetchURL(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=Jude+and+Missy+Pie+God+First&type=channel&maxResults=5&key=${API_KEY}`
    );

    // Return raw results so we can see what YouTube finds
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(channelRes)
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
