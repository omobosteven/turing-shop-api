import express from 'express';
import ProductController from '../../controllers/ProductController';
import QueryValidation from '../../middlewares/validations/QueryValidation';

const products = express.Router();

products.get('/', QueryValidation.queryValidation, ProductController.getProducts);

export default products;
