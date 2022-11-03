const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());

app.get('/', async (req, res) => {
    res.send('ema-john server is running');
})

app.listen(port, () => {
    console.log("server is running on port:", port);
})