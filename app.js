const express = require('express');
const { dirname } = require('path');
const app = express();
const port = 3000;
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('tours-simple.json'));

app.get('/api/tours', (req, res) => {
  res.status(200).json({
    data: { tours },
  });
});

app.listen(port, () => {
  console.log('Server is running on port :', port);
});
