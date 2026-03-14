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
    // Use the channel handle directly to get channel info
    const channelRes = await fetchURL(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=god1stJudeandMissyPie&key=${API_KEY}`
    );

    if (!channelRes.items || channelRes.items.length === 0) {
      throw new Error('Channel not found');
    }

    const channelId = channelRes.items[0].id;

    // Get latest videos
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
