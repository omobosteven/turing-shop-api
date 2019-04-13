import express from 'express';
import AuthInputValidation from '../../middlewares/validations/AuthInputValidation';
import CustomerController from '../../controllers/CustomerController';

const customers = express.Router();

customers.post('/register',
  AuthInputValidation.signUpInputValidation, CustomerController.customerSignup);

export default customers;
