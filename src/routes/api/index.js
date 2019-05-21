import express from 'express';
import customers from './customers';
import customer from './customer';
import products from './products';

const api = express.Router();

api.use('/customer', customer);
api.use('/customers', customers);
api.use('/products', products);

export default api;
