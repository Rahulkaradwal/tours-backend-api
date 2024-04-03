const express = require('express');
const { dirname } = require('path');
const app = express();
const port = 3000;
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('tours-simple.json'));

app.use(express.json());

// get all tours
app.get('/api/tours', (req, res) => {
  res.status(200).json({
    totalResults: tours.length,
    data: { tours },
  });
});

// get a tour
app.get('/api/tours/:id', (req, res) => {
  const id = req.params.id * 1; // to convert string into number we mulitplied by number

  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invlid ID',
    });
  }
  res.status(200).json({
    data: { tour },
  });
});

// add a tour
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

// update a tour
app.patch('/api/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    data: { tour },
  });
});

// delete a tour
app.delete('/api/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

app.listen(port, () => {
  console.log('Server is running on port :', port);
});
