import express from 'express';
import customers from './customers';
import products from './products';

const api = express.Router();

api.use('/customers', customers);
api.use('/products', products);

export default api;
