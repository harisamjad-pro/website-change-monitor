const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/api/fetch', async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Example: Extract specific elements for comparison
    const pageData = {
      textContent: $('body').text(), // Extract text content
      styles: $('body').find('*').map((i, el) => $(el).attr('style')).get(), // Extract inline styles
      classNames: $('body').find('*').map((i, el) => $(el).attr('class')).get(), // Extract class names
    };

    return res.json({ content: response.data, pageData });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch URL' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
