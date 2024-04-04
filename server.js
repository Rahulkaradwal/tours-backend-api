const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 8000;

const app = require('./app');

app.listen(port, () => {
  console.log('Server is running on port :', port);
});
