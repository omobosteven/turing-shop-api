import express from 'express';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(200).json({
    status: 200,
    message: 'Turing App!!!'
}));

app.listen(port, () => console.log(`app listening on port ${port}!`));
