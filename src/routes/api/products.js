import express from 'express';
import ProductController from '../../controllers/ProductController';
import QueryValidation from '../../middlewares/validations/QueryValidation';
import ReviewInputValidation from '../../middlewares/validations/ReviewInputValidation';
import Authenticate from '../../middlewares/Authenticate';

const products = express.Router();

products.get('/', QueryValidation.queryValidation, ProductController.getProducts);
products.get('/search',
  QueryValidation.queryValidation, ProductController.searchProduct);
products.get('/:product_id', ProductController.getProductById);
products.get('/inCategory/:category_id',
  QueryValidation.queryValidation, ProductController.getCategoryProduct);
products.get('/inDepartment/:department_id',
  QueryValidation.queryValidation, ProductController.getDepartmentProduct);
products.get('/:product_id/details', ProductController.getProductDetails);
products.get('/:product_id/locations', ProductController.getProductLocations);
products.get('/:product_id/reviews', ProductController.getProductReviews);

products.use(Authenticate.auth);

products.post('/:product_id/reviews',
  ReviewInputValidation.reviewValidation, ProductController.createProductReview);

export default products;
