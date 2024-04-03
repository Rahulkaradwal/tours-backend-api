const express = require('express');
const { dirname } = require('path');
const app = express();
const port = 3000;
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('tours-simple.json'));

app.use(express.json());

const getAllTours = (req, res) => {
  res.status(200).json({
    totalResults: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    data: { tour },
  });
};

const deleteTour = (req, res) => {
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
};

app.route('/api/tours').get(getAllTours).post(createTour);

app.route('/api/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.listen(port, () => {
  console.log('Server is running on port :', port);
});
