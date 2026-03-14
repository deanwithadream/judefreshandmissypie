const https = require('https');

exports.handler = async function(event) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const handle = 'god1stJudeandMissyPie';

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
    // Step 1: find channel ID
    const search = await fetchURL(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${handle}&type=channel&maxResults=1&key=${API_KEY}`
    );
    const channelId = search.items[0].snippet.channelId;

    // Step 2: get latest videos
    const videos = await fetchURL(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=8&order=date&type=video&key=${API_KEY}`
    );

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(videos)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
