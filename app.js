const express = require('express');
const { dirname } = require('path');
const app = express();
const port = 3000;
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('tours-simple.json'));

app.use(express.json());

app.get('/api/tours', (req, res) => {
  res.status(200).json({
    totalResults: tours.length,
    data: { tours },
  });
});

app.post('/api/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile('tours-simple.json', JSON.stringify(tours), (err) => {
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
});

app.listen(port, () => {
  console.log('Server is running on port :', port);
});
