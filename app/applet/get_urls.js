const https = require('https');

https.get('https://reinstore.vercel.app/assets/index-DYjYCyUO.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const urls = data.match(/https?:\/\/[^"'\`\s]+/g) || [];
    console.log("All unique URLs:", [...new Set(urls)]);
  });
});
