import express from 'express';
import customers from './customers';

const api = express.Router();

api.use('/customers', customers);

export default api;
