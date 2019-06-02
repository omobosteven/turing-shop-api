import express from 'express';
import QueryValidation from '../../middlewares/validations/QueryValidation';
import CategoriesController from '../../controllers/CategoriesController';

const categories = express.Router();

categories.get('/', QueryValidation.queryValidation, CategoriesController.getCategories);
categories.get('/:category_id', CategoriesController.getCategoryById);
categories.get('/inProduct/:product_id', CategoriesController.getCategoriesOfProduct);
categories.get('/inDepartment/:department_id',
  CategoriesController.getCategoryOfDepartment);

export default categories;
