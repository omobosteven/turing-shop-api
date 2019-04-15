import express from 'express';
import passport from 'passport';
import router from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Turing App!!!'
}));

app.use(router);

app.listen(port, () => console.log(`app listening on port ${port}!`));

export default app;
