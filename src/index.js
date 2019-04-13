import express from 'express';
import CustomerController from './controllers/CustomerController';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Turing App!!!'
}));

app.get('/user', CustomerController.getAllUser);

app.listen(port, () => console.log(`app listening on port ${port}!`));
