const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/api/fetch', async (req, res) => {
    const { url } = req.query;
    try {
        const response = await axios.get(url);
        return res.json({ content: response.data });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch URL' });
    }
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
