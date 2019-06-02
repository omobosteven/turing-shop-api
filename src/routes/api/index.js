import express from 'express';
import customers from './customers';
import customer from './customer';
import products from './products';
import departments from './departments';

const api = express.Router();

api.use('/customer', customer);
api.use('/customers', customers);
api.use('/products', products);
api.use('/departments', departments);

export default api;
