import express from 'express';
import customers from './customers';
import customer from './customer';
import products from './products';
import departments from './departments';
import categories from './categories';
import attributes from './attributes';

const api = express.Router();

api.use('/customer', customer);
api.use('/customers', customers);
api.use('/products', products);
api.use('/departments', departments);
api.use('/categories', categories);
api.use('/attributes', attributes);

export default api;
