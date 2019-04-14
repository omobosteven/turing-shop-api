import express from 'express';
import AuthInputValidation from '../../middlewares/validations/AuthInputValidation';
import CustomerController from '../../controllers/CustomerController';

const customers = express.Router();

customers.post('/register',
  AuthInputValidation.signUpInputValidation, CustomerController.customerSignup);
customers.post('/login',
  AuthInputValidation.loginInputValidation, CustomerController.customerLogin);

export default customers;
