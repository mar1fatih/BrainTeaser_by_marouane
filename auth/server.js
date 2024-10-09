import express from 'express';
import cors from 'cors';
import router from './routes/index';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
