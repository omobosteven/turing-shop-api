import express from 'express';
import ProductController from '../../controllers/ProductController';
import ReviewController from '../../controllers/ReviewController';
import QueryValidation from '../../middlewares/validations/QueryValidation';
import ReviewInputValidation from '../../middlewares/validations/ReviewInputValidation';
import Authenticate from '../../middlewares/Authenticate';

const products = express.Router();

products.get('/', QueryValidation.queryValidation, ProductController.getProducts);
products.get('/:id', ProductController.getProduct);
products.get('/:id/reviews',
  QueryValidation.queryValidation, ReviewController.getReviews);

products.use(Authenticate.auth);

products.post('/:id/reviews',
  ReviewInputValidation.reviewValidation, ReviewController.createReview);
products.put('/:id/reviews/:reviewId',
  ReviewInputValidation.updateReviewValidation, ReviewController.updateReview);
products.delete('/:id/reviews/:reviewId', ReviewController.deleteReview);

export default products;
